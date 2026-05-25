# 🥗 HealthyFood - ระบบให้ความรู้เกี่ยวกับอาหารเพื่อสุขภาพ

ระบบเว็บแอปพลิเคชันให้ความรู้ด้านอาหารเพื่อสุขภาพ พัฒนาด้วย React + Vite + Tailwind CSS + Express.js + MongoDB

---

## 🗂️ โครงสร้างโปรเจค

```
healthy-food-app/
├── backend/                  # Express.js API Server
│   ├── models/               # MongoDB Models
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Food.js
│   │   ├── Article.js
│   │   └── Favorite.js
│   ├── routes/               # API Routes
│   │   ├── auth.js
│   │   ├── foods.js
│   │   ├── categories.js
│   │   ├── articles.js
│   │   ├── users.js
│   │   └── favorites.js
│   ├── middleware/
│   │   ├── auth.js           # JWT Authentication
│   │   └── upload.js         # Multer File Upload
│   ├── uploads/              # Uploaded images
│   ├── server.js             # Main server
│   ├── seed.js               # Sample data seeder
│   └── .env                  # Environment variables
│
└── frontend/                 # React + Vite + Tailwind
    └── src/
        ├── components/
        │   ├── shared/       # Navbar, FoodCard, ArticleCard, Modal, MainLayout
        │   └── admin/        # AdminLayout
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── FoodsPage.jsx
        │   ├── FoodDetailPage.jsx
        │   ├── ArticlesPage.jsx
        │   ├── ArticleDetailPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── FavoritesPage.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── AdminFoods.jsx
        │       ├── AdminCategories.jsx
        │       ├── AdminArticles.jsx
        │       └── AdminUsers.jsx
        ├── context/
        │   └── AuthContext.jsx
        └── utils/
            └── api.js        # Axios instance
```

---

## ⚙️ ความต้องการของระบบ

- **Node.js** v18 ขึ้นไป
- **MongoDB** v6 ขึ้นไป (local หรือ MongoDB Atlas)
- **npm** หรือ **yarn**

---

## 🚀 วิธีติดตั้งและรันระบบ

### 1. ติดตั้ง MongoDB

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt install mongodb
sudo systemctl start mongod

# หรือใช้ MongoDB Atlas (cloud): https://www.mongodb.com/atlas
```

### 2. ตั้งค่า Backend

```bash
cd backend

# แก้ไขไฟล์ .env
# MONGODB_URI=mongodb://localhost:27017/healthy_food_db
# JWT_SECRET=your_secret_key_here
# PORT=5000

# ติดตั้ง dependencies
npm install

# เพิ่มข้อมูลตัวอย่าง (ทำครั้งแรกเท่านั้น)
npm run seed

# เริ่มต้น server (production)
npm start

# หรือ development mode (auto-reload)
npm run dev
```

### 3. ตั้งค่า Frontend

```bash
cd frontend

# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# หรือ build สำหรับ production
npm run build
```

### 4. เปิดเบราว์เซอร์

```
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
```

---

## 👤 บัญชีทดสอบ (หลังรัน seed)

| บทบาท | อีเมล | รหัสผ่าน |
|-------|-------|---------|
| Admin | admin@healthyfood.com | admin123 |
| User  | user@example.com | user123 |

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | สมัครสมาชิก |
| POST | /api/auth/login | เข้าสู่ระบบ |
| GET  | /api/auth/me | ข้อมูลผู้ใช้ปัจจุบัน |

### Foods (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | /api/foods | รายการอาหารทั้งหมด |
| GET  | /api/foods?search=ค้นหา | ค้นหาอาหาร |
| GET  | /api/foods?category=id | กรองตามหมวดหมู่ |
| GET  | /api/foods/:id | รายละเอียดอาหาร |

### Foods (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/foods | เพิ่มอาหาร |
| PUT    | /api/foods/:id | แก้ไขอาหาร |
| DELETE | /api/foods/:id | ลบอาหาร |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | /api/categories | รายการหมวดหมู่ |
| POST | /api/categories | เพิ่มหมวดหมู่ (Admin) |
| PUT  | /api/categories/:id | แก้ไขหมวดหมู่ (Admin) |
| DELETE | /api/categories/:id | ลบหมวดหมู่ (Admin) |

### Articles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | /api/articles | รายการบทความ |
| GET  | /api/articles/latest | บทความล่าสุด |
| GET  | /api/articles/:id | รายละเอียดบทความ |
| POST | /api/articles | เพิ่มบทความ (Admin) |
| PUT  | /api/articles/:id | แก้ไขบทความ (Admin) |
| DELETE | /api/articles/:id | ลบบทความ (Admin) |

### Favorites (Logged In Users)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | /api/favorites | รายการโปรดของฉัน |
| POST | /api/favorites/:foodId | เพิ่มรายการโปรด |
| DELETE | /api/favorites/:foodId | ลบรายการโปรด |
| GET  | /api/favorites/check/:foodId | ตรวจสอบสถานะโปรด |

---

## 📱 ฟีเจอร์ระบบ

### ผู้ใช้ทั่วไป (ไม่ต้องล็อกอิน)
- ✅ ดูรายการอาหารเพื่อสุขภาพ
- ✅ ดูรายละเอียดอาหาร (โภชนาการ, วัตถุดิบ, ประโยชน์)
- ✅ ค้นหาเมนูอาหาร
- ✅ กรองตามหมวดหมู่
- ✅ อ่านบทความสุขภาพ
- ✅ ค้นหาบทความ
- ✅ ดูบทความล่าสุด
- ✅ สมัครสมาชิก

### สมาชิก (ต้องล็อกอิน)
- ✅ ทุกฟีเจอร์ของผู้ใช้ทั่วไป
- ✅ บันทึกเมนูโปรด (กดไอคอนหัวใจ)
- ✅ ดูรายการโปรดของตนเอง
- ✅ ลบเมนูออกจากรายการโปรด

### Admin
- ✅ Dashboard ภาพรวมสถิติ
- ✅ CRUD เมนูอาหาร (พร้อมอัปโหลดรูปภาพ)
- ✅ CRUD หมวดหมู่ (พร้อมไอคอนและสี)
- ✅ CRUD บทความสุขภาพ (รองรับ HTML)
- ✅ ดูรายชื่อสมาชิก
- ✅ ระงับ/เปิดใช้งานบัญชีสมาชิก

---

## 🎨 Design System

- **Primary Color:** Green (#22c55e)
- **Font Display:** Playfair Display (หัวข้อ)
- **Font Body:** Noto Sans Thai + Inter
- **Mobile First:** รองรับ Mobile, Tablet, Desktop
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
