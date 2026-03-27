import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Link } from 'react-router';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Article {
  _id: string;
  title: string;
  slug: string;
  author: string;
  image: string;
  createdAt: string;
  content: string;
}

export default function BlogPage({ cartCount, user }: { cartCount: number, user?: any }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customer/articles`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} user={user} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Tin tức & Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về thế giới anime, lịch phát hành figure và mẹo bảo quản mô hình từ HobbyShop.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Chưa có bài viết nào</h3>
            <p className="text-gray-500 mt-2">Team HobbyShop đang chuẩn bị những nội dung thú vị. Hãy quay lại sau nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group">
                <Link to={`/blog/${article.slug}`} className="block relative overflow-hidden aspect-[16/10]">
                  {article.image ? (
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 pointer-events-none" />
                </Link>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {article.author}
                    </span>
                  </div>
                  
                  <Link to={`/blog/${article.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#FF6B00] transition-colors">
                      {article.title}
                    </h2>
                  </Link>
                  
                  {/* Trích xuất text ngắn từ HTML (ẩn <...>) */}
                  <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: article.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' }} 
                  />
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link 
                      to={`/blog/${article.slug}`} 
                      className="inline-flex items-center gap-2 text-[#FF6B00] font-semibold hover:text-[#E55D00] transition-colors group/link"
                    >
                      Đọc tiếp
                      <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
