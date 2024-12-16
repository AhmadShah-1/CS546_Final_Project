import express from 'express';
import StrengthComparison from '../models/StrengthComparison.js';

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const data = await StrengthComparison.find({ userId: req.session.user._id }).lean();
        res.render('strengthComparisions', { data });
    } catch (error) {
        console.error('Fetch Strength Data error:', error);
        res.status(500).render('error', { error: 'Failed to fetch strength data.' });
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const {
            exercise, weight, reps, bodyWeight, height, experienceLevel,
        } = req.body;
        if (!exercise || !weight || !reps || !bodyWeight || !height || !experienceLevel) {
            throw new Error('Missing required fields');
        }

        const oneRepMax = StrengthComparison.calculateOneRepMax(weight, reps);

        const newEntry = new StrengthComparison({
            userId: req.session.user._id,
            exercise,
            weight,
            reps,
            oneRepMax,
            bodyWeight,
            height,
            experienceLevel,
        });
        await newEntry.save();
        res.redirect('/strengthComparisons');
    } catch (error) {
        console.error('Add Strength Data error:', error);
        res.status(400).render('error', { error: error.message });
    }
});

export default router;
