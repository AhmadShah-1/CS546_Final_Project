import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const user = await User.findById(req.session.user._id).lean(); 
        const progressEntries = await Progress.find({ userId: req.session.user._id })
            .sort({ date: 1 })
            .lean();

        res.render('progress', { progressEntries, user });
    } catch (error) {
        console.error('Fetch Progress error:', error);
        res.status(500).render('error', { error: 'Failed to fetch progress data.' });
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { date, weight, benchPress, squat, deadlift, notes } = req.body;

        const datePattern = /^\d{4}-\d{2}-\d{2}$/; //validates that it is in yyyy-mm-dd format
        if (!date || !datePattern.test(date)) {
            throw new Error('Date must be in YYYY-MM-DD format.');
        }

        const parsedMetrics = {
            weight: weight ? Number(weight) : null,
            benchPress: benchPress ? Number(benchPress) : null,
            squat: squat ? Number(squat) : null,
            deadlift: deadlift ? Number(deadlift) : null,
        };

        if (
            parsedMetrics.weight === null &&
            parsedMetrics.benchPress === null &&
            parsedMetrics.squat === null &&
            parsedMetrics.deadlift === null
        ) {
            throw new Error('At least one metric (Weight, Bench Press, Squat, Deadlift) must be provided.');
        }

        const newProgress = new Progress({
            userId: req.session.user._id,
            date,
            metrics: parsedMetrics,
            notes,
        });

        await newProgress.save();
        res.redirect('/progress');
    } catch (error) {
        console.error('Add Progress error:', error);
        res.status(400).render('error', { error: error.message });
    }
});

export default router;
