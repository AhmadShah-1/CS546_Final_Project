(function ($) {
    let workoutPlansContainer = $('#workout-plans-container');
    let errorAlert = $('#error-alert');

    let newPlanForm = $('#new-workout-form');
    let planNameInput = $('#plan-name');
    let addExerciseBtn = $('#add-exercise-btn');
    let exercisesContainer = $('#exercises-container');

    function createExerciseRow() {
        const row = $(`
            <div class="exercise-row">
                <label>Exercise Name: <input type="text" class="exerciseName" required /></label>
                <label>Sets: <input type="number" class="exerciseSets" required /></label>
                <label>Reps: <input type="number" class="exerciseReps" required /></label>
                <button type="button" class="remove-exercise-btn">Remove</button>
            </div>
        `);
        return row;
    }

    function createWorkoutPlanElement(plan) {
        let planDiv = $('<div>')
            .addClass('workout-plan-item')
            .attr('data-id', plan._id);

        let h3 = $('<h3>').text(plan.planName);

        let ul = $('<ul>');
        plan.exercises.forEach((ex) => {
            let li = $('<li>').text(`${ex.exerciseName} - ${ex.sets} sets of ${ex.reps} reps`);
            ul.append(li);
        });

        planDiv.append(h3).append(ul);
        return planDiv;
    }

    function loadAllPlans() {
        $.ajax({
            method: 'GET',
            url: '/workoutPlans/api/workoutPlans'
        })
            .then((plans) => {
                workoutPlansContainer.empty();
                for (let plan of plans) {
                    let planDom = createWorkoutPlanElement(plan);
                    workoutPlansContainer.append(planDom);
                }
            })
            .fail((jqXHR) => {
                errorAlert.text('Error loading workout plans: ' + jqXHR.responseText).show();
            });
    }

    loadAllPlans();

    exercisesContainer.append(createExerciseRow());

    addExerciseBtn.on('click', function () {
        exercisesContainer.append(createExerciseRow());
    });

    exercisesContainer.on('click', '.remove-exercise-btn', function () {
        $(this).closest('.exercise-row').remove();
    });

    newPlanForm.submit(function (event) {
        event.preventDefault();
        errorAlert.hide();

        let planNameVal = planNameInput.val().trim();
        if (!planNameVal) {
            errorAlert.text('Plan Name is required.').show();
            return;
        }

        let exercises = [];
        exercisesContainer.find('.exercise-row').each(function () {
            let exName = $(this).find('.exerciseName').val().trim();
            let exSets = $(this).find('.exerciseSets').val();
            let exReps = $(this).find('.exerciseReps').val();
            if (exName && exSets && exReps) {
                exercises.push({
                    exerciseName: exName,
                    sets: exSets,
                    reps: exReps
                });
            }
        });

        if (exercises.length === 0) {
            errorAlert.text('Please add at least one exercise.').show();
            return;
        }

        $.ajax({
            method: 'POST',
            url: '/workoutPlans/api/workoutPlans',
            contentType: 'application/json',
            data: JSON.stringify({
                planName: planNameVal,
                exercises: exercises
            })
        })
            .then((newPlan) => {
                let planDom = createWorkoutPlanElement(newPlan);
                workoutPlansContainer.append(planDom);

                planNameInput.val('');
                exercisesContainer.empty();
                exercisesContainer.append(createExerciseRow());
                planNameInput.focus();
            })
            .fail((jqXHR) => {
                let errMsg = jqXHR.responseJSON?.error || 'Error creating workout plan.';
                errorAlert.text(errMsg).show();
            });
    });
})(window.jQuery);
