(function ($) {
    let chartCanvas = $('#strength-chart');
    let exerciseSelect = $('#exercise-select');
    let errorAlert = $('#error-alert');

    let chartInstance = null;

    function renderChart(userEntry, otherEntries) {
        if (chartInstance) {
            chartInstance.destroy();
        }

        let userData = [];
        if (userEntry) {
            userData.push({ x: userEntry.oneRepMax, y: 0 });
        }

        let othersData = [];
        otherEntries.forEach((entry, index) => {
            othersData.push({ x: entry.oneRepMax, y: index + 1 });
        });

        let maxX = 0;
        othersData.forEach(pt => { if (pt.x > maxX) maxX = pt.x; });
        if (userData.length && userData[0].x > maxX) {
            maxX = userData[0].x;
        }
        maxX = Math.ceil(maxX * 1.1);

        let ctx = chartCanvas[0].getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Current User',
                        data: userData,
                        backgroundColor: 'red',
                        pointRadius: 6
                    },
                    {
                        label: 'Others',
                        data: othersData,
                        backgroundColor: 'blue',
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        min: 0,
                        max: maxX,
                        title: { display: true, text: 'One Rep Max (lbs)' }
                    },
                    y: {
                        title: { display: true, text: 'Users' },
                        ticks: { display: false }
                    }
                }
            }
        });
    }

    function loadChartData(exercise) {
        errorAlert.hide();
        $.ajax({
            method: 'GET',
            url: `/strengthComparisons/api/chart?exercise=${encodeURIComponent(exercise)}`
        })
            .then((data) => {
                let { userEntry, otherEntries } = data;
                renderChart(userEntry, otherEntries);
            })
            .fail((jqXHR) => {
                let err = jqXHR.responseJSON?.error || 'Error loading chart data.';
                errorAlert.text(err).show();
            });
    }

    loadChartData('bench_press');

    exerciseSelect.on('change', function () {
        let ex = $(this).val();
        loadChartData(ex);
    });
})(window.jQuery);
