import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: { type: String, required: true },
    metrics: { type: Number, required: true },
    notes: {
        type: String,
        required: false,
    },
});

export default mongoose.model('Progress', progressSchema);
