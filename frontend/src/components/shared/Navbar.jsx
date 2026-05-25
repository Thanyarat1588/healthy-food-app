import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Leaf, Menu, X, Heart, LogOut, User, 
  ShieldCheck, BookOpen, Utensils, Home 
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'หน้าหลัก', icon: <Home size={16} /> },
    { to: '/foods', label: 'เมนูอาหาร', icon: <Utensils size={16} /> },
    { to: '/articles', label: 'บทความ', icon: <BookOpen size={16} /> },
  ];

  const isActive = (path) => location.pathname === path || 
    (path !== '/' && location.pathname.startsWith(path));

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold text-forest">Healthy</span>
              <span className="font-display text-lg font-bold text-primary-600">Food</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {user.role === 'user' && (
                  <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
                    <Heart size={16} />
                    รายการโปรด
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="nav-link text-amber-600 hover:bg-amber-50 hover:text-amber-700">
                    <ShieldCheck size={16} />
                    จัดการระบบ
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={14} className="text-primary-700" />
                  </div>
                  <span className="text-sm text-gray-600 max-w-[100px] truncate">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="nav-link text-red-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut size={16} />
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">เข้าสู่ระบบ</Link>
                <Link to="/register" className="btn-primary text-sm py-2">สมัครสมาชิก</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-primary-50 text-gray-600"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-primary-100 px-4 py-3 space-y-1 slide-in">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`nav-link w-full ${isActive(link.to) ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          
          <div className="border-t border-gray-100 pt-2 mt-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                  <User size={14} />
                  {user.name}
                </div>
                {user.role === 'user' && (
                  <Link to="/favorites" onClick={() => setIsOpen(false)} className="nav-link w-full">
                    <Heart size={16} />รายการโปรด
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="nav-link w-full text-amber-600">
                    <ShieldCheck size={16} />จัดการระบบ
                  </Link>
                )}
                <button onClick={handleLogout} className="nav-link w-full text-red-500">
                  <LogOut size={16} />ออกจากระบบ
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="nav-link w-full">เข้าสู่ระบบ</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary block text-center text-sm">สมัครสมาชิก</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
