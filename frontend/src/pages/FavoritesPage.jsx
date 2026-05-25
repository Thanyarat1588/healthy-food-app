import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import api from '../utils/api';
import FoodCard from '../components/shared/FoodCard';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const handleFavoriteChange = () => fetchFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <Heart size={20} className="text-red-500 fill-current" />
        </div>
        <div>
          <h1 className="page-title">รายการโปรดของฉัน</h1>
          <p className="text-gray-500 text-sm">{favorites.length} รายการ</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">ยังไม่มีรายการโปรด</h3>
          <p className="text-gray-400 mb-6">กดไอคอนหัวใจที่เมนูอาหารเพื่อบันทึกรายการโปรด</p>
          <a href="/foods" className="btn-primary inline-block">เลือกดูเมนูอาหาร</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map(fav => (
            fav.food && (
              <FoodCard
                key={fav._id}
                food={fav.food}
                isFavorited={true}
                onFavoriteChange={handleFavoriteChange}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}
