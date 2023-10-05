import os
from flask import Flask, request, render_template, flash, send_from_directory
import pandas as pd
import pickle
import joblib
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Load the machine learning model when the Flask app starts
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

app.secret_key = 'supersecretkey'  # Change this to a secure secret key.
UPLOAD_FOLDER = 'static/files'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        try:
            uploaded_file = request.files['file']
            if uploaded_file.filename != '':
                # Save the uploaded file in the UPLOAD_FOLDER
                filename = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_file.filename)
                uploaded_file.save(filename)

                # Read the dataset using pandas
                df = pd.read_csv(filename)

                # Get dataset properties
                dataset_name = uploaded_file.filename
                num_columns = len(df.columns)
                num_rows = len(df)

                # Get column names
                column_names = df.columns.tolist()  # Convert column names to a list

                # Display success message, dataset properties, and column names
                flash('File loaded successfully!', 'success')
                return render_template('home.html', dataset_name=dataset_name, num_columns=num_columns, num_rows=num_rows, column_names=column_names)
            else:
                flash('No file selected!', 'danger')
        except Exception as e:
            flash(f'Error: {str(e)}', 'danger')
    return render_template('home.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        budget = float(request.form['budget'])  # Get budget from user input
        predicted_sales = model.predict([[budget]])[0]
        return f'Predicted Sales for Budget {budget}: {predicted_sales}'
    except Exception as e:
        return f'Error predicting sales: {str(e)}'
    
@app.route('/', methods=['GET'])
def index():
    return render_template('budget_predictions.html')


if __name__ == '__main__':
    app.run(debug=True)
