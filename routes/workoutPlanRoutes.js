import express from 'express';
import xss from 'xss';
import WorkoutPlan from '../models/WorkoutPlan.js';

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('workoutPlans', {
        title: 'Workout Plans',
        script_partial: 'workoutPlans_script'
    });
});


router
    .route('/api/workoutPlans')
    .get(async (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
        try {
            const plans = await WorkoutPlan.find({ userId: req.session.user._id }).lean();
            return res.json(plans);
        } catch (error) {
            console.error('Fetch Workout Plans error:', error);
            return res.status(500).json({ error: 'Failed to fetch workout plans.' });
        }
    })
    .post(async (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

        try {
            let { planName, exercises } = req.body;
            if (!planName || !exercises) {
                return res.status(400).json({ error: 'Missing required fields: planName, exercises' });
            }

            planName = xss(planName.trim());

            if (!Array.isArray(exercises) || exercises.length === 0) {
                return res.status(400).json({ error: 'Exercises must be a non-empty array.' });
            }

            const sanitizedExercises = exercises.map((ex) => {
                return {
                    exerciseName: xss(ex.exerciseName?.trim() || ''),
                    sets: parseInt(ex.sets, 10),
                    reps: parseInt(ex.reps, 10),
                };
            });

            for (let ex of sanitizedExercises) {
                if (!ex.exerciseName || isNaN(ex.sets) || isNaN(ex.reps)) {
                    return res.status(400).json({ error: 'Invalid exercise fields.' });
                }
            }

            const newPlan = new WorkoutPlan({
                userId: req.session.user._id,
                planName,
                exercises: sanitizedExercises
            });

            const savedPlan = await newPlan.save();
            return res.json(savedPlan);

        } catch (error) {
            console.error('Create Workout Plan error:', error);
            return res.status(500).json({ error: 'Failed to create workout plan.' });
        }
    });

export default router;
