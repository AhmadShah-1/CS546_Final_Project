import express from 'express';
import xss from 'xss';
import StrengthComparison from '../models/StrengthComparison.js';

const router = express.Router();


router.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('strengthComparisons', {
        title: 'Strength Comparisons',
        script_partial: 'strengthComparison_script'
    });
});


router.get('/api/chart', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
    try {
        let exercise = xss(req.query.exercise?.trim() || 'bench_press');
        const allData = await StrengthComparison.find({ exercise }).lean();

        let currentUserId = req.session.user._id.toString();
        let userEntry = null;
        let otherEntries = [];

        for (let entry of allData) {
            if (entry.userId.toString() === currentUserId) {
                if (!userEntry || entry.oneRepMax > userEntry.oneRepMax) {
                    userEntry = entry;
                }
            } else {
                otherEntries.push(entry);
            }
        }

        return res.json({ userEntry, otherEntries });
    } catch (error) {
        console.error('Chart data error:', error);
        return res.status(500).json({ error: 'Failed to fetch chart data.' });
    }
});

router.get('/api/submissions', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
    try {
        let exercise = xss(req.query.exercise?.trim() || 'bench_press');
        const userId = req.session.user._id;
        const submissions = await StrengthComparison.find({ userId, exercise }).sort({ date: -1 }).lean();

        return res.json(submissions);
    } catch (error) {
        console.error('Fetch Strength Submissions error:', error);
        return res.status(500).json({ error: 'Failed to fetch submissions.' });
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { exercise, weight, reps, bodyWeight, height, experienceLevel } = req.body;
        if (!exercise || !weight || !reps || !bodyWeight || !height || !experienceLevel) {
            throw new Error('Missing required fields');
        }

        const oneRepMax = Math.round(weight * (36 / (37 - reps)));

        const newEntry = new StrengthComparison({
            userId: req.session.user._id,
            exercise: xss(exercise.trim()),
            weight: parseFloat(weight),
            reps: parseInt(reps),
            oneRepMax,
            bodyWeight: parseFloat(bodyWeight),
            height: parseFloat(height),
            experienceLevel: xss(experienceLevel.trim())
        });
        await newEntry.save();
        res.redirect('/strengthComparisons');
    } catch (error) {
        console.error('Add Strength Data error:', error);
        res.status(400).render('error', { error: error.message });
    }
});

export default router;
