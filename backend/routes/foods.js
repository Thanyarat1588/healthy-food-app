import express from 'express';
import Food from '../models/Food.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all foods (public)
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameTh: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (category) query.category = category;
    
    const total = await Food.countDocuments(query);
    const foods = await Food.find(query)
      .populate('category', 'name icon color')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: foods,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single food (public)
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('category', 'name icon color')
      .populate('createdBy', 'name');
    
    if (!food || !food.isActive) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลอาหาร' });
    }
    
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create food (admin only)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const foodData = { ...req.body, createdBy: req.user._id };
    
    if (req.file) {
      foodData.image = `/uploads/${req.file.filename}`;
    }
    
    if (typeof foodData.nutrition === 'string') {
      foodData.nutrition = JSON.parse(foodData.nutrition);
    }
    if (typeof foodData.ingredients === 'string') {
      foodData.ingredients = JSON.parse(foodData.ingredients);
    }
    if (typeof foodData.healthBenefits === 'string') {
      foodData.healthBenefits = JSON.parse(foodData.healthBenefits);
    }
    if (typeof foodData.tags === 'string') {
      foodData.tags = JSON.parse(foodData.tags);
    }
    
    const food = await Food.create(foodData);
    const populated = await food.populate('category', 'name icon color');
    
    res.status(201).json({ success: true, message: 'เพิ่มข้อมูลอาหารสำเร็จ', data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update food (admin only)
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    if (typeof updateData.nutrition === 'string') {
      updateData.nutrition = JSON.parse(updateData.nutrition);
    }
    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }
    if (typeof updateData.healthBenefits === 'string') {
      updateData.healthBenefits = JSON.parse(updateData.healthBenefits);
    }
    if (typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags);
    }
    
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name icon color');
    
    if (!food) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลอาหาร' });
    }
    
    res.json({ success: true, message: 'แก้ไขข้อมูลอาหารสำเร็จ', data: food });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete food (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!food) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลอาหาร' });
    }
    
    res.json({ success: true, message: 'ลบข้อมูลอาหารสำเร็จ' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
