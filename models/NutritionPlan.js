import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    mealType: String,
    items: [String],
});

const nutritionPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planName: { type: String, required: true },
    meals: [mealSchema],
    creationDate: { type: Date, default: Date.now },
});

export default mongoose.model('NutritionPlan', nutritionPlanSchema);
