import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: { type: String, required: true },
    metrics: {
        weight: { type: Number, required: false },
        benchPress: { type: Number, required: false },
        squat: { type: Number, required: false },
        deadlift: { type: Number, required: false },
    },
    notes: {
        type: String,
        required: false,
    },
});

export default mongoose.model('Progress', progressSchema);
