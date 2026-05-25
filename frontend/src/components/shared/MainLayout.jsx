import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-forest text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Leaf size={16} className="text-white" />
                </div>
                <span className="font-display text-lg font-bold">HealthyFood</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                แหล่งรวมความรู้เกี่ยวกับอาหารเพื่อสุขภาพ เมนูอาหาร และบทความสุขภาพที่ครบครัน
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">ลิงก์ด่วน</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link to="/" className="block hover:text-primary-400 transition-colors">หน้าหลัก</Link>
                <Link to="/foods" className="block hover:text-primary-400 transition-colors">เมนูอาหาร</Link>
                <Link to="/articles" className="block hover:text-primary-400 transition-colors">บทความสุขภาพ</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">บัญชีผู้ใช้</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link to="/login" className="block hover:text-primary-400 transition-colors">เข้าสู่ระบบ</Link>
                <Link to="/register" className="block hover:text-primary-400 transition-colors">สมัครสมาชิก</Link>
                <Link to="/favorites" className="block hover:text-primary-400 transition-colors">รายการโปรด</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} HealthyFood. สงวนลิขสิทธิ์
          </div>
        </div>
      </footer>
    </div>
  );
}
