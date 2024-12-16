import express from 'express';
import WorkoutPlan from '../models/WorkoutPlan.js';

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const plans = await WorkoutPlan.find({ userId: req.session.user._id }).lean();
        res.render('workoutPlans', { plans });
    } catch (error) {
        console.error('Fetch Workout Plans error:', error);
        res.status(500).render('error', { error: 'Failed to fetch workout plans.' });
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { planName, exercises } = req.body;
        if (!planName || !exercises) throw new Error('Missing required fields: planName, exercises');

        let exercisesData;
        try {
            exercisesData = JSON.parse(exercises);
        } catch (err) {
            throw new Error('Exercises must be valid JSON.');
        }

        const newPlan = new WorkoutPlan({
            userId: req.session.user._id,
            planName,
            exercises: exercisesData
        });

        await newPlan.save();
        res.redirect('/workoutPlans');
    } catch (error) {
        console.error('Create Workout Plan error:', error);
        res.status(400).render('error', { error: error.message });
    }
});

export default router;
