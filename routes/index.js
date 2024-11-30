import userRoutes from './users.js';

const constructorMethod = (app) => {
    app.use((req, res, next) => {
        if (!req.session.user && req.path !== '/login' && req.path !== '/signup') {
            return res.redirect('/login');
        }
        next();
    });

    app.use('/', userRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('error', { error: 'Page Not Found' });
    });
};

export default constructorMethod;
