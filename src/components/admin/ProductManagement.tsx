import { useState } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Package, 
  AlertCircle, CheckCircle, X, Upload, Image as ImageIcon,
  Link as LinkIcon, Download, Loader2, ExternalLink, Info
} from 'lucide-react';
import { fetchAmiAmiProduct, isValidAmiAmiUrl, getAvailableMockProducts } from '../../services/amiamiService';

interface Product {
  id: string;
  name: string;
  series: string;
  manufacturer: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  image: string;
  sku: string;
  rating?: number;
  description?: string;
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

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Miku Hatsune 1/7 Scale Figure',
      series: 'Vocaloid',
      manufacturer: 'Good Smile Company',
      category: 'Figures',
      price: 189000,
      stock: 15,
      sold: 45,
      status: 'active',
      image: 'https://via.placeholder.com/100',
      sku: 'FIG-001',
      rating: 4.8,
      description: 'Figure cao cấp tỷ lệ 1/7 của Hatsune Miku',
      specs: {
        material: 'PVC, ABS',
        size: '24cm',
        sculptor: 'Takayuki',
        releaseDate: '2024-03-15'
      },
      tags: ['Vocaloid', 'Miku', 'Figure']
    },
    {
      id: '2',
      name: 'Rem: Crystal Dress Ver.',
      series: 'Re:Zero',
      manufacturer: 'SEGA',
      category: 'Figures',
      price: 225000,
      stock: 8,
      sold: 32,
      status: 'active',
      image: 'https://via.placeholder.com/100',
      sku: 'FIG-002',
      rating: 4.9,
      tags: ['Re:Zero', 'Rem', 'Premium']
    },
    {
      id: '3',
      name: 'Attack on Titan OST Collection',
      series: 'Attack on Titan',
      manufacturer: 'Pony Canyon',
      category: 'CDs',
      price: 68000,
      stock: 25,
      sold: 67,
      status: 'active',
      image: 'https://via.placeholder.com/100',
      sku: 'CD-001',
      rating: 5.0,
      tags: ['AOT', 'Music', 'OST']
    },
    {
      id: '4',
      name: 'Nendoroid Nezuko',
      series: 'Demon Slayer',
      manufacturer: 'Good Smile Company',
      category: 'Figures',
      price: 45000,
      stock: 0,
      sold: 89,
      status: 'out-of-stock',
      image: 'https://via.placeholder.com/100',
      sku: 'NEN-001',
      rating: 4.7,
      tags: ['Demon Slayer', 'Nendoroid']
    },
    {
      id: '5',
      name: 'Demon Slayer Art Book',
      series: 'Demon Slayer',
      manufacturer: 'Shueisha',
      category: 'Goods',
      price: 55000,
      stock: 30,
      sold: 56,
      status: 'active',
      image: 'https://via.placeholder.com/100',
      sku: 'BOOK-001',
      rating: 4.6,
      tags: ['Art Book', 'Collection']
    }
  ];

  const [products, setProducts] = useState(mockProducts);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.series.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Đang bán</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Tạm ngưng</span>;
      case 'out-of-stock':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Hết hàng</span>;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              placeholder="Tìm kiếm sản phẩm, SKU, Series..."
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
            <option value="Scale Figures">Scale Figures</option>
            <option value="Nendoroid">Nendoroid</option>
            <option value="Figma">Figma</option>
            <option value="Prize Figures">Prize Figures</option>
            <option value="Gundam">Gundam</option>
            <option value="Goods">Goods</option>
            <option value="Anime OST">Anime OST</option>
            <option value="Character Songs">Character Songs</option>
            <option value="Drama CD">Drama CD</option>
            <option value="Blu-ray">Blu-ray</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Tạm ngưng</option>
            <option value="out-of-stock">Hết hàng</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Series</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nhà sản xuất</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Giá</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tồn kho</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Đã bán</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.series}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.manufacturer}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {product.price.toLocaleString()}đ
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
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sold}</td>
                  <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSave={(product) => {
            if (showEditModal && selectedProduct) {
              setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...product } : p));
            } else {
              const newProduct = {
                ...product,
                id: Date.now().toString(),
                sold: 0,
                image: 'https://via.placeholder.com/100'
              } as Product;
              setProducts([...products, newProduct]);
            }
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

// Product Modal Component
function ProductModal({ 
  product, 
  onClose, 
  onSave 
}: { 
  product: Product | null; 
  onClose: () => void; 
  onSave: (product: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    series: product?.series || '',
    manufacturer: product?.manufacturer || '',
    category: product?.category || 'Scale Figures',
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || 'active',
    sku: product?.sku || '',
    description: product?.description || '',
    imageUrl: product?.image || '',
    material: product?.specs?.material || '',
    size: product?.specs?.size || '',
    sculptor: product?.specs?.sculptor || '',
    releaseDate: product?.specs?.releaseDate || '',
    tags: product?.tags?.join(', ') || ''
  });

  const [currentTab, setCurrentTab] = useState<'basic' | 'specs' | 'inventory'>('basic');
  
  // AmiAmi Auto-fetch states
  const [amiamiUrl, setAmiamiUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [showMockUrls, setShowMockUrls] = useState(false);

  const handleFetchFromAmiAmi = async () => {
    if (!amiamiUrl.trim()) {
      setFetchError('Vui lòng nhập URL AmiAmi');
      return;
    }

    if (!isValidAmiAmiUrl(amiamiUrl)) {
      setFetchError('URL không hợp lệ. Vui lòng nhập URL từ amiami.com có chứa gcode');
      return;
    }

    setIsFetching(true);
    setFetchError('');
    setFetchSuccess(false);

    try {
      const productData = await fetchAmiAmiProduct(amiamiUrl);
      
      // Auto-fill form with fetched data
      setFormData({
        name: productData.name,
        series: productData.series,
        manufacturer: productData.manufacturer,
        category: productData.category,
        price: productData.price,
        stock: 10, // Default stock
        status: 'active',
        sku: productData.sku,
        description: productData.description,
        imageUrl: productData.imageUrl,
        material: productData.material,
        size: productData.size,
        sculptor: productData.sculptor,
        releaseDate: productData.releaseDate,
        tags: `${productData.series}, ${productData.manufacturer}, ${productData.category}`
      });

      setFetchSuccess(true);
      setFetchError('');
      
      // Auto switch to basic info tab to show filled data
      setCurrentTab('basic');
      
    } catch (error: any) {
      setFetchError(error.message || 'Không thể lấy thông tin sản phẩm');
      setFetchSuccess(false);
    } finally {
      setIsFetching(false);
    }
  };

  const mockUrls = getAvailableMockProducts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      series: formData.series,
      manufacturer: formData.manufacturer,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      status: formData.status as any,
      sku: formData.sku,
      description: formData.description,
      image: formData.imageUrl,
      specs: {
        material: formData.material,
        size: formData.size,
        sculptor: formData.sculptor,
        releaseDate: formData.releaseDate
      },
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    
    onSave(productData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold">
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setCurrentTab('basic')}
              className={`py-3 px-2 border-b-2 font-medium transition-colors ${
                currentTab === 'basic'
                  ? 'border-[#FF9900] text-[#FF9900]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Thông tin cơ bản
            </button>
            <button
              onClick={() => setCurrentTab('specs')}
              className={`py-3 px-2 border-b-2 font-medium transition-colors ${
                currentTab === 'specs'
                  ? 'border-[#FF9900] text-[#FF9900]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Thông số kỹ thuật
            </button>
            <button
              onClick={() => setCurrentTab('inventory')}
              className={`py-3 px-2 border-b-2 font-medium transition-colors ${
                currentTab === 'inventory'
                  ? 'border-[#FF9900] text-[#FF9900]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Kho hàng & Giá
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* AmiAmi Auto-fetch Section - Always visible at top */}
          {!product && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-[#FF9900] rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-[#FF9900] p-2 rounded-lg">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    🚀 Tự động lấy thông tin từ AmiAmi
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Dán link sản phẩm từ AmiAmi.com để tự động điền thông tin sản phẩm vào form
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={amiamiUrl}
                        onChange={(e) => {
                          setAmiamiUrl(e.target.value);
                          setFetchError('');
                          setFetchSuccess(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleFetchFromAmiAmi();
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        placeholder="https://www.amiami.com/eng/detail?gcode=FIGURE-197861"
                        disabled={isFetching}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleFetchFromAmiAmi}
                      disabled={isFetching}
                      className="px-6 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Đang lấy...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Lấy thông tin</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Success Message */}
                  {fetchSuccess && (
                    <div className="mt-3 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-semibold">
                        ✅ Thành công! Thông tin sản phẩm đã được tự động điền vào form. Vui lòng kiểm tra và điều chỉnh nếu cần.
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {fetchError && (
                    <div className="mt-3 flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{fetchError}</p>
                      </div>
                    </div>
                  )}

                  {/* Mock URLs */}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setShowMockUrls(!showMockUrls)}
                      className="text-sm text-[#FF9900] hover:text-[#E68A00] font-semibold flex items-center gap-1"
                    >
                      <Info className="w-4 h-4" />
                      {showMockUrls ? 'Ẩn' : 'Xem'} danh sách URL mẫu có sẵn ({mockUrls.length})
                    </button>
                  </div>

                  {showMockUrls && (
                    <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        💡 Click vào URL bên dưới để thử nghiệm:
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {mockUrls.map((url, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setAmiamiUrl(url);
                              setShowMockUrls(false);
                            }}
                            className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-[#FF9900] hover:text-white text-sm rounded-lg transition-colors border border-gray-200 hover:border-[#FF9900] flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{url}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Basic Info Tab */}
          {currentTab === 'basic' && (
            <div className="space-y-6">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Hình ảnh sản phẩm
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <div className="mt-3 p-4 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="VD: Miku Hatsune 1/7 Scale Figure"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Series/Anime *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.series}
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="VD: Vocaloid"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhà sản xuất *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="VD: Good Smile Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="FIG-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  >
                    <option value="Scale Figures">Scale Figures</option>
                    <option value="Nendoroid">Nendoroid</option>
                    <option value="Figma">Figma</option>
                    <option value="Prize Figures">Prize Figures</option>
                    <option value="Gundam">Gundam</option>
                    <option value="Goods">Goods</option>
                    <option value="Anime OST">Anime OST</option>
                    <option value="Character Songs">Character Songs</option>
                    <option value="Drama CD">Drama CD</option>
                    <option value="Blu-ray">Blu-ray</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="Vocaloid, Miku, Limited Edition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Specs Tab */}
          {currentTab === 'specs' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chất liệu
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="VD: PVC, ABS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="VD: 24cm (1/7 Scale)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sculptor / Thiết kế
                </label>
                <input
                  type="text"
                  value={formData.sculptor}
                  onChange={(e) => setFormData({ ...formData, sculptor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="VD: Takayuki"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày phát hành
                </label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>

              <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Lưu ý:</strong> Các thông số kỹ thuật sẽ được hiển thị trên trang chi tiết sản phẩm.
                  Điền đầy đủ thông tin để khách hàng có thể tham khảo.
                </p>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {currentTab === 'inventory' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá bán (VNĐ) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Preview: <span className="font-semibold text-[#FF9900]">
                    {Number(formData.price).toLocaleString()}đ
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng tồn kho *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="0"
                />
                {formData.stock < 10 && formData.stock > 0 && (
                  <p className="text-sm text-yellow-600 mt-1">⚠️ Số lượng thấp</p>
                )}
                {formData.stock === 0 && (
                  <p className="text-sm text-red-600 mt-1">❌ Hết hàng</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.status === 'active' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-4 h-4 text-green-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800">Đang bán</p>
                      <p className="text-xs text-gray-500">Hiển thị trên store</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.status === 'inactive' 
                      ? 'border-gray-500 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-4 h-4 text-gray-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800">Tạm ngưng</p>
                      <p className="text-xs text-gray-500">Ẩn khỏi store</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.status === 'out-of-stock' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="out-of-stock"
                      checked={formData.status === 'out-of-stock'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-4 h-4 text-red-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800">Hết hàng</p>
                      <p className="text-xs text-gray-500">Hiển thị "Hết"</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="col-span-2 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  💰 <strong>Tổng giá trị kho:</strong> {' '}
                  <span className="font-bold">
                    {(Number(formData.price) * Number(formData.stock)).toLocaleString()}đ
                  </span>
                  {' '}({formData.stock} sản phẩm × {Number(formData.price).toLocaleString()}đ)
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] font-semibold"
            >
              {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}