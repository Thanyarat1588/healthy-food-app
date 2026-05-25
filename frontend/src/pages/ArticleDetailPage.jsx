import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, User } from 'lucide-react';
import api from '../utils/api';

const categoryLabels = {
  nutrition: 'โภชนาการ', exercise: 'การออกกำลังกาย',
  wellness: 'สุขภาพองค์รวม', recipe: 'สูตรอาหาร', tips: 'เคล็ดลับ'
};

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/articles/${id}`)
      .then(r => setArticle(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="aspect-video bg-gray-200 rounded-2xl"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded"></div>)}
      </div>
    </div>
  );

  if (!article) return (
    <div className="text-center py-16">
      <p className="text-5xl mb-4">😢</p>
      <h3 className="text-lg font-semibold">ไม่พบบทความ</h3>
      <Link to="/articles" className="btn-primary mt-4 inline-block">กลับหน้าบทความ</Link>
    </div>
  );

  const date = new Date(article.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 fade-in">
      <Link to="/articles" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> กลับหน้าบทความ
      </Link>

      {article.image && (
        <div className="rounded-2xl overflow-hidden aspect-video mb-6">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="mb-6">
        <span className="badge bg-primary-100 text-primary-700 text-xs mb-3">
          {categoryLabels[article.category] || article.category}
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-forest mb-4 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {article.author && (
            <span className="flex items-center gap-1">
              <User size={14} /> {article.author.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={14} /> {date}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} /> {article.viewCount || 0} ครั้ง
          </span>
        </div>
      </div>

      <div className="bg-primary-50 border-l-4 border-primary-500 rounded-r-xl p-4 mb-6">
        <p className="text-gray-700 italic">{article.excerpt}</p>
      </div>

      <div
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4
          [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-forest [&_h2]:mt-6 [&_h2]:mb-3
          [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-2
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
          [&_li]:text-gray-600 [&_p]:leading-relaxed
          [&_strong]:font-semibold [&_strong]:text-gray-800"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag, i) => (
            <span key={i} className="badge bg-gray-100 text-gray-600">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
