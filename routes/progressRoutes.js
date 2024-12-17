import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const router = express.Router();


async function isPR(userId, metricName, newValue) {
    const allProgress = await Progress.find({ userId }).lean();

    for (let entry of allProgress) {
        const existingVal = entry.metrics?.[metricName];
        if (typeof existingVal === 'number' && existingVal > newValue) {
            return false;
        }
    }
    return true;
}

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const user = await User.findById(req.session.user._id).lean();
        const progressEntries = await Progress.find({ userId: req.session.user._id })
            .sort({ date: 1 })
            .lean();

        const newPRMessage = req.session.newPR;
        req.session.newPR = undefined;

        res.render('progress', { progressEntries, user, newPRMessage });
    } catch (error) {
        console.error('Fetch Progress error:', error);
        res.status(500).render('error', { error: 'Failed to fetch progress data.' });
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { date, weight, benchPress, squat, deadlift, notes } = req.body;

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
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

        let prMessages = [];

        if (parsedMetrics.benchPress !== null) {
            const benchPR = await isPR(req.session.user._id, 'benchPress', parsedMetrics.benchPress);
            if (benchPR) {
                prMessages.push(`Bench Press PR! ${parsedMetrics.benchPress} lbs`);
            }
        }
        if (parsedMetrics.squat !== null) {
            const squatPR = await isPR(req.session.user._id, 'squat', parsedMetrics.squat);
            if (squatPR) {
                prMessages.push(`Squat PR! ${parsedMetrics.squat} lbs`);
            }
        }
        if (parsedMetrics.deadlift !== null) {
            const dlPR = await isPR(req.session.user._id, 'deadlift', parsedMetrics.deadlift);
            if (dlPR) {
                prMessages.push(`Deadlift PR! ${parsedMetrics.deadlift} lbs`);
            }
        }

        if (prMessages.length > 0) {
            req.session.newPR = prMessages.join(' | ');
        }

        res.redirect('/progress');
    } catch (error) {
        console.error('Add Progress error:', error);
        res.status(400).render('error', { error: error.message });
    }
});

export default router;
