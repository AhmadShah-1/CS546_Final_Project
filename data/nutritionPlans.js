import { getCollectionFn } from '../config/mongoCollections.js';

const nutritionPlans = getCollectionFn('nutritionPlans');

export const createNutritionPlan = async (userId, planName, meals) => {
    if (!userId || !planName || !meals) throw 'Missing required fields';
    const collection = await nutritionPlans();
    const newPlan = { userId, planName, meals, creationDate: new Date() };
    const result = await collection.insertOne(newPlan);
    if (!result.acknowledged || !result.insertedId) throw 'Failed to create nutrition plan';
    return { id: result.insertedId, ...newPlan };
};

export const getAllNutritionPlans = async () => {
    const collection = await nutritionPlans();
    return await collection.find({}).toArray();
};
