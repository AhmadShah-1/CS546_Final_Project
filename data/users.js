import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';

export const createUser = async (username, email, password) => {
    if (!username || !email || !password) throw 'All fields are required.';

    const userCollection = await users();
    const newUser = {
        username,
        email,
        password,
        createdAt: new Date(),
        fitnessGoals: []
    };

    const insertResult = await userCollection.insertOne(newUser);
    if (!insertResult.insertedId) throw 'Failed to create user.';

    return { id: insertResult.insertedId.toString(), ...newUser };
};

export const findUserByEmail = async (email) => {
    if (!email) throw 'Email is required.';
    const userCollection = await users();
    const user = await userCollection.findOne({ email });
    if (!user) throw 'User not found.';
    return user;
};
