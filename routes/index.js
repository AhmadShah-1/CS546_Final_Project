import userRoutes from './userRoutes.js';
import nutritionPlanRoutes from './nutritionPlanRoutes.js';
import workoutPlanRoutes from './workoutPlanRoutes.js';
import strengthComparisonRoutes from './strengthComparisonRoutes.js';
import progressRoutes from './progressRoutes.js';

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        return res.redirect('/dashboard');
    });

    app.use('/', userRoutes);
    app.use('/nutritionPlans', nutritionPlanRoutes);
    app.use('/workoutPlans', workoutPlanRoutes);
    app.use('/strengthComparisons', strengthComparisonRoutes);
    app.use('/progress', progressRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('error', { error: 'Page Not Found' });
    });
};

export default constructorMethod;
