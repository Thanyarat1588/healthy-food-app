import express from 'express';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all categories including inactive (admin)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create category (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, message: 'เพิ่มหมวดหมู่สำเร็จ', data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update category (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่' });
    }
    
    res.json({ success: true, message: 'แก้ไขหมวดหมู่สำเร็จ', data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete category (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่' });
    }
    
    res.json({ success: true, message: 'ลบหมวดหมู่สำเร็จ' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
