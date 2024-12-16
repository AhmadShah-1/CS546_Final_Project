import express from 'express';
import xss from 'xss';
import NutritionPlan from '../models/NutritionPlan.js';

const router = express.Router();


router.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('nutritionPlans', {
        title: 'Nutrition Plans',
        script_partial: 'nutritionPlans_script'
    });
});


router
    .route('/api/nutritionPlans')
    .get(async (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Not logged in' });
        }
        try {
            const plans = await NutritionPlan.find({ userId: req.session.user._id }).lean();
            return res.json(plans);
        } catch (error) {
            console.error('Fetch Nutrition Plans error:', error);
            return res.status(500).json({ error: 'Failed to fetch nutrition plans.' });
        }
    })
    .post(async (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Not logged in' });
        }
        try {
            let { planName, meals } = req.body;
            if (!planName || !meals) {
                return res.status(400).json({ error: 'Missing required fields: planName, meals' });
            }

            planName = xss(planName.trim());

            if (!Array.isArray(meals) || meals.length === 0) {
                return res.status(400).json({ error: 'Meals must be a non-empty array.' });
            }

            const sanitizedMeals = meals.map((meal) => {
                let mealType = xss(meal.mealType?.trim() || '');

                let sanitizedItems = [];
                if (Array.isArray(meal.items)) {
                    sanitizedItems = meal.items.map((item) => xss(item.trim()));
                } else if (typeof meal.items === 'string') {
                    
                    sanitizedItems = meal.items.split(',').map((it) => xss(it.trim()));
                }

                return {
                    mealType,
                    items: sanitizedItems
                };
            });

            for (let meal of sanitizedMeals) {
                if (!meal.mealType || meal.items.length === 0) {
                    return res.status(400).json({ error: 'Each meal requires a mealType and at least one item.' });
                }
            }

            const newPlan = new NutritionPlan({
                userId: req.session.user._id,
                planName,
                meals: sanitizedMeals
            });

            const savedPlan = await newPlan.save();
            return res.json(savedPlan);
        } catch (error) {
            console.error('Create Nutrition Plan error:', error);
            return res.status(500).json({ error: 'Failed to create nutrition plan.' });
        }
    });

export default router;
