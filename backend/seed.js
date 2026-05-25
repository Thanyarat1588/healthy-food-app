import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Food from './models/Food.js';
import Article from './models/Article.js';

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Food.deleteMany({});
  await Article.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin System',
    email: 'admin@healthyfood.com',
    password: 'admin123',
    role: 'admin'
  });

  const user1 = await User.create({
    name: 'สมชาย ใจดี',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  });

  console.log('✅ Users created');

  // Create categories
  const categories = await Category.insertMany([
    { name: 'ผักและสลัด', icon: '🥗', color: '#22c55e', description: 'ผักสด สลัด และอาหารที่ทำจากผัก' },
    { name: 'ผลไม้', icon: '🍎', color: '#f97316', description: 'ผลไม้สดและเมนูจากผลไม้' },
    { name: 'โปรตีนสูง', icon: '🥩', color: '#ef4444', description: 'อาหารที่มีโปรตีนสูง' },
    { name: 'ธัญพืชและข้าว', icon: '🌾', color: '#eab308', description: 'ข้าวกล้อง ธัญพืช และคาร์โบไฮเดรตดี' },
    { name: 'เครื่องดื่มสุขภาพ', icon: '🥤', color: '#06b6d4', description: 'น้ำผัก น้ำผลไม้ สมูทตี้' },
    { name: 'ของว่างสุขภาพ', icon: '🥜', color: '#8b5cf6', description: 'ถั่ว เมล็ดพืช และของขบเคี้ยวเพื่อสุขภาพ' },
  ]);

  console.log('✅ Categories created');

  // Create foods
  await Food.insertMany([
    {
      name: 'Green Smoothie Bowl',
      nameTh: 'กรีนสมูทตี้โบวล์',
      description: 'สมูทตี้โบวล์จากผักใบเขียวและผลไม้หลากหลายชนิด อุดมด้วยวิตามินและแร่ธาตุ',
      category: categories[0]._id,
      nutrition: { calories: 280, protein: 8, carbs: 45, fat: 6, fiber: 8, sugar: 28, sodium: 120 },
      ingredients: ['ปวยเล้ง 100g', 'กล้วย 1 ลูก', 'แอปเปิ้ล 1 ลูก', 'นมอัลมอนด์ 200ml', 'ซีดมะม่วงหิมพานต์'],
      healthBenefits: ['บำรุงสายตา', 'เพิ่มพลังงาน', 'ล้างสารพิษ', 'บำรุงผิวพรรณ'],
      servingSize: '350g',
      preparationTime: 15,
      difficulty: 'easy',
      tags: ['smoothie', 'vegan', 'breakfast', 'detox'],
      createdBy: admin._id
    },
    {
      name: 'Quinoa Salad',
      nameTh: 'ควินัวสลัด',
      description: 'สลัดควินัวพร้อมผักสดและน้ำสลัดมะนาว อุดมด้วยโปรตีนจากพืช',
      category: categories[0]._id,
      nutrition: { calories: 320, protein: 14, carbs: 42, fat: 9, fiber: 6, sugar: 5, sodium: 280 },
      ingredients: ['ควินัว 100g', 'แตงกวา', 'มะเขือเทศ', 'หัวหอม', 'ผักชี', 'น้ำมะนาว'],
      healthBenefits: ['โปรตีนสูง', 'ไม่มีกลูเตน', 'ควบคุมน้ำหนัก', 'บำรุงกล้ามเนื้อ'],
      servingSize: '250g',
      preparationTime: 20,
      difficulty: 'easy',
      tags: ['salad', 'gluten-free', 'protein', 'lunch'],
      createdBy: admin._id
    },
    {
      name: 'Acai Berry Bowl',
      nameTh: 'อาซาอิเบอร์รี่โบวล์',
      description: 'โบวล์อาซาอิจากบราซิล อุดมด้วยสารต้านอนุมูลอิสระ',
      category: categories[1]._id,
      nutrition: { calories: 350, protein: 6, carbs: 55, fat: 10, fiber: 9, sugar: 32, sodium: 90 },
      ingredients: ['อาซาอิ 100g', 'บลูเบอร์รี่', 'สตรอว์เบอร์รี่', 'กราโนล่า', 'น้ำผึ้ง', 'ถั่วอัลมอนด์'],
      healthBenefits: ['สารต้านอนุมูลอิสระสูง', 'บำรุงหัวใจ', 'บำรุงสมอง', 'เพิ่มพลังงาน'],
      servingSize: '300g',
      preparationTime: 10,
      difficulty: 'easy',
      tags: ['acai', 'antioxidant', 'breakfast', 'superfood'],
      createdBy: admin._id
    },
    {
      name: 'Grilled Salmon',
      nameTh: 'แซลมอนย่าง',
      description: 'แซลมอนย่างสุกพอดี อุดมด้วยโอเมก้า 3 และโปรตีนคุณภาพสูง',
      category: categories[2]._id,
      nutrition: { calories: 410, protein: 42, carbs: 2, fat: 24, fiber: 0, sugar: 0, sodium: 320 },
      ingredients: ['แซลมอน 200g', 'น้ำมันมะกอก', 'กระเทียม', 'มะนาว', 'โรสแมรี่', 'เกลือ'],
      healthBenefits: ['โอเมก้า 3 สูง', 'บำรุงหัวใจ', 'บำรุงสมอง', 'กล้ามเนื้อแข็งแรง'],
      servingSize: '200g',
      preparationTime: 30,
      difficulty: 'medium',
      tags: ['salmon', 'omega3', 'protein', 'keto'],
      createdBy: admin._id
    },
    {
      name: 'Brown Rice Bowl',
      nameTh: 'ข้าวกล้องโบวล์',
      description: 'ข้าวกล้องพร้อมผักนึ่งและไข่ต้ม เมนูเพื่อสุขภาพที่สมบูรณ์',
      category: categories[3]._id,
      nutrition: { calories: 380, protein: 15, carbs: 62, fat: 8, fiber: 5, sugar: 3, sodium: 180 },
      ingredients: ['ข้าวกล้อง 150g', 'บร็อคโคลี', 'แครอท', 'ไข่ 2 ฟอง', 'ซีอิ๊วต่ำโซเดียม'],
      healthBenefits: ['ควบคุมระดับน้ำตาล', 'อิ่มนาน', 'ไฟเบอร์สูง', 'พลังงานยั่งยืน'],
      servingSize: '300g',
      preparationTime: 25,
      difficulty: 'easy',
      tags: ['rice', 'wholegrains', 'balanced', 'lunch'],
      createdBy: admin._id
    },
    {
      name: 'Green Detox Juice',
      nameTh: 'น้ำผักเขียวดีท็อกซ์',
      description: 'น้ำผักและผลไม้รวมสูตรดีท็อกซ์ ช่วยล้างสารพิษออกจากร่างกาย',
      category: categories[4]._id,
      nutrition: { calories: 95, protein: 2, carbs: 22, fat: 0.5, fiber: 3, sugar: 18, sodium: 45 },
      ingredients: ['แตงกวา', 'ขึ้นฉ่าย', 'ปวยเล้ง', 'แอปเปิ้ลเขียว', 'ขิง', 'มะนาว'],
      healthBenefits: ['ดีท็อกซ์', 'เพิ่มพลังงาน', 'บำรุงผิว', 'ย่อยอาหารดี'],
      servingSize: '400ml',
      preparationTime: 10,
      difficulty: 'easy',
      tags: ['juice', 'detox', 'green', 'vegan'],
      createdBy: admin._id
    },
    {
      name: 'Mixed Nuts & Seeds',
      nameTh: 'ถั่วรวมและเมล็ดพืช',
      description: 'ถั่วรวมหลากชนิดผสมเมล็ดพืช อุดมด้วยไขมันดีและแร่ธาตุ',
      category: categories[5]._id,
      nutrition: { calories: 580, protein: 18, carbs: 20, fat: 48, fiber: 6, sugar: 4, sodium: 5 },
      ingredients: ['อัลมอนด์', 'วอลนัท', 'เม็ดมะม่วงหิมพานต์', 'เมล็ดฟักทอง', 'เมล็ดเจีย'],
      healthBenefits: ['ไขมันดีสูง', 'บำรุงหัวใจ', 'บำรุงสมอง', 'โปรตีนจากพืช'],
      servingSize: '30g',
      preparationTime: 0,
      difficulty: 'easy',
      tags: ['nuts', 'snack', 'healthy-fat', 'protein'],
      createdBy: admin._id
    },
    {
      name: 'Avocado Toast',
      nameTh: 'อโวคาโดโทสต์',
      description: 'ขนมปังโฮลเกรนราดด้วยอโวคาโดบด ท็อปด้วยไข่ลวกและผักสด',
      category: categories[0]._id,
      nutrition: { calories: 340, protein: 14, carbs: 32, fat: 18, fiber: 8, sugar: 3, sodium: 240 },
      ingredients: ['ขนมปังโฮลเกรน 2 แผ่น', 'อโวคาโด 1 ลูก', 'ไข่ 1 ฟอง', 'มะเขือเทศเชอร์รี่', 'เกลือทะเล'],
      healthBenefits: ['ไขมันดี', 'ไฟเบอร์สูง', 'อิ่มนาน', 'บำรุงหัวใจ'],
      servingSize: '200g',
      preparationTime: 15,
      difficulty: 'easy',
      tags: ['avocado', 'breakfast', 'healthy-fat', 'wholegrains'],
      createdBy: admin._id
    }
  ]);

  console.log('✅ Foods created');

  // Create articles
  await Article.insertMany([
    {
      title: '10 อาหารเพื่อสุขภาพที่ควรกินทุกวัน',
      excerpt: 'การรับประทานอาหารที่ดีเป็นรากฐานของสุขภาพที่ดี ค้นพบ 10 ซูเปอร์ฟู้ดที่ควรเพิ่มในอาหารประจำวันของคุณ',
      content: `<h2>ทำไมอาหารจึงสำคัญ</h2><p>อาหารที่เราบริโภคในแต่ละวันมีผลโดยตรงต่อสุขภาพร่างกาย จิตใจ และคุณภาพชีวิตของเรา</p><h2>10 ซูเปอร์ฟู้ดที่แนะนำ</h2><ol><li><strong>บลูเบอร์รี่</strong> - อุดมด้วยสารต้านอนุมูลอิสระ</li><li><strong>ผักโขม</strong> - แหล่งธาตุเหล็กและแคลเซียม</li><li><strong>แซลมอน</strong> - โอเมก้า 3 สูง</li><li><strong>อัลมอนด์</strong> - วิตามิน E และไขมันดี</li><li><strong>ควินัว</strong> - โปรตีนครบถ้วน</li></ol>`,
      image: null,
      category: 'nutrition',
      tags: ['superfood', 'healthy-eating', 'nutrition'],
      author: admin._id
    },
    {
      title: 'การดื่มน้ำให้เพียงพอ สำคัญแค่ไหน?',
      excerpt: 'น้ำเป็นส่วนประกอบที่สำคัญที่สุดของร่างกายมนุษย์ มาเรียนรู้ว่าเราควรดื่มน้ำมากเท่าไหร่และประโยชน์ของการดื่มน้ำ',
      content: `<h2>ร่างกายต้องการน้ำแค่ไหน</h2><p>ร่างกายมนุษย์ประกอบด้วยน้ำประมาณ 60-70% การดื่มน้ำให้เพียงพอเป็นสิ่งจำเป็นสำหรับทุกกระบวนการในร่างกาย</p><h2>ปริมาณที่แนะนำ</h2><p>ผู้ใหญ่ทั่วไปควรดื่มน้ำประมาณ 8 แก้วต่อวัน หรือ 2 ลิตร แต่ขึ้นอยู่กับน้ำหนัก กิจกรรม และสภาพอากาศ</p>`,
      image: null,
      category: 'wellness',
      tags: ['hydration', 'water', 'health-tips'],
      author: admin._id
    },
    {
      title: 'สูตรอาหารเช้าเพื่อสุขภาพ 5 สูตร',
      excerpt: 'อาหารเช้าเป็นมื้อที่สำคัญที่สุด เราได้รวบรวมสูตรอาหารเช้าที่อร่อยและดีต่อสุขภาพมาให้คุณ',
      content: `<h2>ทำไมอาหารเช้าสำคัญ</h2><p>อาหารเช้าช่วยเติมพลังงานหลังจากการนอนหลับ ช่วยเพิ่มสมาธิและประสิทธิภาพในการทำงาน</p><h2>5 สูตรอาหารเช้า</h2><ol><li>โอ๊ตมีลกับผลไม้สด</li><li>อโวคาโดโทสต์</li><li>สมูทตี้โบวล์</li><li>กรีกโยเกิร์ตกับแกรนูล่า</li><li>ไข่คนกับผักสด</li></ol>`,
      image: null,
      category: 'recipe',
      tags: ['breakfast', 'recipes', 'healthy-morning'],
      author: admin._id
    }
  ]);

  console.log('✅ Articles created');
  console.log('\n🎉 Seed data completed!');
  console.log('Admin: admin@healthyfood.com / admin123');
  console.log('User: user@example.com / user123');
  
  process.exit(0);
};

seedData().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
