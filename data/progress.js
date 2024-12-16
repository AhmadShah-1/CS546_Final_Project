import { getCollectionFn } from '../config/mongoCollections.js';

const progress = getCollectionFn('progress');

export const addProgressEntry = async (userId, date, metrics, notes) => {
    if (!userId || !date || !metrics) throw 'Missing required fields';
    const collection = await progress();
    const newEntry = { userId, date, metrics, notes, createdAt: new Date() };
    const result = await collection.insertOne(newEntry);
    if (!result.acknowledged || !result.insertedId) throw 'Failed to add progress entry';
    return { id: result.insertedId, ...newEntry };
};

export const getProgressByUser = async (userId) => {
    const collection = await progress();
    return await collection.find({ userId }).toArray();
};
