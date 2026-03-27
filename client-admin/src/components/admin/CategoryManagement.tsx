import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Plus, Search, Edit, Trash2, FolderTree, X } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Thử fetch qua api/admin/categories
      // Dùng endpoint tuyệt đối hoặc relative tùy cấu hình, ở đây dùng relative
      const res = await fetch(`${API_URL}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/categories/${deleteConfirmId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== deleteConfirmId));
      } else {
        alert('Có lỗi xảy ra khi xóa');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleSave = async (formData: Partial<Category>) => {
    const token = localStorage.getItem('adminToken');
    try {
      if (selectedCategory) {
        // Cập nhật
        const res = await fetch(`${API_URL}/api/admin/categories/${selectedCategory._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const updated = await res.json();
          setCategories(categories.map(c => c._id === updated._id ? updated : c));
        } else {
          const err = await res.json();
          alert(err.message || 'Lỗi cập nhật');
        }
      } else {
        // Thêm mới
        const res = await fetch(`${API_URL}/api/admin/categories`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const created = await res.json();
          setCategories([...categories, created]);
        } else {
          const err = await res.json();
          alert(err.message || 'Lỗi thêm mới');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi kết nối');
    }
    setShowModal(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
          <p className="text-gray-500 mt-1">Quản lý các danh mục sản phẩm của hệ thống</p>
        </div>
        <button 
          onClick={() => {
            setSelectedCategory(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#FF9900] text-white px-4 py-3 rounded-lg hover:bg-[#E68A00] font-semibold"
        >
          <Plus className="w-5 h-5" />
          Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Slug</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Chưa có danh mục nào</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            <FolderTree className="w-5 h-5" />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{category.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Xóa danh mục</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa danh mục <strong>{categories.find(c => c._id === deleteConfirmId)?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer">Hủy</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer">Xóa danh mục</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function CategoryModal({ 
  category, 
  onClose, 
  onSave 
}: { 
  category: Category | null; 
  onClose: () => void; 
  onSave: (data: Partial<Category>) => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Tên danh mục là bắt buộc');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:outline-none"
              placeholder="VD: Mô hình lắp ráp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:outline-none"
              placeholder="Mô tả về danh mục..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Hình ảnh
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:outline-none"
              placeholder="https://example.com/image.png"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] font-semibold"
            >
              {category ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
