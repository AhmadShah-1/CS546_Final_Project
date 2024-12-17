function renderProgressChart(fitnessGoals, progressEntries) {
    console.log('Fitness Goals:', fitnessGoals);
    console.log('Progress Entries:', progressEntries);

    const labels = ['Start', ...progressEntries.map(entry => entry.date), 'Goal'];
    const data = [
        fitnessGoals.currentWeight,
        ...progressEntries.map(entry => entry.metrics),
        fitnessGoals.targetWeight
    ];

    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weight Progress',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { title: { display: true, text: 'Weight (kg)' } }
            }
        }
    });
}