function renderProgressChart(progressEntries) {
    const metricSelector = document.getElementById('metricSelector');
    const ctx = document.getElementById('progressChart').getContext('2d');
    let chartInstance;

    function drawChart(metric) {
        if (chartInstance) chartInstance.destroy();

        const labels = progressEntries.map(entry => entry.date);
        const data = progressEntries.map(entry => entry.metrics[metric]);

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${metric.charAt(0).toUpperCase() + metric.slice(1)} Progress`,
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                    x: { title: { display: true, text: 'Time' } },
                    y: { title: { display: true, text: `${metric} (lbs)` } }
                }
            }
        });
    }

    drawChart('weight');

    metricSelector.addEventListener('change', () => { // Redraw chart when new metric added
        drawChart(metricSelector.value);
    });
}

renderProgressChart(progressEntries);
