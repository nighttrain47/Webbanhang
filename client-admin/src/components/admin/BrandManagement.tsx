import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Plus, Search, Edit, Trash2, X, Award } from 'lucide-react';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
}

export default function BrandManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/brands`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBrands(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
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
      const res = await fetch(`${API_URL}/api/admin/brands/${deleteConfirmId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBrands(brands.filter(b => b._id !== deleteConfirmId));
      } else {
        alert('Có lỗi xảy ra khi xóa');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowModal(true);
  };

  const handleSave = async (formData: Partial<Brand>) => {
    const token = localStorage.getItem('adminToken');
    try {
      if (selectedBrand) {
        const res = await fetch(`${API_URL}/api/admin/brands/${selectedBrand._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const updated = await res.json();
          setBrands(brands.map(b => b._id === updated._id ? updated : b));
        } else {
          const err = await res.json();
          alert(err.message || 'Lỗi cập nhật');
        }
      } else {
        const res = await fetch(`${API_URL}/api/admin/brands`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const created = await res.json();
          setBrands([...brands, created]);
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
    setSelectedBrand(null);
  };

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thương hiệu</h1>
                  </div>
        <button
          onClick={() => { setSelectedBrand(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm mới
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-sm text-gray-500 mb-1">Tổng thương hiệu</p>
        <p className="text-2xl font-bold text-gray-800">{brands.length}</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thương hiệu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Chưa có thương hiệu nào</p>
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain rounded shadow-sm bg-white border" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            <Award className="w-5 h-5" />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{brand.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{brand.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors shadow-sm relative group"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Xóa thương hiệu</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa thương hiệu <strong>{brands.find(b => b._id === deleteConfirmId)?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer">Hủy</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer">Xóa thương hiệu</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <BrandModal
          brand={selectedBrand}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function BrandModal({
  brand,
  onClose,
  onSave
}: {
  brand: Brand | null;
  onClose: () => void;
  onSave: (data: Partial<Brand>) => void;
}) {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    description: brand?.description || '',
    logo: brand?.logo || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Tên thương hiệu là bắt buộc');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {brand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thương hiệu *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="VD: Good Smile Company"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={e => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="https://example.com/logo.png"
            />
            {formData.logo && (
              <div className="mt-2 flex justify-center">
                <img src={formData.logo} alt="Logo preview" className="h-16 object-contain" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Mô tả về thương hiệu..."
            />
          </div>
          <div className="flex gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              {brand ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
