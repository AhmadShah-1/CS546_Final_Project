import bcrypt from 'bcrypt';
import { getCollectionFn } from '../config/mongoCollections.js';

const users = getCollectionFn('users');

export const createUser = async (username, email, password) => {
    if (!username || !email || !password) throw 'All fields are required.';

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCollection = await users();

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) throw 'User with this email already exists.';

    const newUser = {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        fitnessGoals: []
    };

    const insertResult = await userCollection.insertOne(newUser);
    if (!insertResult.insertedId) throw 'Failed to create user.';

    return { id: insertResult.insertedId.toString(), ...newUser };
};

export const findUserByEmail = async (email, password) => {
    if (!email || !password) throw 'Email and password are required.';

    const userCollection = await users();
    const user = await userCollection.findOne({ email });
    if (!user) throw 'User not found.';

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw 'Invalid credentials.';

    return { id: user._id.toString(), username: user.username };
};
