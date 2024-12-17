import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const user = await User.findById(req.session.user._id).lean(); 
        const progressEntries = await Progress.find({ userId: req.session.user._id }).sort({ date: 1 }).lean();
        res.render('progress', { progressEntries, user });
    } catch (error) {
        console.error('Fetch Progress error:', error);
        res.status(500).render('error', { error: 'Failed to fetch progress data.' });
    }
});
router.post('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { date, metrics, notes } = req.body;
        if (!date) {
            throw new Error('Date is required.');
        }


        let parsedMetrics = Number(metrics); // Convert input to a number
        if (isNaN(parsedMetrics)) {
            throw new Error('Metrics must be a valid number.');
        }
        /*let parsedMetrics;
        try {
            parsedMetrics = JSON.parse(metrics);
        } catch (err) {
            throw new Error('Metrics must be valid JSON.');
        }*/

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
