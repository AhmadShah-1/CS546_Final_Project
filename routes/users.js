import express from 'express';
import { createUser, findUserByEmail } from '../data/users.js';

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await createUser(username, email, password);
        req.session.user = { id: user._id.toString(), username: user.username };
        res.redirect('/home');
    } catch (error) {
        res.status(400).render('signup', { error });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (user.password !== password) throw 'Invalid credentials.';
        req.session.user = { id: user._id.toString(), username: user.username };
        res.redirect('/home');
    } catch (error) {
        res.status(400).render('login', { error });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('home', { user: req.session.user });
});

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('profile', { user: req.session.user });
});

export default router;
