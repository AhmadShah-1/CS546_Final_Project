import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/signup', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            goalType,
            targetWeight,
            currentWeight,
            timeFrame,
            age,
            height,
            bodyWeight,
            yearsLifting,
            bio,
            weightUnit,
            heightUnit,
        } = req.body;

        if (!username || !email || !password) {
            throw new Error('Missing required fields: username, email, password');
        }

        // Password validation regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character.');
        }

        const newUser = new User({
            username,
            email,
            password,
            fitnessGoals: {
                goalType,
                targetWeight,
                currentWeight,
                timeFrame,
            },
            age,
            height,
            bodyWeight,
            yearsLifting,
            bio,
            preferences: {
                weightUnit: weightUnit || 'kg',
                heightUnit: heightUnit || 'cm',
            },
        });

        const savedUser = await newUser.save();

        req.session.user = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
        };
        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(400).render('signup', { error: error.message });
    }
});

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found.');
        }

        const match = await user.comparePassword(password);
        if (!match) {
            throw new Error('Invalid credentials.');
        }

        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).render('login', { error: error.message });
    }
});

router.get('/exercise-explanation', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('exercise-explanation');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.user._id).lean();
        if (!user) {
            req.session.destroy();
            return res.redirect('/login');
        }
        res.render('dashboard', { user });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', { error: 'Failed to load dashboard' });
    }
});

export default router;
