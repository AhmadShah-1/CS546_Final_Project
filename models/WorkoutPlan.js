import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    exerciseName: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
});

const workoutPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planName: { type: String, required: true },
    exercises: [exerciseSchema],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('WorkoutPlan', workoutPlanSchema);
