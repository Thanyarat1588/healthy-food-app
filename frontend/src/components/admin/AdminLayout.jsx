import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Leaf, LayoutDashboard, Utensils, Tag, BookOpen,
  Users, LogOut, Menu, X, ChevronRight, ShieldCheck
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'แดชบอร์ด', icon: <LayoutDashboard size={18} />, exact: true },
  { to: '/admin/foods', label: 'จัดการอาหาร', icon: <Utensils size={18} /> },
  { to: '/admin/categories', label: 'หมวดหมู่', icon: <Tag size={18} /> },
  { to: '/admin/articles', label: 'บทความ', icon: <BookOpen size={18} /> },
  { to: '/admin/users', label: 'สมาชิก', icon: <Users size={18} /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (item) => item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to);

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-forest/30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">HealthyFood</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <ShieldCheck size={10} /> Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive(item)
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-green-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
            {isActive(item) && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-forest/30">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user?.name}</p>
            <p className="text-xs text-green-400">ผู้ดูแลระบบ</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={16} /> ออกจากระบบ
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-forest flex-none">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-forest flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center gap-4 flex-none">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
              {navItems.find(n => isActive(n))?.label || 'Admin Panel'}
            </h2>
          </div>
          <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            ← ดูหน้าเว็บ
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
