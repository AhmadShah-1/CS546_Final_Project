import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const fitnessGoalsSchema = new mongoose.Schema({
    goalType: String,
    targetWeight: Number,
    currentWeight: Number,
    timeFrame: String,
});

const preferencesSchema = new mongoose.Schema({
    weightUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    heightUnit: { type: String, enum: ['cm', 'ft'], default: 'cm' },
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    fitnessGoals: fitnessGoalsSchema,
    age: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    bodyWeight: { type: Number, min: 0 },
    yearsLifting: { type: Number, min: 0 },
    bio: { type: String },
    preferences: { type: preferencesSchema, default: () => ({}) },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
