import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../utils/api';
import ArticleCard from '../components/shared/ArticleCard';

const categories = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'nutrition', label: 'โภชนาการ' },
  { value: 'exercise', label: 'การออกกำลังกาย' },
  { value: 'wellness', label: 'สุขภาพองค์รวม' },
  { value: 'recipe', label: 'สูตรอาหาร' },
  { value: 'tips', label: 'เคล็ดลับ' },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const res = await api.get(`/articles?${params}`);
      setArticles(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/articles/latest').then(r => setLatestArticles(r.data.data || []));
  }, []);

  useEffect(() => { fetchArticles(); }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-2">บทความสุขภาพ</h1>
        <p className="text-gray-500">ความรู้ด้านโภชนาการและสุขภาพจากผู้เชี่ยวชาญ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main */}
        <div className="lg:col-span-3">
          {/* Search */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ค้นหาบทความ..."
                  className="input-field pl-10"
                />
              </div>
              <button type="submit" className="btn-primary">ค้นหา</button>
            </form>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => { setCategory(cat.value); setPage(1); }}
                  className={`badge text-sm py-1.5 cursor-pointer transition-all ${
                    category === cat.value 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📰</p>
              <h3 className="text-lg font-semibold text-gray-600">ไม่พบบทความ</h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.map(article => <ArticleCard key={article._id} article={article} />)}
              </div>
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-50">← ก่อนหน้า</button>
                  <span className="flex items-center px-4 text-sm text-gray-600">หน้า {page}/{pagination.pages}</span>
                  <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary px-4 py-2 text-sm disabled:opacity-50">ถัดไป →</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar - Latest */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h3 className="font-semibold text-gray-800 mb-4">บทความล่าสุด</h3>
            <div className="space-y-4">
              {latestArticles.map(article => (
                <a key={article._id} href={`/articles/${article._id}`} className="block group">
                  <p className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">{article.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(article.createdAt).toLocaleDateString('th-TH')}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
