import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Search, Edit, Trash2, FileText, Plus, X, Globe, Lock } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: string;
  author: string;
  content: string;
  image: string;
  published: boolean;
  createdAt: string;
}

export default function ArticleManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/articles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`http://localhost:5000/api/admin/articles/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setArticles(articles.filter(a => a._id !== id));
        } else {
          alert('Lỗi khi xóa bài viết');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleSave = async (formData: Partial<Article>) => {
    const token = localStorage.getItem('adminToken');
    try {
      if (selectedArticle) {
        // Cập nhật
        const res = await fetch(`http://localhost:5000/api/admin/articles/${selectedArticle._id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const updated = await res.json();
          setArticles(articles.map(a => a._id === updated._id ? updated : a));
          setShowModal(false);
        } else {
          const err = await res.json();
          alert(err.message || 'Lỗi cập nhật');
        }
      } else {
        // Thêm mới
        const res = await fetch(`${API_URL}/api/admin/articles`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, slug: formData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })
        });
        if (res.ok) {
          const created = await res.json();
          setArticles([created, ...articles]);
          setShowModal(false);
        } else {
          const err = await res.json();
          alert(err.message || 'Lỗi tạo bài viết');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Không thể kết nối server');
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin tức / Blog</h1>
                  </div>
        <button 
          onClick={() => { setSelectedArticle(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Viết bài mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bài viết</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Slug</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày đăng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Chưa có bài viết nào</p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {article.image ? (
                          <img src={article.image} alt={article.title} className="w-12 h-10 object-cover rounded shadow-sm" />
                        ) : (
                          <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1" title={article.title}>{article.title}</p>
                          <p className="text-xs text-gray-500">Bởi: {article.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">{article.slug}</td>
                    <td className="px-6 py-4">
                      {article.published ? (
                         <span className="flex items-center gap-1 text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded w-max">
                           <Globe size={14} /> Công khai
                         </span>
                      ) : (
                         <span className="flex items-center gap-1 text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded w-max">
                           <Lock size={14} /> Bản nháp
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleEdit(article)}
                          className="p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors shadow-sm relative group"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(article._id)}
                          className="p-2.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-colors shadow-sm relative group"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ArticleModal({ 
  article, 
  onClose, 
  onSave 
}: { 
  article: Article | null; 
  onClose: () => void; 
  onSave: (data: Partial<Article>) => void;
}) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    author: article?.author || 'HobbyShop Team',
    content: article?.content || '',
    image: article?.image || '',
    published: article ? article.published : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng nhập đủ Tiêu đề và Nội dung!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {article ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="article-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình thu nhỏ (Thumbnail)</label>
              <input
                type="url"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái đăng tải</label>
              <label className="flex items-center gap-2 cursor-pointer w-max">
                <input 
                  type="checkbox" 
                  checked={formData.published} 
                  onChange={e => setFormData({ ...formData, published: e.target.checked })} 
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
                <span className="font-medium">Xuất bản bài viết</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung bài viết * (Hỗ trợ HTML)</label>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none shrink-0 font-mono text-sm transition-colors"
                placeholder="<h1>Tiêu đề</h1><p>Đoạn văn...</p>"
              />
            </div>
          </form>
        </div>

        <div className="border-t p-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="article-form"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            {article ? 'Lưu cập nhật' : 'Đăng bài'}
          </button>
        </div>
      </div>
    </div>
  );
}
