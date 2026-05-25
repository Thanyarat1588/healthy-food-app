import express from 'express';
import Article from '../models/Article.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all articles (public)
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 9, sort = '-createdAt' } = req.query;
    const query = { isPublished: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (category) query.category = category;
    
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');
    
    res.json({
      success: true,
      data: articles,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get latest articles
router.get('/latest', async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-content');
    
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single article (public)
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('author', 'name');
    
    if (!article || !article.isPublished) {
      return res.status(404).json({ success: false, message: 'ไม่พบบทความ' });
    }
    
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create article (admin only)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const articleData = { ...req.body, author: req.user._id };
    
    if (req.file) {
      articleData.image = `/uploads/${req.file.filename}`;
    }
    
    if (typeof articleData.tags === 'string') {
      try { articleData.tags = JSON.parse(articleData.tags); } catch { articleData.tags = []; }
    }
    
    const article = await Article.create(articleData);
    const populated = await article.populate('author', 'name');
    
    res.status(201).json({ success: true, message: 'เพิ่มบทความสำเร็จ', data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update article (admin only)
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    if (typeof updateData.tags === 'string') {
      try { updateData.tags = JSON.parse(updateData.tags); } catch { updateData.tags = []; }
    }
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name');
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'ไม่พบบทความ' });
    }
    
    res.json({ success: true, message: 'แก้ไขบทความสำเร็จ', data: article });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete article (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true }
    );
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'ไม่พบบทความ' });
    }
    
    res.json({ success: true, message: 'ลบบทความสำเร็จ' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
