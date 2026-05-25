import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import api from '../utils/api';
import FoodCard from '../components/shared/FoodCard';

export default function FoodsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set('search', search);
      if (selectedCategory) params.set('category', selectedCategory);
      
      const res = await api.get(`/foods?${params}`);
      setFoods(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data || []));
  }, []);

  useEffect(() => {
    fetchFoods();
    // Update URL
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  }, [page, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFoods();
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title mb-2">เมนูอาหารเพื่อสุขภาพ</h1>
        <p className="text-gray-500">ค้นพบเมนูอาหารที่ดีต่อสุขภาพของคุณ</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาชื่ออาหาร..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">ค้นหา</button>
        </form>
        
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleCategoryChange('')}
            className={`badge text-sm py-1.5 cursor-pointer transition-all ${
              !selectedCategory 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
            }`}
          >
            ทั้งหมด
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat._id)}
              className={`badge text-sm py-1.5 cursor-pointer transition-all ${
                selectedCategory === cat._id 
                  ? 'text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
              }`}
              style={selectedCategory === cat._id ? { backgroundColor: cat.color } : {}}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results info */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          พบ {pagination.total || 0} รายการ
          {search && ` สำหรับ "${search}"`}
        </p>
      )}

      {/* Foods Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🥗</p>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">ไม่พบเมนูอาหาร</h3>
          <p className="text-gray-400">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {foods.map(food => <FoodCard key={food._id} food={food} />)}
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
              >
                ← ก่อนหน้า
              </button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                    page === i + 1 ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 hover:bg-primary-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
              >
                ถัดไป →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
