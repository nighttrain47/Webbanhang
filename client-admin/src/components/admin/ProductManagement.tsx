import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { 
  Plus, Search, Edit, Trash2, Package, 
  X, Upload, Image as ImageIcon, CheckSquare
} from 'lucide-react';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  series: string;
  manufacturer: string;
  brand: any;
  category: any;
  price: number;
  originalPrice: number;
  promotionPrice: number;
  stock: number;
  sold: number;
  status: 'active' | 'inactive' | 'out-of-stock' | 'pre-order';
  image: string;
  images: string[];
  sku: string;
  rating?: number;
  description?: string;
  preorderDeadline?: string;
  estimatedDelivery?: string;
  maxPerOrder?: number;
  isHot?: boolean;
  isPromotion?: boolean;
  isPreorder?: boolean;
  scale?: string;
  dimensions?: string;
  material?: string;
  specs?: {
    material: string;
    size: string;
    sculptor: string;
    releaseDate: string;
  };
  tags?: string[];
}

export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

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
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/products?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.series.toLowerCase().includes(searchQuery.toLowerCase());
    const productCategoryId = product.category?._id || product.category;
    const matchesCategory = categoryFilter === 'all' || productCategoryId === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/products/${deleteConfirmId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProducts(products.filter(p => (p._id || p.id) !== deleteConfirmId));
      } else {
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Bulk selection helpers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => (p._id || p.id) as string)));
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/products/bulk-delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      if (res.ok) {
        setProducts(products.filter(p => !selectedIds.has((p._id || p.id) as string)));
        setSelectedIds(new Set());
      } else {
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Failed to bulk delete:', error);
    } finally {
      setShowBulkDeleteConfirm(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleSave = async (productData: Partial<Product>) => {
    const token = localStorage.getItem('adminToken');
    try {
      if (showEditModal && selectedProduct) {
        const id = selectedProduct._id || selectedProduct.id;
        const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts(products.map(p => (p._id || p.id) === id ? updated : p));
        } else {
          const err = await res.json();
          alert(err.message || 'Lỗi cập nhật');
        }
      } else {
        const res = await fetch(`${API_URL}/api/admin/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          const created = await res.json();
          setProducts([...products, created]);
        } else {
          const err = await res.json();
          alert(err.message || 'Lỗi thêm mới');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi kết nối');
    }
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Đang bán</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Tạm ngưng</span>;
      case 'out-of-stock':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Hết hàng</span>;
      case 'pre-order':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">Pre-order</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-gray-500 mt-1">Quản lý toàn bộ sản phẩm trong cửa hàng</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#FF9900] text-white px-4 py-3 rounded-lg hover:bg-[#E68A00] font-semibold"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Tổng sản phẩm</p>
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Đang bán</p>
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Pre-order</p>
          <p className="text-2xl font-bold text-purple-600">
            {products.filter(p => p.status === 'pre-order' || p.isPreorder).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Hết hàng</p>
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => p.status === 'out-of-stock').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Tổng tồn kho</p>
          <p className="text-2xl font-bold text-blue-600">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, Series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="pre-order">Pre-order</option>
            <option value="inactive">Tạm ngưng</option>
            <option value="out-of-stock">Hết hàng</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 flex items-center justify-between animate-in">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5" />
            <span className="font-semibold">Đã chọn {selectedIds.size} sản phẩm</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              Bỏ chọn
            </button>
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Xóa đã chọn
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBulkDeleteConfirm(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Xóa {selectedIds.size} sản phẩm</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa <strong>{selectedIds.size} sản phẩm</strong> đã chọn? Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={confirmBulkDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
              >
                Xóa {selectedIds.size} sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#FF9900] focus:ring-[#FF9900] cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dòng SP</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Giá</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tồn kho</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Flags</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const pid = (product._id || product.id) as string;
                  return (
                  <tr key={pid} className={`hover:bg-gray-50 ${selectedIds.has(pid) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(pid)}
                        onChange={() => toggleSelect(pid)}
                        className="w-4 h-4 rounded border-gray-300 text-[#FF9900] focus:ring-[#FF9900] cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-2 max-w-[200px]" title={product.name}>{product.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{product.category?.name || 'Không có'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[150px] truncate" title={product.series}>{product.series}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {product.price.toLocaleString()}đ
                        </p>
                        {product.originalPrice > 0 && product.originalPrice > product.price && (
                          <p className="text-xs text-gray-400 line-through">
                            {product.originalPrice.toLocaleString()}đ
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-yellow-600' :
                        'text-gray-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isHot && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-semibold">HOT</span>
                        )}
                        {product.isPromotion && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold">Sale</span>
                        )}
                        {(product.isPreorder || product.status === 'pre-order') && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">PO</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 cursor-pointer"
                          title="Chỉnh sửa"
                          style={{ position: 'relative', zIndex: 10, minWidth: '36px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(product._id || (product.id as string)); }}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600 cursor-pointer"
                          title="Xóa"
                          style={{ position: 'relative', zIndex: 10, minWidth: '36px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
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
                <h3 className="text-lg font-bold text-gray-800">Xóa sản phẩm</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm <strong>{products.find(p => (p._id || p.id) === deleteConfirmId)?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          brands={brands}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ============================================================
// Product Modal — Full form with all fields matching customer site
// ============================================================
function ProductModal({ 
  product,
  categories,
  brands,
  onClose, 
  onSave 
}: { 
  product: Product | null; 
  categories: any[];
  brands: any[];
  onClose: () => void; 
  onSave: (product: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    series: product?.series || '',
    manufacturer: product?.manufacturer || '',
    brand: product?.brand?._id || product?.brand || '',
    category: product?.category?._id || product?.category || (categories.length > 0 ? categories[0]._id : ''),
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    promotionPrice: product?.promotionPrice || 0,
    stock: product?.stock || 0,
    status: product?.status || 'active',
    imageUrl: product?.image || '',
    images: product?.images?.join('\n') || '',
    description: product?.description || '',
    preorderDeadline: product?.preorderDeadline || '',
    estimatedDelivery: product?.estimatedDelivery || '',
    maxPerOrder: product?.maxPerOrder || 0,
    isHot: product?.isHot || false,
    isPromotion: product?.isPromotion || false,
    isPreorder: product?.isPreorder || false,
    scale: product?.scale || '',
    dimensions: product?.dimensions || '',
    material: product?.material || '',
  });

  const [imageInputMode, setImageInputMode] = useState<'url' | 'file'>('url');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData({ ...formData, imageUrl: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const imagesArray = formData.images
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const productData: any = {
      name: formData.name,
      series: formData.series,
      manufacturer: formData.manufacturer,
      brand: formData.brand || null,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      promotionPrice: Number(formData.promotionPrice),
      stock: Number(formData.stock),
      status: formData.status,
      description: formData.description,
      image: formData.imageUrl,
      images: imagesArray,
      preorderDeadline: formData.preorderDeadline,
      estimatedDelivery: formData.estimatedDelivery,
      maxPerOrder: Number(formData.maxPerOrder),
      isHot: formData.isHot,
      isPromotion: formData.isPromotion,
      isPreorder: formData.isPreorder,
      scale: formData.scale,
      dimensions: formData.dimensions,
      material: formData.material,
    };
    
    onSave(productData);
  };

  const toggleStyle = (active: boolean, color: string) => ({
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: `2px solid ${active ? color : '#e5e7eb'}`,
    background: active ? `${color}10` : '#fff',
    cursor: 'pointer' as const,
    transition: 'all 200ms',
    fontSize: '13px',
    fontWeight: 600,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">

            {/* ========== PHẦN 1: Thông tin sản phẩm ========== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF9900]" />
                Thông tin sản phẩm
              </h3>

              <div className="space-y-5">
                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh đại diện sản phẩm
                  </label>
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                      {formData.imageUrl ? (
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">Preview</p>
                        </div>
                      )}
                    </div>

                    {/* Input area */}
                    <div className="flex-1 space-y-3">
                      {/* Toggle buttons */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setImageInputMode('url')}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            imageInputMode === 'url'
                              ? 'bg-[#FF9900] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode('file')}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                            imageInputMode === 'file'
                              ? 'bg-[#FF9900] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Tải lên
                        </button>
                      </div>

                      {imageInputMode === 'url' ? (
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] text-sm"
                          placeholder="https://example.com/product-image.jpg"
                        />
                      ) : (
                        <label className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500">Chọn file ảnh từ máy tính...</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      )}
                      <p className="text-xs text-gray-400">Khuyến nghị: ảnh vuông, kích thước tối thiểu 400×400px</p>
                    </div>
                  </div>
                </div>

                {/* Gallery images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh bộ sưu tập (Gallery) — mỗi dòng một URL
                  </label>
                  <textarea
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] text-sm"
                    placeholder={`https://example.com/image1.jpg\nhttps://example.com/image2.jpg`}
                  />
                </div>

                {/* Series / Brand */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dòng sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.series}
                      onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                      placeholder="VD: Uma Musume Pretty Derby"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thương hiệu
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    >
                      <option value="">-- Chọn thương hiệu --</option>
                      {brands.map(b => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="VD: Nendoroid Rem"
                  />
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhà sản xuất
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="VD: Good Smile Company"
                  />
                </div>

                {/* Price + Original Price + Category row */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá bán <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                        placeholder="500000"
                      />
                    </div>
                    {formData.price > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {Number(formData.price).toLocaleString()}đ
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá gốc (nếu có)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                      placeholder="0"
                    />
                    {formData.originalPrice > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {Number(formData.originalPrice).toLocaleString()}đ
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    >
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ========== Product Flags ========== */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nhãn sản phẩm
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <label style={toggleStyle(formData.isHot, '#f97316')}>
                      <input
                        type="checkbox"
                        checked={formData.isHot}
                        onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span>🔥 Sản phẩm HOT</span>
                    </label>

                    <label style={toggleStyle(formData.isPromotion, '#ef4444')}>
                      <input
                        type="checkbox"
                        checked={formData.isPromotion}
                        onChange={(e) => setFormData({ ...formData, isPromotion: e.target.checked })}
                        className="w-4 h-4 accent-red-500"
                      />
                      <span>🏷️ Khuyến mãi</span>
                    </label>

                    <label style={toggleStyle(formData.isPreorder, '#8b5cf6')}>
                      <input
                        type="checkbox"
                        checked={formData.isPreorder}
                        onChange={(e) => setFormData({ ...formData, isPreorder: e.target.checked })}
                        className="w-4 h-4 accent-purple-500"
                      />
                      <span>📦 Pre-order</span>
                    </label>
                  </div>
                </div>

                {/* Pre-order + Delivery row */}
                {(formData.isPreorder || formData.status === 'pre-order') && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời hạn đặt trước
                      </label>
                      <input
                        type="text"
                        value={formData.preorderDeadline}
                        onChange={(e) => setFormData({ ...formData, preorderDeadline: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                        placeholder="VD: Đến 14:59 ngày 13/04/2026"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian giao hàng dự kiến
                      </label>
                      <input
                        type="text"
                        value={formData.estimatedDelivery}
                        onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                        placeholder="VD: Tháng 08/2026"
                      />
                    </div>
                  </div>
                )}

                {/* Max per order + Stock row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới hạn mua / lần
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxPerOrder}
                      onChange={(e) => setFormData({ ...formData, maxPerOrder: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.maxPerOrder > 0 
                        ? `Tối đa ${formData.maxPerOrder} sản phẩm / lần mua`
                        : 'Nhập 0 = không giới hạn'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                      placeholder="0"
                    />
                    {formData.stock > 0 && formData.stock < 10 && (
                      <p className="text-xs text-yellow-600 mt-1">⚠️ Số lượng thấp</p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: 'active', label: 'Đang bán', color: 'green' },
                      { value: 'pre-order', label: 'Pre-order', color: 'purple' },
                      { value: 'inactive', label: 'Tạm ngưng', color: 'gray' },
                      { value: 'out-of-stock', label: 'Hết hàng', color: 'red' },
                    ].map(opt => (
                      <label key={opt.value} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.status === opt.value 
                          ? `border-${opt.color}-500 bg-${opt.color}-50` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="status"
                          value={opt.value}
                          checked={formData.status === opt.value}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-4 h-4"
                        />
                        <p className="font-medium text-gray-800 text-sm">{opt.label}</p>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ========== PHẦN 2: Thông số kỹ thuật ========== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#FF9900]" />
                Thông số kỹ thuật
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tỷ lệ (Scale)</label>
                  <input
                    type="text"
                    value={formData.scale}
                    onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] text-sm"
                    placeholder="VD: 1/7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] text-sm"
                    placeholder="VD: H250mm × W150mm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chất liệu</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] text-sm"
                    placeholder="VD: PVC & ABS"
                  />
                </div>
              </div>
            </div>

            {/* ========== PHẦN 3: Mô tả chi tiết ========== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#FF9900]" />
                Mô tả chi tiết
              </h3>

              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] text-sm leading-relaxed"
                placeholder={`Nhập chi tiết sản phẩm...\n\nVD:\nKích thước: Cao khoảng 400mm\nChất liệu: PVC & ABS\nNhà sản xuất: Good Smile Company\nĐộ tuổi: Từ 15 tuổi trở lên`}
              />
            </div>
          </div>

          {/* Action Buttons — sticky bottom */}
          <div className="border-t px-6 py-4 flex gap-3 bg-white sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] font-semibold transition-colors"
            >
              {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}