import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import NutritionPlan from './models/NutritionPlan.js';
import WorkoutPlan from './models/WorkoutPlan.js';
import StrengthComparison from './models/StrengthComparison.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
    try {
        await User.deleteMany({});
        await NutritionPlan.deleteMany({});
        await WorkoutPlan.deleteMany({});
        await StrengthComparison.deleteMany({});

        const users = await User.create([
            {
                username: 'John_Doe',
                email: 'john@gmail.com',
                password: 'password123',
                fitnessGoals: {
                    goalType: 'weight loss',
                    targetWeight: 70,
                    currentWeight: 85,
                    timeFrame: '3 months',
                },
                age: 30,
                height: 175,
                bodyWeight: 85,
                yearsLifting: 2,
                bio: 'Looking to lose weight and get healthier.',
                preferences: {
                    weightUnit: 'kg',
                    heightUnit: 'cm',
                },
            },
            {
                username: 'Lewis_Smith',
                email: 'lewis@gmail.com',
                password: 'password123',
                fitnessGoals: {
                    goalType: 'muscle gain',
                    targetWeight: 65,
                    currentWeight: 60,
                    timeFrame: '6 months',
                },
                age: 25,
                height: 165,
                bodyWeight: 60,
                yearsLifting: 1,
                bio: 'Excited to build muscle and strength.',
                preferences: {
                    weightUnit: 'kg',
                    heightUnit: 'cm',
                },
            },
        ]);

        await NutritionPlan.create([
            {
                userId: users[0]._id,
                planName: 'Keto Diet Plan',
                meals: [
                    { mealType: 'Breakfast', items: ['Eggs', 'Avocado', 'Bacon'] },
                    { mealType: 'Lunch', items: ['Grilled Chicken', 'Broccoli', 'Olive Oil'] },
                    { mealType: 'Dinner', items: ['Salmon', 'Asparagus', 'Butter'] },
                ],
            },
            {
                userId: users[1]._id,
                planName: 'High Protein Plan',
                meals: [
                    { mealType: 'Breakfast', items: ['Oatmeal', 'Protein Shake'] },
                    { mealType: 'Lunch', items: ['Turkey Sandwich', 'Sweet Potato'] },
                    { mealType: 'Dinner', items: ['Steak', 'Quinoa', 'Green Beans'] },
                ],
            },
        ]);

        await WorkoutPlan.create([
            {
                userId: users[0]._id,
                planName: 'Weight Loss Program',
                exercises: [
                    { exerciseName: 'Running', sets: 1, reps: 30 },
                    { exerciseName: 'Squats', sets: 3, reps: 15 },
                ],
            },
            {
                userId: users[1]._id,
                planName: 'Strength Training',
                exercises: [
                    { exerciseName: 'Bench Press', sets: 4, reps: 10 },
                    { exerciseName: 'Deadlift', sets: 4, reps: 8 },
                ],
            },
        ]);

        await StrengthComparison.create([
            {
                userId: users[0]._id,
                exercise: 'bench_press',
                weight: 80,
                reps: 5,
                oneRepMax: 100,
                bodyWeight: 85,
                height: 175,
                experienceLevel: 'beginner',
            },
            {
                userId: users[1]._id,
                exercise: 'squat',
                weight: 60,
                reps: 8,
                oneRepMax: 75,
                bodyWeight: 60,
                height: 165,
                experienceLevel: 'beginner',
            },
        ]);

        console.log('Database seeded successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding the database:', err);
        mongoose.connection.close();
    }
};

seedData();
