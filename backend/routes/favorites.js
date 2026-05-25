import express from 'express';
import Favorite from '../models/Favorite.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user's favorites
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'food',
        populate: { path: 'category', select: 'name icon color' }
      })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add to favorites
router.post('/:foodId', protect, async (req, res) => {
  try {
    const existing = await Favorite.findOne({ user: req.user._id, food: req.params.foodId });
    
    if (existing) {
      return res.status(400).json({ success: false, message: 'บันทึกในรายการโปรดแล้ว' });
    }
    
    const favorite = await Favorite.create({ user: req.user._id, food: req.params.foodId });
    
    res.status(201).json({ success: true, message: 'บันทึกในรายการโปรดสำเร็จ', data: favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove from favorites
router.delete('/:foodId', protect, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ user: req.user._id, food: req.params.foodId });
    
    if (!favorite) {
      return res.status(404).json({ success: false, message: 'ไม่พบในรายการโปรด' });
    }
    
    res.json({ success: true, message: 'ลบออกจากรายการโปรดสำเร็จ' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if food is favorited
router.get('/check/:foodId', protect, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id, food: req.params.foodId });
    res.json({ success: true, isFavorited: !!favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
