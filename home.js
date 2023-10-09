const apiUrl = "/data_trend_analysis"; // Replace with your actual server route
axios.get(apiUrl)
    .then((response) => {
        // Assuming that `response.data` contains the chart data
        this.chartData = response.data;
        // Log chart data for debugging
        console.log(`Chart Data:`, this.chartData);
        // Create and update the chart image
        this.updateChartImage();
        this.isDataAnalysis = true;
    })
    .catch((error) => {
        console.error('Error performing data trend analysis:', error);
    });

},

updateChartImage() {
    if (this.chartData.correlation_chart_image) {
        const chartImage = document.getElementById('chart-image');
        chartImage.src = `data:image/png;base64,${this.chartData.correlation_chart_image}`;
    }
},

createBarChart() {
    if (this.chartData) {
        // Extract data for the chart
        const labels = Object.keys(this.chartData);
        const values = Object.values(this.chartData);
        // Remove any existing canvas
        const existingCanvas = document.getElementById('chartCanvas');
        if (existingCanvas) {
            existingCanvas.parentNode.removeChild(existingCanvas);
        }
        // Create a new canvas element for the chart
        const canvas = document.createElement('canvas');
        canvas.id = 'chartCanvas'; // Set the canvas ID
        const chartContainer = document.getElementById('chart-container');
        chartContainer.appendChild(canvas);
        // Get the context for the canvas
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 300;
        // Create the bar chart using Chart.js
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Sales vs. Marketing Avenues',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
},

dataAnalysis() {
    const apiUrl = "/data_trend_analysis";
    axios.get(apiUrl)
        .then((response) => {
            this.chartData = response.data;
            this.updateChartImage();
            this.displayRecommendations();
        })
        .catch((error) => {
            console.error('Error performing data trend analysis:', error);
        });
},

updateChartImage() {
    if (this.chartData.correlation_chart_image) {
        const chartImage = document.getElementById('chart-image');
        chartImage.src = `data:image/png;base64,${this.chartData.correlation_chart_image}`;
    }
},

displayRecommendations() {
    if (this.chartData.correlation_data) {
        const recommendationsContainer = document.getElementById('recommendations-container');
        recommendationsContainer.innerHTML = `
            <h2>Recommendations</h2>
            <p>Based on the data analysis, allocate your budget to the marketing avenue with the highest positive correlation with Sales.</p>
            <p>Here are the correlations:</p>
            <ul>
                <li>TV: ${this.chartData.correlation_data.TV}</li>
                <li>Radio: ${this.chartData.correlation_data.Radio}</li>
                <li>Social Media: ${this.chartData.correlation_data['Social Media']}</li>
            </ul>
        `;
    }
}
