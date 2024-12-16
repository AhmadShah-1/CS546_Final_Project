import express from 'express';
import NutritionPlan from '../models/NutritionPlan.js';

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const plans = await NutritionPlan.find({ userId: req.session.user._id }).lean();
        res.render('nutritionPlans', { plans });
    } catch (error) {
        console.error('Fetch Nutrition Plans error:', error);
        res.status(500).render('error', { error: 'Failed to fetch nutrition plans.' });
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { planName, meals } = req.body;
        if (!planName || !meals) throw new Error('Missing required fields: planName, meals');

        let mealsData;
        try {
            mealsData = JSON.parse(meals);
        } catch (err) {
            throw new Error('Meals must be valid JSON.');
        }

        const newPlan = new NutritionPlan({
            userId: req.session.user._id,
            planName,
            meals: mealsData,
        });
        await newPlan.save();
        res.redirect('/nutritionPlans');
    } catch (error) {
        console.error('Create Nutrition Plan error:', error);
        res.status(400).render('error', { error: error.message });
    }
});

export default router;
