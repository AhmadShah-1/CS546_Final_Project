import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import NutritionPlan from './models/NutritionPlan.js';
import StrengthComparison from './models/StrengthComparison.js';

dotenv.config();

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await NutritionPlan.deleteMany({});
        await StrengthComparison.deleteMany({});

        const [user1, user2] = await User.create([
            {
                username: 'SyedShah',
                email: 'syed@gmail.com',
                password: 'Password123!',
                fitnessGoals: {
                    goalType: 'weight loss',
                    targetWeight: 70,
                    currentWeight: 85,
                    timeFrame: '3 months'
                },
                age: 30,
                height: 175,
                bodyWeight: 85,
                yearsLifting: 2,
                bio: 'Looking to lose weight and get healthier.',
                preferences: { weightUnit: 'kg', heightUnit: 'cm' }
            },
            {
                username: 'CarlGuillermo',
                email: 'CarlGuillermo@gmail.com',
                password: 'Password123!',
                fitnessGoals: {
                    goalType: 'muscle gain',
                    targetWeight: 65,
                    currentWeight: 60,
                    timeFrame: '6 months'
                },
                age: 25,
                height: 165,
                bodyWeight: 60,
                yearsLifting: 1,
                bio: 'Building muscle and strength!',
                preferences: { weightUnit: 'kg', heightUnit: 'cm' }
            }
        ]);

        const plan1 = await NutritionPlan.create({
            userId: user1._id,
            planName: 'Keto Diet Plan',
            meals: [
                { mealType: 'Breakfast', items: ['Eggs', 'Avocado', 'Bacon'] },
                { mealType: 'Lunch', items: ['Grilled Chicken', 'Broccoli', 'Olive Oil'] },
                { mealType: 'Dinner', items: ['Salmon', 'Asparagus', 'Butter'] }
            ]
        });

        const plan2 = await NutritionPlan.create({
            userId: user1._id,
            planName: 'Intermittent Fasting Plan',
            meals: [
                { mealType: 'Lunch', items: ['Spinach Salad', 'Chicken Breast'] },
                { mealType: 'Snack', items: ['Almonds', 'Protein Shake'] },
                { mealType: 'Dinner', items: ['Steak', 'Broccoli', 'Sweet Potato'] }
            ]
        });

        const plan3 = await NutritionPlan.create({
            userId: user2._id,
            planName: 'High Protein Plan',
            meals: [
                { mealType: 'Breakfast', items: ['Oatmeal', 'Protein Shake'] },
                { mealType: 'Lunch', items: ['Turkey Sandwich', 'Sweet Potato'] },
                { mealType: 'Dinner', items: ['Steak', 'Quinoa', 'Green Beans'] }
            ]
        });


        await StrengthComparison.create([
            {
                userId: user1._id,
                exercise: 'bench_press',
                weight: 100,
                reps: 5,
                oneRepMax: 120,
                bodyWeight: user1.bodyWeight,
                height: user1.height,
                experienceLevel: 'intermediate'
            },
            {
                userId: user1._id,
                exercise: 'squat',
                weight: 120,
                reps: 5,
                oneRepMax: 140,
                bodyWeight: user1.bodyWeight,
                height: user1.height,
                experienceLevel: 'intermediate'
            },
            {
                userId: user1._id,
                exercise: 'deadlift',
                weight: 130,
                reps: 5,
                oneRepMax: 155,
                bodyWeight: user1.bodyWeight,
                height: user1.height,
                experienceLevel: 'intermediate'
            },
            {
                userId: user2._id,
                exercise: 'bench_press',
                weight: 50,
                reps: 8,
                oneRepMax: 62,
                bodyWeight: user2.bodyWeight,
                height: user2.height,
                experienceLevel: 'beginner'
            },
            {
                userId: user2._id,
                exercise: 'squat',
                weight: 70,
                reps: 6,
                oneRepMax: 85,
                bodyWeight: user2.bodyWeight,
                height: user2.height,
                experienceLevel: 'beginner'
            },
            {
                userId: user2._id,
                exercise: 'deadlift',
                weight: 80,
                reps: 5,
                oneRepMax: 95,
                bodyWeight: user2.bodyWeight,
                height: user2.height,
                experienceLevel: 'beginner'
            }
        ]);

        console.log('Seeded data successfully!');
        console.log('Users created:', user1.username, user2.username);
        console.log('Nutrition Plans created:', plan1.planName, plan2.planName, plan3.planName);
        console.log('StrengthComparison entries for bench_press, squat, deadlift added.');

    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

main();
