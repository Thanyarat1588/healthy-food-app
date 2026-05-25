import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Leaf, Zap, Shield, TrendingUp, ArrowRight, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import FoodCard from '../components/shared/FoodCard';
import ArticleCard from '../components/shared/ArticleCard';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, articlesRes, catsRes] = await Promise.all([
          api.get('/foods?limit=6'),
          api.get('/articles/latest'),
          api.get('/categories')
        ]);
        setFeaturedFoods(foodsRes.data.data || []);
        setLatestArticles(articlesRes.data.data || []);
        setCategories(catsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/foods?search=${encodeURIComponent(searchQ.trim())}`);
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-sage to-primary-700 text-white">
        <div className="absolute inset-0 bg-leaf-pattern opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-600 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6 border border-white/30">
              <Leaf size={14} className="text-primary-300" />
              <span>ข้อมูลอาหารเพื่อสุขภาพที่ครบครัน</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              เริ่มต้นชีวิต
              <span className="block text-primary-300">สุขภาพดีได้วันนี้</span>
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed max-w-xl">
              ค้นพบเมนูอาหารเพื่อสุขภาพ บทความโภชนาการ และความรู้ที่จะช่วยให้คุณมีสุขภาพที่ดีขึ้น
            </p>
            
            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="ค้นหาเมนูอาหาร..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-lg"
                />
              </div>
              <button type="submit" className="btn-primary shadow-lg px-5">
                ค้นหา
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">หมวดหมู่อาหาร</h2>
          <Link to="/foods" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
            ดูทั้งหมด <ChevronRight size={14} />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-none w-28 h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            <Link
              to="/foods"
              className="flex-none flex flex-col items-center gap-2 px-5 py-3 bg-white rounded-2xl border-2 border-primary-200 hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer group"
            >
              <span className="text-2xl">🍽️</span>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">ทั้งหมด</span>
            </Link>
            {categories.map(cat => (
              <Link
                key={cat._id}
                to={`/foods?category=${cat._id}`}
                className="flex-none flex flex-col items-center gap-2 px-5 py-3 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-400 hover:bg-primary-50 transition-all group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap size={24} />, title: 'ข้อมูลโภชนาการ', desc: 'ข้อมูลแคลอรี โปรตีน คาร์บ ไขมัน ครบถ้วน', color: 'bg-amber-50 text-amber-600' },
              { icon: <Shield size={24} />, title: 'เมนูคัดสรร', desc: 'เมนูอาหารที่ผ่านการคัดสรรและตรวจสอบคุณค่า', color: 'bg-primary-50 text-primary-600' },
              { icon: <TrendingUp size={24} />, title: 'บทความสุขภาพ', desc: 'บทความโภชนาการและสุขภาพจากผู้เชี่ยวชาญ', color: 'bg-blue-50 text-blue-600' },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-none ${f.color}`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">เมนูอาหารแนะนำ</h2>
          <Link to="/foods" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 group">
            ดูทั้งหมด <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredFoods.map(food => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="bg-gradient-to-b from-primary-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">บทความสุขภาพล่าสุด</h2>
              <Link to="/articles" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 group">
                ดูทั้งหมด <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestArticles.slice(0, 3).map(article => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-forest to-sage rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">เริ่มต้นดูแลสุขภาพวันนี้</h2>
          <p className="text-green-100 mb-6 max-w-md mx-auto">สมัครสมาชิกฟรีเพื่อบันทึกเมนูโปรดและรับข้อมูลสุขภาพที่ตรงกับคุณ</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-forest font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
            <Leaf size={18} />
            สมัครสมาชิกฟรี
          </Link>
        </div>
      </section>
    </div>
  );
}
