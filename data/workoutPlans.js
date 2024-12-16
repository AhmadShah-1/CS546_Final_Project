import { getCollectionFn } from '../config/mongoCollections.js';

const workoutPlans = getCollectionFn('workoutPlans');

export const createWorkoutPlan = async (userId, planName, exercises) => {
    if (!userId || !planName || !exercises) throw 'Missing required fields';
    const collection = await workoutPlans();
    const newPlan = { userId, planName, exercises, createdAt: new Date() };
    const result = await collection.insertOne(newPlan);
    if (!result.acknowledged || !result.insertedId) throw 'Failed to create workout plan';
    return { id: result.insertedId, ...newPlan };
};

export const getWorkoutPlansByUser = async (userId) => {
    const collection = await workoutPlans();
    return await collection.find({ userId }).toArray();
};
