import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'กรุณากรอกหัวข้อบทความ'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'กรุณากรอกสรุปบทความ'],
    maxlength: [300, 'สรุปบทความต้องไม่เกิน 300 ตัวอักษร']
  },
  content: {
    type: String,
    required: [true, 'กรุณากรอกเนื้อหาบทความ']
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['nutrition', 'exercise', 'wellness', 'recipe', 'tips'],
    default: 'nutrition'
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

articleSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\sก-๙]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now();
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
