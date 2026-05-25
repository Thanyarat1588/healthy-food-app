import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Food from './models/Food.js';
import Article from './models/Article.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Food.deleteMany({});
    await Article.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ── USERS ──────────────────────────────────────────
    const admin = await User.create({
      name: 'Admin System',
      email: 'admin@healthyfood.com',
      password: 'admin123',
      role: 'admin'
    });

    await User.create({
      name: 'สมชาย ใจดี',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    console.log('✅ Users created');

    // ── CATEGORIES (ทีละอัน เพื่อให้ slug hook ทำงาน) ──
    const cat0 = await Category.create({ name: 'ผักและสลัด',       icon: '🥗', color: '#22c55e', description: 'ผักสด สลัด และอาหารที่ทำจากผัก' });
    const cat1 = await Category.create({ name: 'ผลไม้',            icon: '🍎', color: '#f97316', description: 'ผลไม้สดและเมนูจากผลไม้' });
    const cat2 = await Category.create({ name: 'โปรตีนสูง',        icon: '🥩', color: '#ef4444', description: 'อาหารที่มีโปรตีนสูง' });
    const cat3 = await Category.create({ name: 'ธัญพืชและข้าว',   icon: '🌾', color: '#eab308', description: 'ข้าวกล้อง ธัญพืช และคาร์โบไฮเดรตดี' });
    const cat4 = await Category.create({ name: 'เครื่องดื่มสุขภาพ', icon: '🥤', color: '#06b6d4', description: 'น้ำผัก น้ำผลไม้ สมูทตี้' });
    const cat5 = await Category.create({ name: 'ของว่างสุขภาพ',   icon: '🥜', color: '#8b5cf6', description: 'ถั่ว เมล็ดพืช และของขบเคี้ยว' });
    const cat6 = await Category.create({ name: 'อาหารทะเล',        icon: '🐟', color: '#0ea5e9', description: 'ปลา กุ้ง และอาหารทะเล' });
    const cat7 = await Category.create({ name: 'อาหารมังสวิรัติ',  icon: '🌱', color: '#84cc16', description: 'อาหารมังสวิรัติและวีแกน' });
    console.log('✅ Categories created (8 items)');

    // ── FOODS ──────────────────────────────────────────
    const foods = [
      {
        name: 'Green Smoothie Bowl',
        nameTh: 'กรีนสมูทตี้โบวล์',
        description: 'สมูทตี้โบวล์จากผักใบเขียวและผลไม้หลากหลายชนิด อุดมด้วยวิตามินและแร่ธาตุที่จำเป็นต่อร่างกาย',
        category: cat0._id,
        nutrition: { calories: 280, protein: 8, carbs: 45, fat: 6, fiber: 8, sugar: 28, sodium: 120 },
        ingredients: ['ปวยเล้ง 100g', 'กล้วยหอม 1 ลูก', 'แอปเปิ้ล 1 ลูก', 'นมอัลมอนด์ 200ml', 'เมล็ดเจีย 1 ช้อนโต๊ะ'],
        healthBenefits: ['บำรุงสายตา', 'เพิ่มพลังงาน', 'ล้างสารพิษ', 'บำรุงผิวพรรณ'],
        servingSize: '350g', preparationTime: 15, difficulty: 'easy',
        tags: ['smoothie', 'vegan', 'breakfast', 'detox'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Quinoa Salad',
        nameTh: 'ควินัวสลัด',
        description: 'สลัดควินัวพร้อมผักสดและน้ำสลัดมะนาว อุดมด้วยโปรตีนจากพืชครบ 9 กรดอะมิโน',
        category: cat0._id,
        nutrition: { calories: 320, protein: 14, carbs: 42, fat: 9, fiber: 6, sugar: 5, sodium: 280 },
        ingredients: ['ควินัว 100g', 'แตงกวา 1 ลูก', 'มะเขือเทศ 2 ลูก', 'หัวหอมแดง', 'ผักชี', 'น้ำมะนาว'],
        healthBenefits: ['โปรตีนสูง', 'ไม่มีกลูเตน', 'ควบคุมน้ำหนัก', 'บำรุงกล้ามเนื้อ'],
        servingSize: '250g', preparationTime: 20, difficulty: 'easy',
        tags: ['salad', 'gluten-free', 'protein', 'lunch', 'vegan'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Acai Berry Bowl',
        nameTh: 'อาซาอิเบอร์รี่โบวล์',
        description: 'โบวล์อาซาอิจากบราซิล อุดมด้วยสารต้านอนุมูลอิสระสูงที่สุดในโลก ท็อปด้วยผลไม้สดและกราโนล่า',
        category: cat1._id,
        nutrition: { calories: 350, protein: 6, carbs: 55, fat: 10, fiber: 9, sugar: 32, sodium: 90 },
        ingredients: ['อาซาอิพิวเร่แช่แข็ง 100g', 'บลูเบอร์รี่ 50g', 'สตรอว์เบอร์รี่ 50g', 'กราโนล่า 30g', 'น้ำผึ้ง 1 ช้อนชา', 'ถั่วอัลมอนด์ 15g'],
        healthBenefits: ['สารต้านอนุมูลอิสระสูง', 'บำรุงหัวใจ', 'บำรุงสมอง', 'เพิ่มพลังงาน'],
        servingSize: '300g', preparationTime: 10, difficulty: 'easy',
        tags: ['acai', 'antioxidant', 'breakfast', 'superfood'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Grilled Salmon',
        nameTh: 'แซลมอนย่างสมุนไพร',
        description: 'แซลมอนนอร์เวย์ย่างสุกพอดี หมักด้วยสมุนไพรอิตาเลียน อุดมด้วยโอเมก้า 3 และโปรตีนคุณภาพสูง',
        category: cat6._id,
        nutrition: { calories: 410, protein: 42, carbs: 2, fat: 24, fiber: 0, sugar: 0, sodium: 320 },
        ingredients: ['แซลมอนฟิลเล่ 200g', 'น้ำมันมะกอก 2 ช้อนโต๊ะ', 'กระเทียม 3 กลีบ', 'โรสแมรี่', 'มะนาว 1 ลูก', 'เกลือทะเล'],
        healthBenefits: ['โอเมก้า 3 สูง', 'บำรุงหัวใจ', 'บำรุงสมอง', 'กล้ามเนื้อแข็งแรง'],
        servingSize: '200g', preparationTime: 30, difficulty: 'medium',
        tags: ['salmon', 'omega3', 'protein', 'keto', 'paleo'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Brown Rice Buddha Bowl',
        nameTh: 'ข้าวกล้องบุดด้าโบวล์',
        description: 'ข้าวกล้องออร์แกนิคพร้อมผักนึ่งหลากสี เต้าหู้ย่าง และซอสงา อาหารมังสวิรัติครบคุณค่า',
        category: cat3._id,
        nutrition: { calories: 420, protein: 18, carbs: 62, fat: 12, fiber: 7, sugar: 8, sodium: 420 },
        ingredients: ['ข้าวกล้อง 150g', 'เต้าหู้แข็ง 100g', 'บร็อคโคลี 80g', 'แครอท 1 หัว', 'ถั่วแดง 50g', 'อะโวคาโด 1/2 ลูก'],
        healthBenefits: ['พลังงานยั่งยืน', 'อิ่มนาน', 'ไฟเบอร์สูง', 'ควบคุมน้ำตาล'],
        servingSize: '350g', preparationTime: 35, difficulty: 'medium',
        tags: ['rice', 'wholegrains', 'vegan', 'buddha-bowl', 'lunch'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Green Detox Juice',
        nameTh: 'น้ำผักเขียวดีท็อกซ์',
        description: 'น้ำผักและผลไม้รวมสูตรดีท็อกซ์พิเศษ ผสมขิงสดและมะนาว ช่วยล้างสารพิษและกระตุ้นระบบเผาผลาญ',
        category: cat4._id,
        nutrition: { calories: 95, protein: 2, carbs: 22, fat: 0.5, fiber: 3, sugar: 18, sodium: 45 },
        ingredients: ['แตงกวา 1 ลูก', 'ขึ้นฉ่าย 3 ก้าน', 'ปวยเล้ง 1 กำมือ', 'แอปเปิ้ลเขียว 1 ลูก', 'ขิงสด 2 ซม.', 'มะนาว 1 ลูก'],
        healthBenefits: ['ดีท็อกซ์', 'เพิ่มพลังงาน', 'บำรุงผิว', 'กระตุ้นระบบย่อย'],
        servingSize: '400ml', preparationTime: 10, difficulty: 'easy',
        tags: ['juice', 'detox', 'green', 'vegan', 'morning'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Mixed Nuts and Seeds',
        nameTh: 'ถั่วรวมและเมล็ดพืช',
        description: 'ของว่างสุขภาพพรีเมียม ผสมถั่ว 5 ชนิดกับเมล็ดพืช ไม่เติมน้ำตาลและเกลือ',
        category: cat5._id,
        nutrition: { calories: 520, protein: 16, carbs: 28, fat: 40, fiber: 6, sugar: 8, sodium: 15 },
        ingredients: ['อัลมอนด์ 15g', 'วอลนัท 10g', 'เม็ดมะม่วงหิมพานต์ 10g', 'เมล็ดฟักทอง 5g', 'เมล็ดเจีย 5g', 'แครนเบอร์รี่อบแห้ง 10g'],
        healthBenefits: ['ไขมันดีสูง', 'บำรุงหัวใจ', 'บำรุงสมอง', 'โปรตีนจากพืช', 'วิตามิน E'],
        servingSize: '30g', preparationTime: 0, difficulty: 'easy',
        tags: ['nuts', 'snack', 'healthy-fat', 'keto', 'no-sugar'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Avocado Toast',
        nameTh: 'อโวคาโดโทสต์',
        description: 'ขนมปังโฮลเกรนราดด้วยอโวคาโดบด ท็อปด้วยไข่ลวกและมะเขือเทศเชอร์รี่',
        category: cat0._id,
        nutrition: { calories: 380, protein: 18, carbs: 35, fat: 20, fiber: 9, sugar: 4, sodium: 380 },
        ingredients: ['ขนมปังโฮลเกรน 2 แผ่น', 'อโวคาโดสุก 1 ลูก', 'ไข่ไก่ 2 ฟอง', 'มะเขือเทศเชอร์รี่ 6 ลูก', 'เมล็ดแฟลกซ์ 1 ช้อนชา', 'เกลือทะเล'],
        healthBenefits: ['ไขมันดี', 'ไฟเบอร์สูง', 'อิ่มนาน', 'บำรุงหัวใจ', 'โฟเลตบำรุงสมอง'],
        servingSize: '250g', preparationTime: 15, difficulty: 'easy',
        tags: ['avocado', 'breakfast', 'healthy-fat', 'wholegrains', 'egg'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Chicken Greek Salad',
        nameTh: 'ไก่สลัดกรีก',
        description: 'สลัดกรีกดั้งเดิมเสริมอกไก่ย่าง มะกอกดำ และเฟต้าชีส ความอร่อยจากเมดิเตอร์เรเนียน',
        category: cat2._id,
        nutrition: { calories: 360, protein: 38, carbs: 12, fat: 18, fiber: 4, sugar: 7, sodium: 680 },
        ingredients: ['อกไก่ 150g', 'ผักกาดโรเมน 100g', 'แตงกวา 1/2 ลูก', 'มะเขือเทศ 2 ลูก', 'มะกอกดำ 10 เม็ด', 'เฟต้าชีส 30g'],
        healthBenefits: ['โปรตีนสูงมาก', 'ไขมันดีจากมะกอก', 'แคลเซียมจากชีส', 'ไลโคปีนต้านมะเร็ง'],
        servingSize: '300g', preparationTime: 25, difficulty: 'easy',
        tags: ['salad', 'chicken', 'greek', 'high-protein', 'lunch'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Mango Chia Pudding',
        nameTh: 'มะม่วงเชียพุดดิ้ง',
        description: 'เชียพุดดิ้งนมมะพร้าวท็อปมะม่วงน้ำดอกไม้สุก ของหวานสุขภาพเตรียมล่วงหน้าได้',
        category: cat5._id,
        nutrition: { calories: 290, protein: 6, carbs: 42, fat: 12, fiber: 10, sugar: 26, sodium: 55 },
        ingredients: ['เมล็ดเจีย 4 ช้อนโต๊ะ', 'นมมะพร้าว 200ml', 'นมอัลมอนด์ 100ml', 'มะม่วงน้ำดอกไม้ 1 ลูก', 'น้ำผึ้ง 1 ช้อนโต๊ะ', 'วานิลลา'],
        healthBenefits: ['โอเมก้า 3 จากเจีย', 'ไฟเบอร์สูงมาก', 'วิตามิน C จากมะม่วง', 'เตรียมล่วงหน้าได้'],
        servingSize: '300g', preparationTime: 10, difficulty: 'easy',
        tags: ['chia', 'pudding', 'mango', 'dessert', 'meal-prep', 'vegan'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Steamed Fish with Ginger',
        nameTh: 'ปลานึ่งขิง',
        description: 'ปลากะพงขาวนึ่งราดซอสขิงสมุนไพรไทย ไม่มีน้ำมัน ไขมันต่ำ โปรตีนสูง',
        category: cat6._id,
        nutrition: { calories: 280, protein: 45, carbs: 8, fat: 6, fiber: 1, sugar: 3, sodium: 580 },
        ingredients: ['ปลากะพงขาว 300g', 'ขิงสดฝอย 30g', 'ต้นหอม 3 ต้น', 'ผักชี', 'ซีอิ๊วขาว 2 ช้อนโต๊ะ', 'น้ำมันงา 1 ช้อนชา'],
        healthBenefits: ['โปรตีนสูงไขมันต่ำ', 'ขิงต้านการอักเสบ', 'ฟอสฟอรัสบำรุงกระดูก', 'วิตามิน B12'],
        servingSize: '350g', preparationTime: 25, difficulty: 'medium',
        tags: ['fish', 'steamed', 'thai', 'low-fat', 'high-protein'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Lentil Soup',
        nameTh: 'ซุปถั่วเลนทิล',
        description: 'ซุปถั่วเลนทิลแดงกับผักรากและเครื่องเทศ อาหารมังสวิรัติอบอุ่นโปรตีนสูง',
        category: cat7._id,
        nutrition: { calories: 240, protein: 16, carbs: 38, fat: 3, fiber: 12, sugar: 6, sodium: 350 },
        ingredients: ['ถั่วเลนทิลแดง 150g', 'หัวหอม 1 หัว', 'กระเทียม 4 กลีบ', 'แครอท 2 หัว', 'มะเขือเทศ 2 ลูก', 'ยี่หร่า 1 ช้อนชา', 'ขมิ้น 1/2 ช้อนชา'],
        healthBenefits: ['ไฟเบอร์สูงมาก', 'โปรตีนพืชราคาประหยัด', 'ธาตุเหล็กป้องกันโลหิตจาง', 'ลดน้ำตาลในเลือด'],
        servingSize: '400g', preparationTime: 40, difficulty: 'easy',
        tags: ['soup', 'lentil', 'vegan', 'vegetarian', 'protein'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Greek Yogurt Parfait',
        nameTh: 'กรีกโยเกิร์ตพาร์เฟต์',
        description: 'กรีกโยเกิร์ตไขมันต่ำชั้นกับกราโนล่าและผลไม้สด อาหารเช้าสมดุลโปรตีนและโปรไบโอติกส์',
        category: cat5._id,
        nutrition: { calories: 310, protein: 20, carbs: 38, fat: 7, fiber: 4, sugar: 22, sodium: 95 },
        ingredients: ['กรีกโยเกิร์ต 0% 200g', 'กราโนล่า 40g', 'สตรอว์เบอร์รี่ 60g', 'บลูเบอร์รี่ 30g', 'น้ำผึ้ง 1 ช้อนชา', 'เมล็ดเจีย 1 ช้อนชา'],
        healthBenefits: ['โปรไบโอติกส์บำรุงลำไส้', 'โปรตีนสูง', 'แคลเซียมบำรุงกระดูก', 'วิตามิน C จากผลไม้'],
        servingSize: '320g', preparationTime: 5, difficulty: 'easy',
        tags: ['yogurt', 'parfait', 'breakfast', 'probiotic', 'snack'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Tofu Stir-fry',
        nameTh: 'เต้าหู้ผัดผัก',
        description: 'เต้าหู้แข็งผัดกับผักหลากสีในซอสสมุนไพรเอเชีย ทำเร็วใน 15 นาที',
        category: cat7._id,
        nutrition: { calories: 260, protein: 18, carbs: 20, fat: 12, fiber: 5, sugar: 8, sodium: 480 },
        ingredients: ['เต้าหู้แข็ง 200g', 'บร็อคโคลี 100g', 'พริกหวานแดง 1 ลูก', 'เห็ดหอม 50g', 'กระเทียม 3 กลีบ', 'ซีอิ๊วดำ 1 ช้อนโต๊ะ', 'งาขาวคั่ว'],
        healthBenefits: ['โปรตีนครบจากถั่วเหลือง', 'แคลเซียมสูง', 'วิตามิน C จากผัก', 'ไอโซฟลาโวน'],
        servingSize: '300g', preparationTime: 20, difficulty: 'easy',
        tags: ['tofu', 'stir-fry', 'vegan', 'quick', 'asian'],
        createdBy: admin._id, isActive: true
      },
      {
        name: 'Overnight Oats',
        nameTh: 'โอ๊ตแช่ข้ามคืน',
        description: 'โอ๊ตแช่นมข้ามคืนพร้อมเมล็ดเจียและผลไม้ เตรียมได้ 5 นาที ไม่ต้องปรุง',
        category: cat3._id,
        nutrition: { calories: 340, protein: 12, carbs: 52, fat: 9, fiber: 8, sugar: 18, sodium: 130 },
        ingredients: ['โอ๊ตโรลด์ 80g', 'นมอัลมอนด์ 200ml', 'เมล็ดเจีย 2 ช้อนโต๊ะ', 'กล้วยหอม 1/2 ลูก', 'น้ำผึ้ง 1 ช้อนโต๊ะ', 'อบเชย', 'ราสเบอร์รี่ 50g'],
        healthBenefits: ['เบต้ากลูแคนลดคอเลสเตอรอล', 'พลังงานสม่ำเสมอ', 'เตรียมล่วงหน้าได้ 5 วัน', 'ไฟเบอร์สูง'],
        servingSize: '350g', preparationTime: 5, difficulty: 'easy',
        tags: ['oats', 'breakfast', 'meal-prep', 'no-cook', 'vegan', 'overnight'],
        createdBy: admin._id, isActive: true
      }
    ];

    // Insert ทีละอัน เพื่อ log error ได้ชัดเจน
    let foodCount = 0;
    for (const food of foods) {
      try {
        await Food.create(food);
        foodCount++;
      } catch (err) {
        console.error(`❌ Food error [${food.nameTh}]:`, err.message);
      }
    }
    console.log(`✅ Foods created (${foodCount}/${foods.length} items)`);

    // ── ARTICLES ───────────────────────────────────────
    const articles = [
      {
        title: '10 อาหารเพื่อสุขภาพที่ควรกินทุกวัน',
        excerpt: 'การรับประทานอาหารที่ดีเป็นรากฐานของสุขภาพที่ดี ค้นพบ 10 ซูเปอร์ฟู้ดที่ควรเพิ่มในอาหารประจำวันของคุณ',
        content: `<h2>ทำไมอาหารจึงสำคัญ</h2>
<p>อาหารที่เราบริโภคในแต่ละวันมีผลโดยตรงต่อสุขภาพร่างกาย จิตใจ และคุณภาพชีวิตของเรา การเลือกอาหารที่ดีจึงเป็นการลงทุนที่คุ้มค่าที่สุดสำหรับตัวเอง</p>
<h2>10 ซูเปอร์ฟู้ดที่แนะนำ</h2>
<ol>
  <li><strong>บลูเบอร์รี่</strong> - อุดมด้วยสารต้านอนุมูลอิสระ ช่วยบำรุงสมองและความจำ</li>
  <li><strong>ผักโขม</strong> - แหล่งธาตุเหล็กและแคลเซียม เหมาะสำหรับผู้ที่เป็นโลหิตจาง</li>
  <li><strong>แซลมอน</strong> - โอเมก้า 3 สูง บำรุงหัวใจและสมอง</li>
  <li><strong>อัลมอนด์</strong> - วิตามิน E และไขมันดี ช่วยลดคอเลสเตอรอล</li>
  <li><strong>ควินัว</strong> - โปรตีนครบ 9 กรดอะมิโน เหมาะสำหรับมังสวิรัติ</li>
  <li><strong>อะโวคาโด</strong> - ไขมันดี โพแทสเซียมสูง บำรุงหัวใจ</li>
  <li><strong>ขมิ้น</strong> - เคอร์คูมินต้านการอักเสบและต้านมะเร็ง</li>
  <li><strong>บรอกโคลี</strong> - วิตามิน C สูง สารซัลโฟราเฟนต้านมะเร็ง</li>
  <li><strong>ถั่วเลนทิล</strong> - โปรตีนและไฟเบอร์สูง ราคาประหยัด</li>
  <li><strong>มะเขือเทศ</strong> - ไลโคปีนต้านมะเร็ง วิตามิน C สูง</li>
</ol>
<h2>วิธีเพิ่มซูเปอร์ฟู้ดในชีวิตประจำวัน</h2>
<p>ไม่จำเป็นต้องกินทุกอย่างในคราวเดียว เริ่มจากการเพิ่มอาหารเหล่านี้ทีละ 1-2 ชนิดในมื้ออาหาร แล้วค่อยๆ เพิ่มความหลากหลายขึ้นเรื่อยๆ</p>`,
        category: 'nutrition',
        tags: ['superfood', 'healthy-eating', 'nutrition', 'tips'],
        author: admin._id, isPublished: true
      },
      {
        title: 'การดื่มน้ำให้เพียงพอ สำคัญแค่ไหน?',
        excerpt: 'น้ำเป็นส่วนประกอบสำคัญที่สุดของร่างกาย มาเรียนรู้ว่าควรดื่มน้ำมากแค่ไหนและประโยชน์ที่ได้รับ',
        content: `<h2>ร่างกายต้องการน้ำแค่ไหน</h2>
<p>ร่างกายมนุษย์ประกอบด้วยน้ำประมาณ 60-70% น้ำมีบทบาทสำคัญในทุกกระบวนการของร่างกาย ตั้งแต่การย่อยอาหาร การขนส่งสารอาหาร ไปจนถึงการควบคุมอุณหภูมิ</p>
<h2>ปริมาณที่แนะนำ</h2>
<p>ผู้ใหญ่ทั่วไปควรดื่มน้ำประมาณ <strong>8 แก้วต่อวัน หรือ 2 ลิตร</strong> แต่ปริมาณที่เหมาะสมขึ้นอยู่กับ น้ำหนักตัว ระดับกิจกรรม และสภาพอากาศ</p>
<h2>สัญญาณที่บอกว่าร่างกายขาดน้ำ</h2>
<ul>
  <li>ปัสสาวะสีเหลืองเข้ม</li>
  <li>ปากและคอแห้ง</li>
  <li>ปวดศีรษะ</li>
  <li>อ่อนเพลีย ไม่มีสมาธิ</li>
  <li>ผิวหนังแห้ง</li>
</ul>
<h2>เคล็ดลับดื่มน้ำให้พอ</h2>
<p>ตั้งแก้วน้ำไว้บนโต๊ะทำงาน ดื่มน้ำหนึ่งแก้วก่อนอาหารทุกมื้อ และใช้แอปพลิเคชันแจ้งเตือนการดื่มน้ำ</p>`,
        category: 'wellness',
        tags: ['hydration', 'water', 'health-tips', 'wellness'],
        author: admin._id, isPublished: true
      },
      {
        title: 'สูตรอาหารเช้าเพื่อสุขภาพ 5 สูตร ทำง่ายใน 15 นาที',
        excerpt: 'อาหารเช้าเป็นมื้อสำคัญที่สุด รวม 5 สูตรอาหารเช้าอร่อย ดีต่อสุขภาพ ทำได้ในเวลาจำกัด',
        content: `<h2>ทำไมอาหารเช้าถึงสำคัญ</h2>
<p>อาหารเช้าช่วยเติมพลังงานหลังอดอาหาร 8 ชั่วโมง ช่วยเพิ่มสมาธิ ประสิทธิภาพในการทำงาน และลดความอยากอาหารในมื้อถัดไป</p>
<h2>5 สูตรอาหารเช้าที่แนะนำ</h2>
<ol>
  <li><strong>โอ๊ตมีลกับผลไม้สด</strong> - เตรียมได้ 5 นาที อิ่มนาน ไฟเบอร์สูง</li>
  <li><strong>อโวคาโดโทสต์</strong> - ไขมันดี โปรตีนจากไข่ คาร์บดีจากขนมปังโฮลเกรน</li>
  <li><strong>สมูทตี้โบวล์</strong> - วิตามินจากผัก ผลไม้ครบในชามเดียว</li>
  <li><strong>กรีกโยเกิร์ตกับกราโนล่า</strong> - โปรไบโอติกส์บำรุงลำไส้ โปรตีนสูง</li>
  <li><strong>ไข่คนกับผักสด</strong> - โปรตีนสูง เตรียมได้รวดเร็ว</li>
</ol>
<h2>เคล็ดลับเตรียมอาหารเช้าล่วงหน้า</h2>
<p>เตรียม Overnight Oats หรือ Chia Pudding ในตอนกลางคืน ตื่นเช้ามาหยิบกินได้เลย ประหยัดเวลาและยังได้สุขภาพที่ดี</p>`,
        category: 'recipe',
        tags: ['breakfast', 'recipes', 'quick', 'healthy-morning'],
        author: admin._id, isPublished: true
      },
      {
        title: 'โปรตีนสำคัญอย่างไรต่อร่างกาย และควรกินเท่าไหร่',
        excerpt: 'โปรตีนเป็นสารอาหารหลักที่สำคัญต่อทุกเซลล์ในร่างกาย มาเรียนรู้ว่าควรบริโภคโปรตีนมากแค่ไหนในแต่ละวัน',
        content: `<h2>โปรตีนคืออะไร</h2>
<p>โปรตีนเป็นสารอาหารหลัก (Macronutrient) ที่ประกอบด้วยกรดอะมิโน 20 ชนิด ทำหน้าที่สร้างและซ่อมแซมเนื้อเยื่อ ผลิตเอนไซม์และฮอร์โมน รวมถึงเสริมสร้างภูมิคุ้มกัน</p>
<h2>ปริมาณโปรตีนที่แนะนำต่อวัน</h2>
<ul>
  <li><strong>คนทั่วไป:</strong> 0.8 กรัม / น้ำหนักตัว 1 กิโลกรัม</li>
  <li><strong>ออกกำลังกายเบา:</strong> 1.0-1.2 กรัม / กิโลกรัม</li>
  <li><strong>ออกกำลังกายหนัก:</strong> 1.6-2.2 กรัม / กิโลกรัม</li>
</ul>
<h2>แหล่งโปรตีนที่ดีที่สุด</h2>
<p>แหล่งโปรตีนจากสัตว์ เช่น ไข่ ปลา อกไก่ กรีกโยเกิร์ต และจากพืช เช่น ถั่วเลนทิล เต้าหู้ ควินัว เอดามาเม ล้วนเป็นตัวเลือกที่ดี</p>`,
        category: 'nutrition',
        tags: ['protein', 'nutrition', 'muscle', 'diet'],
        author: admin._id, isPublished: true
      },
      {
        title: 'ไขมันดี vs ไขมันเลว รู้จักความแตกต่างเพื่อสุขภาพที่ดี',
        excerpt: 'ไม่ใช่ไขมันทุกชนิดที่ไม่ดี มาเรียนรู้ความแตกต่างระหว่างไขมันดีและไขมันเลว เพื่อเลือกกินได้อย่างถูกต้อง',
        content: `<h2>ไขมันในอาหารมีกี่ประเภท</h2>
<p>ไขมันในอาหารแบ่งออกเป็น 4 ประเภทหลัก ได้แก่ ไขมันอิ่มตัว ไขมันไม่อิ่มตัวเชิงเดี่ยว ไขมันไม่อิ่มตัวเชิงซ้อน และไขมันทรานส์</p>
<h2>ไขมันที่ดี ✅</h2>
<ul>
  <li><strong>ไขมันไม่อิ่มตัวเชิงเดี่ยว</strong> - พบในน้ำมันมะกอก อะโวคาโด ถั่ว ช่วยลด LDL เพิ่ม HDL</li>
  <li><strong>โอเมก้า 3</strong> - พบในปลาแซลมอน เมล็ดแฟลกซ์ วอลนัท บำรุงหัวใจและสมอง</li>
</ul>
<h2>ไขมันที่ควรหลีกเลี่ยง ❌</h2>
<ul>
  <li><strong>ไขมันทรานส์</strong> - พบในอาหารแปรรูป มาการีน เพิ่มความเสี่ยงโรคหัวใจ</li>
  <li><strong>ไขมันอิ่มตัวมากเกิน</strong> - พบในเนื้อแดง นม เนย ควรจำกัดการบริโภค</li>
</ul>`,
        category: 'nutrition',
        tags: ['fat', 'healthy-fat', 'omega3', 'nutrition', 'heart-health'],
        author: admin._id, isPublished: true
      },
      {
        title: 'การออกกำลังกายและโภชนาการ คู่หูที่แยกกันไม่ได้',
        excerpt: 'การออกกำลังกายโดยไม่ดูแลโภชนาการเปรียบเหมือนขับรถโดยไม่เติมน้ำมัน มาเรียนรู้วิธีกินเพื่อประสิทธิภาพสูงสุด',
        content: `<h2>ทำไมโภชนาการสำคัญสำหรับนักกีฬา</h2>
<p>อาหารที่เหมาะสมช่วยเพิ่มประสิทธิภาพการออกกำลังกาย เร่งการฟื้นตัวของกล้ามเนื้อ และลดความเสี่ยงการบาดเจ็บ</p>
<h2>ก่อนออกกำลังกาย</h2>
<p>รับประทานอาหารที่มีคาร์โบไฮเดรตเชิงซ้อนและโปรตีนเบาๆ 1-2 ชั่วโมงก่อนออกกำลังกาย เช่น ขนมปังโฮลเกรนกับไข่ต้ม หรือกล้วยกับเนยถั่ว</p>
<h2>หลังออกกำลังกาย</h2>
<p>ภายใน 30-60 นาทีหลังออกกำลังกาย รับประทานโปรตีน 20-30 กรัมร่วมกับคาร์โบไฮเดรต เพื่อเร่งการสร้างกล้ามเนื้อและเติมไกลโคเจน</p>`,
        category: 'exercise',
        tags: ['exercise', 'nutrition', 'fitness', 'muscle', 'recovery'],
        author: admin._id, isPublished: true
      }
    ];

    let articleCount = 0;
    for (const article of articles) {
      try {
        await Article.create(article);
        articleCount++;
      } catch (err) {
        console.error(`❌ Article error [${article.title}]:`, err.message);
      }
    }
    console.log(`✅ Articles created (${articleCount}/${articles.length} items)`);

    console.log('\n🎉 Seed completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin : admin@healthyfood.com / admin123');
    console.log('👤 User  : user@example.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 สรุป: Users(2) | Categories(8) | Foods(${foodCount}) | Articles(${articleCount})`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedData();