import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Tag, BookOpen, Users, TrendingUp, Plus } from 'lucide-react';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ foods: 0, categories: 0, articles: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [foods, cats, articles, users] = await Promise.all([
          api.get('/foods?limit=1'),
          api.get('/categories/all'),
          api.get('/articles?limit=1'),
          api.get('/users?limit=1'),
        ]);
        setStats({
          foods: foods.data.pagination?.total || 0,
          categories: cats.data.data?.length || 0,
          articles: articles.data.pagination?.total || 0,
          users: users.data.pagination?.total || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'เมนูอาหาร', value: stats.foods, icon: <Utensils size={22} />, color: 'bg-primary-500', link: '/admin/foods' },
    { label: 'หมวดหมู่', value: stats.categories, icon: <Tag size={22} />, color: 'bg-amber-500', link: '/admin/categories' },
    { label: 'บทความ', value: stats.articles, icon: <BookOpen size={22} />, color: 'bg-blue-500', link: '/admin/articles' },
    { label: 'สมาชิก', value: stats.users, icon: <Users size={22} />, color: 'bg-purple-500', link: '/admin/users' },
  ];

  const quickLinks = [
    { label: 'เพิ่มเมนูอาหาร', to: '/admin/foods', icon: <Utensils size={16} /> },
    { label: 'เพิ่มหมวดหมู่', to: '/admin/categories', icon: <Tag size={16} /> },
    { label: 'เขียนบทความ', to: '/admin/articles', icon: <BookOpen size={16} /> },
    { label: 'ดูสมาชิก', to: '/admin/users', icon: <Users size={16} /> },
  ];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-display">แดชบอร์ด</h1>
        <p className="text-gray-500 text-sm mt-1">ภาพรวมระบบ HealthyFood</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <Link key={i} to={card.link} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center text-white`}>
                {card.icon}
              </div>
              <TrendingUp size={14} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
            </div>
            <div>
              {loading ? (
                <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              )}
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={18} className="text-primary-600" />
          การกระทำด่วน
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-xl text-sm text-gray-600 font-medium transition-colors border border-transparent hover:border-primary-200"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-forest to-sage rounded-2xl p-6 text-white">
        <h3 className="font-semibold mb-2">🌿 HealthyFood Admin</h3>
        <p className="text-green-100 text-sm leading-relaxed">
          จัดการข้อมูลอาหาร หมวดหมู่ บทความสุขภาพ และสมาชิกระบบได้จากเมนูด้านซ้าย
          ข้อมูลทั้งหมดจะแสดงผลทันทีในหน้าเว็บสาธารณะ
        </p>
      </div>
    </div>
  );
}
