import { Link } from 'react-router-dom';
import { Heart, Clock, ChefHat, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const difficultyMap = { easy: 'ง่าย', medium: 'ปานกลาง', hard: 'ยาก' };
const difficultyColor = { easy: 'text-green-600 bg-green-50', medium: 'text-amber-600 bg-amber-50', hard: 'text-red-600 bg-red-50' };

export default function FoodCard({ food, isFavorited: initFav = false, onFavoriteChange }) {
  const { isLoggedIn } = useAuth();
  const [fav, setFav] = useState(initFav);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('กรุณาเข้าสู่ระบบก่อนบันทึกรายการโปรด');
      return;
    }
    setLoading(true);
    try {
      if (fav) {
        await api.delete(`/favorites/${food._id}`);
        setFav(false);
        toast.success('ลบออกจากรายการโปรดแล้ว');
      } else {
        await api.post(`/favorites/${food._id}`);
        setFav(true);
        toast.success('บันทึกในรายการโปรดแล้ว');
      }
      onFavoriteChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/foods/${food._id}`} className="card group block">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-primary-50">
        {food.image ? (
          <img
            src={food.image}
            alt={food.nameTh || food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">{food.category?.icon || '🥗'}</span>
          </div>
        )}
        
        {/* Category badge */}
        {food.category && (
          <span
            className="absolute top-3 left-3 badge text-white text-xs"
            style={{ backgroundColor: food.category.color || '#22c55e' }}
          >
            {food.category.icon} {food.category.name}
          </span>
        )}
        
        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          disabled={loading}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
            ${fav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
        >
          <Heart size={15} className={fav ? 'fill-current' : ''} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-primary-700 transition-colors">
          {food.nameTh || food.name}
        </h3>
        {food.nameTh && food.name !== food.nameTh && (
          <p className="text-xs text-gray-400 mb-2">{food.name}</p>
        )}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{food.description}</p>
        
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {food.nutrition?.calories > 0 && (
            <span className="flex items-center gap-1">
              <Flame size={12} className="text-orange-500" />
              {food.nutrition.calories} kcal
            </span>
          )}
          {food.preparationTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-blue-500" />
              {food.preparationTime} นาที
            </span>
          )}
          {food.difficulty && (
            <span className={`badge ${difficultyColor[food.difficulty]}`}>
              <ChefHat size={10} />
              {difficultyMap[food.difficulty]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
