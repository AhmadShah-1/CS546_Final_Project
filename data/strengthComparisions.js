import { getCollectionFn } from '../config/mongoCollections.js';

const strengthComparisons = getCollectionFn('strengthComparisons');

export const addStrengthData = async (userId, exercise, weight, reps, bodyWeight, height, experienceLevel) => {
    if (!userId || !exercise || !weight || !reps || !bodyWeight || !height || !experienceLevel) throw 'Missing required fields';
    const collection = await strengthComparisons();
    const oneRepMax = Math.round(weight * (36 / (37 - reps))); // Brzycki formula
    const newEntry = { userId, exercise, weight, reps, oneRepMax, bodyWeight, height, experienceLevel, date: new Date() };
    const result = await collection.insertOne(newEntry);
    if (!result.acknowledged || !result.insertedId) throw 'Failed to add strength data';
    return { id: result.insertedId, ...newEntry };
};

export const getStrengthDataByUser = async (userId) => {
    const collection = await strengthComparisons();
    return await collection.find({ userId }).toArray();
};
