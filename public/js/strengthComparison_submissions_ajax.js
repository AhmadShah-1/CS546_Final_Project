(function ($) {
    let exerciseSelect = $('#exercise-select');
    let submissionsTableBody = $('#submissions-table-body');
    let errorAlert = $('#error-alert');

    function buildTableRow(entry) {
        let dateString = new Date(entry.date).toLocaleString();
        return $(`
      <tr>
        <td>${dateString}</td>
        <td>${entry.exercise}</td>
        <td>${entry.weight} kg</td>
        <td>${entry.reps}</td>
        <td>${entry.oneRepMax} kg</td>
      </tr>
    `);
    }

    function loadUserSubmissions(exercise) {
        errorAlert.hide();
        submissionsTableBody.empty();

        $.ajax({
            method: 'GET',
            url: `/strengthComparisons/api/submissions?exercise=${encodeURIComponent(exercise)}`
        })
            .then((submissions) => {
                if (!submissions || submissions.length === 0) {
                    submissionsTableBody.append(`<tr><td colspan="5">No submissions found.</td></tr>`);
                } else {
                    for (let entry of submissions) {
                        let row = buildTableRow(entry);
                        submissionsTableBody.append(row);
                    }
                }
            })
            .fail((jqXHR) => {
                let err = jqXHR.responseJSON?.error || 'Error fetching submissions';
                errorAlert.text(err).show();
            });
    }

    loadUserSubmissions('bench_press');

    exerciseSelect.on('change', function () {
        let selectedExercise = $(this).val();
        loadUserSubmissions(selectedExercise);
    });
})(window.jQuery);
