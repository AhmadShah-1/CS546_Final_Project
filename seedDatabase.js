import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import NutritionPlan from './models/NutritionPlan.js';

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


        const [user1, user2] = await User.create([
            {
                username: 'AhmadShah',
                email: 'ahmad123455@gmail.com',
                password: 'Password123!',
                fitnessGoals: {
                    goalType: 'weight loss',
                    targetWeight: 200,
                    currentWeight: 170,
                    timeFrame: '3 months'
                },
                age: 21,
                height: 183,
                bodyWeight: 170,
                yearsLifting: 4,
                bio: 'Looking to get buff broooo',
                preferences: { weightUnit: 'kg', heightUnit: 'cm' }
            },
            {
                username: 'CarlGuillermo',
                email: 'carl@gmail.com',
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
                bio: 'i like broccoli and potatoes',
                preferences: { weightUnit: 'kg', heightUnit: 'cm' }
            }
        ]);

        const plan1 = await NutritionPlan.create({
            userId: user1._id,
            planName: 'Keto Diet Plan',
            meals: [
                { mealType: 'Breakfast', items: ['Eggs', 'Avocado'] },
                { mealType: 'Lunch', items: ['Grilled Chicken', 'Broccoli', 'Olive Oil'] },
                { mealType: 'Dinner', items: ['Salmon', 'Butter'] }
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

        console.log('Seeded data successfully!');
        console.log('Users created:', user1.username, user2.username);
        console.log('Nutrition Plans created:', plan1.planName, plan2.planName, plan3.planName);



    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

main();
