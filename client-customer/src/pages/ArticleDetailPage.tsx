import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useParams, Link } from 'react-router';
import { Calendar, User, ChevronLeft, ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Article {
  _id: string;
  title: string;
  slug: string;
  author: string;
  image: string;
  content: string;
  createdAt: string;
}

export default function ArticleDetailPage({ cartCount, user }: { cartCount: number, user?: any }) {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customer/articles/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartCount={cartCount} user={user} />
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header cartCount={cartCount} user={user} />
        <div className="flex-1 flex flex-col justify-center items-center py-20 px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h2>
          <p className="text-gray-600 mb-8 max-w-md">Rất tiếc, bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-lg hover:bg-[#E55D00] transition-colors font-semibold">
            <ArrowLeft className="w-5 h-5" />
            Về trang Tin tức
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cartCount} user={user} />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#FF6B00] transition-colors">Trang chủ</Link>
          <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />
          <Link to="/blog" className="hover:text-[#FF6B00] transition-colors">Tin tức</Link>
          <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-xs">{article.title}</span>
        </div>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <header className="p-6 md:p-10 pb-0 mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 font-medium border-b border-gray-100 pb-8">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <User className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-gray-800">Tác giả: <span className="text-[#FF6B00]">{article.author}</span></span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 text-gray-500" />
                {new Date(article.createdAt).toLocaleDateString('vi-VN', {
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.image && (
            <div className="w-full aspect-[21/9] md:aspect-[16/7] overflow-hidden bg-gray-100 mb-10">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-10 pt-0">
            <div 
              className="prose prose-lg prose-orange max-w-none text-gray-800"
              style={{ lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
          
          {/* Footer of article */}
          <footer className="px-6 md:px-10 py-6 bg-gray-50 border-t border-gray-100">
             <div className="flex justify-between items-center">
               <span className="text-gray-600 font-medium">Chia sẻ bài viết này:</span>
               <div className="flex gap-3">
                 <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">fb</button>
                 <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition">tw</button>
                 <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition">🔗</button>
               </div>
             </div>
          </footer>
        </article>

        <div className="mt-12 text-center">
           <Link to="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF6B00] font-medium group">
             <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
             Xem các bài viết khác
           </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
