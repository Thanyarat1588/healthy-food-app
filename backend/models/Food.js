import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 }
}, { _id: false });

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่ออาหาร'],
    trim: true
  },
  nameTh: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'กรุณากรอกคำอธิบาย']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'กรุณาเลือกหมวดหมู่']
  },
  image: {
    type: String,
    default: null
  },
  nutrition: nutritionSchema,
  ingredients: [String],
  healthBenefits: [String],
  servingSize: {
    type: String,
    default: '100g'
  },
  preparationTime: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

foodSchema.index({ name: 'text', nameTh: 'text', description: 'text', tags: 'text' });

const Food = mongoose.model('Food', foodSchema);
export default Food;
