import mongoose from 'mongoose';

const strengthComparisonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exercise: { type: String, required: true },
    weight: { type: Number, required: true },
    reps: { type: Number, required: true },
    oneRepMax: { type: Number, required: true },
    bodyWeight: { type: Number, required: true },
    height: { type: Number, required: true },
    experienceLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    date: { type: Date, default: Date.now },
});


strengthComparisonSchema.index({ userId: 1, exercise: 1 });

strengthComparisonSchema.statics.calculateOneRepMax = function(weight, reps) {
    return Math.round(weight * (36 / (37 - reps)));
};

export default mongoose.model('StrengthComparison', strengthComparisonSchema);
