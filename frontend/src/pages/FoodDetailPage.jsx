import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Clock, ChefHat, Flame, ArrowLeft, Check } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const difficultyMap = { easy: 'ง่าย', medium: 'ปานกลาง', hard: 'ยาก' };

export default function FoodDetailPage() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [food, setFood] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/foods/${id}`);
        setFood(res.data.data);
        if (isLoggedIn) {
          const favRes = await api.get(`/favorites/check/${id}`);
          setIsFav(favRes.data.isFavorited);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, isLoggedIn]);

  const toggleFav = async () => {
    if (!isLoggedIn) { toast.error('กรุณาเข้าสู่ระบบก่อน'); return; }
    setFavLoading(true);
    try {
      if (isFav) {
        await api.delete(`/favorites/${id}`);
        setIsFav(false);
        toast.success('ลบออกจากรายการโปรดแล้ว');
      } else {
        await api.post(`/favorites/${id}`);
        setIsFav(true);
        toast.success('บันทึกในรายการโปรดแล้ว');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="aspect-video bg-gray-200 rounded-2xl"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (!food) return (
    <div className="text-center py-16">
      <p className="text-5xl mb-4">😢</p>
      <h3 className="text-lg font-semibold">ไม่พบข้อมูลอาหาร</h3>
      <Link to="/foods" className="btn-primary mt-4 inline-block">กลับไปหน้าเมนู</Link>
    </div>
  );

  const nutrition = food.nutrition || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Back */}
      <Link to="/foods" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> กลับไปเมนูอาหาร
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-square bg-primary-50">
          {food.image ? (
            <img src={food.image} alt={food.nameTh || food.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-9xl">{food.category?.icon || '🥗'}</span>
            </div>
          )}
          {food.category && (
            <span className="absolute top-4 left-4 badge text-white" style={{ backgroundColor: food.category.color }}>
              {food.category.icon} {food.category.name}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-forest">{food.nameTh || food.name}</h1>
              {food.nameTh && food.name !== food.nameTh && (
                <p className="text-gray-400 text-sm mt-1">{food.name}</p>
              )}
            </div>
            <button
              onClick={toggleFav}
              disabled={favLoading}
              className={`flex-none flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                isFav 
                  ? 'bg-red-50 border-red-200 text-red-600' 
                  : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500'
              }`}
            >
              <Heart size={16} className={isFav ? 'fill-current' : ''} />
              {isFav ? 'บันทึกแล้ว' : 'บันทึก'}
            </button>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-6">{food.description}</p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'แคลอรี', value: `${nutrition.calories || 0}`, unit: 'kcal', icon: <Flame size={18} />, color: 'text-orange-500' },
              { label: 'เวลา', value: `${food.preparationTime || 0}`, unit: 'นาที', icon: <Clock size={18} />, color: 'text-blue-500' },
              { label: 'ระดับ', value: difficultyMap[food.difficulty] || '-', unit: '', icon: <ChefHat size={18} />, color: 'text-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className={`flex justify-center mb-1 ${stat.color}`}>{stat.icon}</div>
                <div className="font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.unit || stat.label}</div>
              </div>
            ))}
          </div>

          {/* Nutrition */}
          {(nutrition.protein || nutrition.carbs || nutrition.fat) ? (
            <div className="bg-primary-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">คุณค่าทางโภชนาการ (ต่อ {food.servingSize || '100g'})</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'โปรตีน', value: nutrition.protein, unit: 'g', color: 'bg-red-400' },
                  { label: 'คาร์โบไฮเดรต', value: nutrition.carbs, unit: 'g', color: 'bg-amber-400' },
                  { label: 'ไขมัน', value: nutrition.fat, unit: 'g', color: 'bg-yellow-400' },
                  { label: 'ไฟเบอร์', value: nutrition.fiber, unit: 'g', color: 'bg-green-400' },
                ].map((n, i) => n.value > 0 && (
                  <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${n.color}`}></div>
                      <span className="text-sm text-gray-600">{n.label}</span>
                    </div>
                    <span className="text-sm font-semibold">{n.value}{n.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {food.ingredients?.length > 0 && (
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3">วัตถุดิบ</h3>
            <ul className="space-y-2">
              {food.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-none">
                    <Check size={12} className="text-primary-600" />
                  </div>
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {food.healthBenefits?.length > 0 && (
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3">ประโยชน์ต่อสุขภาพ</h3>
            <ul className="space-y-2">
              {food.healthBenefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-primary-600">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tags */}
      {food.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {food.tags.map((tag, i) => (
            <span key={i} className="badge bg-gray-100 text-gray-600 text-sm">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
