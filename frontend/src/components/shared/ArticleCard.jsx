import { Link } from 'react-router-dom';
import { Clock, Eye, Tag } from 'lucide-react';

const categoryLabels = {
  nutrition: 'โภชนาการ',
  exercise: 'การออกกำลังกาย',
  wellness: 'สุขภาพองค์รวม',
  recipe: 'สูตรอาหาร',
  tips: 'เคล็ดลับ'
};

const categoryColors = {
  nutrition: 'bg-green-100 text-green-700',
  exercise: 'bg-blue-100 text-blue-700',
  wellness: 'bg-purple-100 text-purple-700',
  recipe: 'bg-orange-100 text-orange-700',
  tips: 'bg-amber-100 text-amber-700'
};

export default function ArticleCard({ article }) {
  const date = new Date(article.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Link to={`/articles/${article._id}`} className="card group block">
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-primary-50 to-primary-100">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">📰</span>
          </div>
        )}
        <span className={`absolute top-3 left-3 badge text-xs ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
          {categoryLabels[article.category] || article.category}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {article.viewCount || 0}
            </span>
          </div>
          {article.author?.name && (
            <span className="text-primary-600 font-medium">{article.author.name}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
