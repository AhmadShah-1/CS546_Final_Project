
(function ($) {
    let nutritionPlansContainer = $('#nutrition-plans-container');
    let errorAlert = $('#error-alert');

    
    let newPlanForm = $('#new-nutrition-form');
    let planNameInput = $('#plan-name');
    let addMealBtn = $('#add-meal-btn');
    let mealsContainer = $('#meals-container');
  
    function createMealRow() {
        return $(`
      <div class="meal-row">
        <label>Meal Type: <input type="text" class="mealType" required /></label>
        <label>Items (comma separated): <input type="text" class="mealItems" required /></label>
        <button type="button" class="remove-meal-btn">Remove Meal</button>
      </div>
    `);
    }

    function createNutritionPlanElement(plan) {
        let planDiv = $('<div>')
            .addClass('nutrition-plan-item')
            .attr('data-id', plan._id);
        let h3 = $('<h3>').text(plan.planName);

        let ul = $('<ul>');
        plan.meals.forEach((meal) => {
            let itemsText = meal.items.join(', ');
            let li = $('<li>').text(`${meal.mealType}: ${itemsText}`);
            ul.append(li);
        });

        planDiv.append(h3).append(ul);
        return planDiv;
    }

    function loadAllPlans() {
        $.ajax({
            method: 'GET',
            url: '/nutritionPlans/api/nutritionPlans'
        })
            .then((plans) => {
                nutritionPlansContainer.empty();
                for (let plan of plans) {
                    let planDom = createNutritionPlanElement(plan);
                    nutritionPlansContainer.append(planDom);
                }
            })
            .fail((jqXHR) => {
                errorAlert.text('Error loading nutrition plans: ' + jqXHR.responseText).show();
            });
    }
    
    loadAllPlans();

    mealsContainer.append(createMealRow());
    addMealBtn.on('click', function () {
        mealsContainer.append(createMealRow());
    });

    
    mealsContainer.on('click', '.remove-meal-btn', function () {
        $(this).closest('.meal-row').remove();
    });

    
    newPlanForm.submit(function (event) {
        event.preventDefault();
        errorAlert.hide();

        let planNameVal = planNameInput.val().trim();
        if (!planNameVal) {
            errorAlert.text('Plan Name is required.').show();
            return;
        }

        
        let meals = [];
        mealsContainer.find('.meal-row').each(function () {
            let mType = $(this).find('.mealType').val().trim();
            let mItems = $(this).find('.mealItems').val().trim();
            if (mType && mItems) {
                
                let itemsArr = mItems.split(',').map((item) => item.trim()).filter(Boolean);
                if (itemsArr.length > 0) {
                    meals.push({
                        mealType: mType,
                        items: itemsArr
                    });
                }
            }
        });

        if (meals.length === 0) {
            errorAlert.text('Please add at least one meal with items.').show();
            return;
        }

        $.ajax({
            method: 'POST',
            url: '/nutritionPlans/api/nutritionPlans',
            contentType: 'application/json',
            data: JSON.stringify({
                planName: planNameVal,
                meals: meals
            })
        })
            .then((newPlan) => {
                let planDom = createNutritionPlanElement(newPlan);
                nutritionPlansContainer.append(planDom);

                
                planNameInput.val('');
                mealsContainer.empty();
                mealsContainer.append(createMealRow());
                planNameInput.focus();
            })
            .fail((jqXHR) => {
                let err = jqXHR.responseJSON?.error || 'Error creating nutrition plan.';
                errorAlert.text(err).show();
            });
    });

})(window.jQuery);
