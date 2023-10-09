# Function to perform data analysis (correlation matrix in visual format)
def perform_data_analysis(data):
    try:
        # Calculate the relationship between sales and marketing avenues
        if isinstance(data, pd.DataFrame):
            # 'TV', 'Radio', and 'Social Media' columns represent marketing avenues
            marketing_avenues = ['TV', 'Radio', 'Social Media']
            relationship_data = {}
            for avenue in marketing_avenues:
                correlation = data['Sales'].corr(data[avenue])
                relationship_data[avenue] = correlation
            return relationship_data
        else:
            return None
    except Exception as e:
        print(f"Error performing data analysis: {str(e)}")
        return None
