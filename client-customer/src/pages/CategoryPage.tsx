import { useEffect, useState, useMemo } from 'react';
import { API_URL } from '../config';
import { useParams, Link, useNavigate } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../App';

interface CategoryPageProps {
  addToCart: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  user?: any;
}

// Icon mapping by category slug — matches admin categories
const SLUG_ICON_MAP: Record<string, string> = {
  'all': 'apps',
  'scale-figure': 'diamond',
  'nendoroid': 'smart_toy',
  'figma': 'styler',
  'goods-merchandise': 'shopping_bag',
  'cd-soundtrack': 'album',
  'gundam-mecha': 'precision_manufacturing',
  'manga-art-book': 'menu_book',
  'pre-order': 'schedule',
};

// Special (non-DB) category pages
const SPECIAL_CATEGORIES: Record<string, { title: string; desc: string }> = {
  'all': { title: 'Tất cả sản phẩm', desc: 'Khám phá bộ sưu tập mô hình anime cao cấp từ những thương hiệu hàng đầu Nhật Bản.' },
  'ranking': { title: 'Bảng xếp hạng', desc: 'Top sản phẩm bán chạy nhất.' },
  'new-arrivals': { title: 'Sản phẩm mới', desc: 'Cập nhật liên tục các sản phẩm mới nhất.' },
  'sale': { title: 'Khuyến mãi', desc: 'Ưu đãi hấp dẫn không thể bỏ lỡ.' },
};



interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoryPage({ addToCart, wishlist, toggleWishlist, cartCount, user }: CategoryPageProps) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandList, setBrandList] = useState<{_id: string; name: string}[]>([]);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, selectedBrands, sortBy]);

  // Fetch brands and categories from API
  useEffect(() => {
    fetch(`${API_URL}/api/customer/brands`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setBrandList(data); })
      .catch(console.error);
    fetch(`${API_URL}/api/customer/categories`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setApiCategories(data); })
      .catch(console.error);
  }, []);

  // Build sidebar items dynamically from API categories
  const sidebarCats = useMemo(() => {
    const items = [{ icon: 'apps', label: 'Tất cả sản phẩm', slug: 'all' }];
    apiCategories.forEach(cat => {
      items.push({
        icon: SLUG_ICON_MAP[cat.slug] || 'category',
        label: cat.name,
        slug: cat.slug,
      });
    });
    return items;
  }, [apiCategories]);

  // Build category info from API data or special categories
  const info = useMemo(() => {
    if (!categoryId) return { title: 'Danh mục', desc: '' };
    if (SPECIAL_CATEGORIES[categoryId]) return SPECIAL_CATEGORIES[categoryId];
    const match = apiCategories.find(c => c.slug === categoryId || c._id === categoryId);
    if (match) return { title: match.name, desc: match.description || '' };
    return { title: 'Danh mục', desc: '' };
  }, [categoryId, apiCategories]);

  useEffect(() => {
    document.title = `${info.title} | FigureCurator`;
  }, [info.title]);

  useEffect(() => {
    if (!categoryId) return;
    // Reset filters on category change
    setSelectedBrands([]);

    if (categoryId === 'all') {
      // Fetch ALL active products for full brand/price filtering
      fetch(`${API_URL}/api/customer/products/all`).then(r => r.json()).then(data => {
        setProducts(Array.isArray(data) ? data : []);
      }).catch(console.error);
    } else if (categoryId === 'new-arrivals') {
      fetch(`${API_URL}/api/customer/products/new?limit=200`).then(r => r.json()).then(data => {
        setProducts(Array.isArray(data) ? data : []);
      }).catch(console.error);
    } else if (categoryId === 'ranking') {
      fetch(`${API_URL}/api/customer/products/hot?limit=200`).then(r => r.json()).then(data => {
        setProducts(Array.isArray(data) ? data : []);
      }).catch(console.error);
    } else if (categoryId === 'pre-order') {
      fetch(`${API_URL}/api/customer/products/preorder?limit=200`).then(r => r.json()).then(data => {
        setProducts(Array.isArray(data) ? data : []);
      }).catch(console.error);
    } else if (categoryId === 'sale') {
      fetch(`${API_URL}/api/customer/products/promotion?limit=200`).then(r => r.json()).then(data => {
        setProducts(Array.isArray(data) ? data : []);
      }).catch(console.error);
    } else {
      // Find matching category from API data or fetch fresh
      const findAndFetch = async () => {
        let cats = apiCategories;
        if (cats.length === 0) {
          try {
            const res = await fetch(`${API_URL}/api/customer/categories`);
            cats = await res.json();
          } catch { cats = []; }
        }
        const match = cats.find((c: any) => c.slug === categoryId || c._id === categoryId);
        if (match) {
          const res = await fetch(`${API_URL}/api/customer/products/category/${match._id}?limit=200`);
          const data = await res.json();
          if (data?.products) setProducts(data.products);
          else if (Array.isArray(data)) setProducts(data);
          else setProducts([]);
        } else {
          // Fallback: fetch all
          const res = await fetch(`${API_URL}/api/customer/products/all`);
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      };
      findAndFetch();
    }
  }, [categoryId, apiCategories]);


  // Toggle brand filter — store brand _id for accurate matching
  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId) ? prev.filter(b => b !== brandId) : [...prev, brandId]
    );
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Brand filter — match by brand._id (populated object), or fallback to name/manufacturer
    if (selectedBrands.length > 0) {
      result = result.filter(p => {
        const pBrand = (p as any).brand;
        return selectedBrands.some(brandId => {
          // Match by brand object _id (after populate)
          if (pBrand && typeof pBrand === 'object') {
            if (String(pBrand._id) === brandId) return true;
          }
          // Fallback: check manufacturer string contains the brand id (as name match via brandList)
          const matchedBrand = brandList.find(b => b._id === brandId);
          if (matchedBrand) {
            const bName = matchedBrand.name.toLowerCase();
            return (
              p.manufacturer?.toLowerCase().includes(bName) ||
              (pBrand?.name?.toLowerCase().includes(bName))
            );
          }
          return false;
        });
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'popular': result.sort((a, b) => (b.sold || 0) - (a.sold || 0)); break;
      default: break;
    }

    return result;
  }, [products, selectedBrands, sortBy]);

  const isActive = (slug: string) => {
    if (slug === 'all') {
      return ['all', 'new-arrivals', 'ranking', 'sale', 'pre-order'].includes(categoryId || 'all');
    }
    return categoryId === slug;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a949d', marginBottom: '8px' }}>
          <Link to="/" style={{ color: '#8a949d', textDecoration: 'none' }}>Trang chủ</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <Link to="/category/all" style={{ color: '#8a949d', textDecoration: 'none' }}>Sản phẩm</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#3e4850' }}>{info.title}</span>
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800, fontSize: '32px', color: '#181c1e', marginBottom: '24px',
        }}>
          {info.title}
        </h1>

        {/* Sort bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ fontSize: '13px', color: '#8a949d' }}>
            {filteredProducts.length} sản phẩm
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#8a949d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>SẮP XẾP THEO TÌNH TRẠNG:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '8px', border: '1px solid #e0e3e5',
                background: '#fff', fontSize: '13px', color: '#3e4850', outline: 'none',
              }}
            >
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* ═══ LEFT SIDEBAR ═══ */}
          <aside className="hidden lg:block" style={{ width: '200px', flexShrink: 0 }}>
            {/* Category List */}
            <div style={{ marginBottom: '32px' }}>
              {sidebarCats.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: isActive(cat.slug) ? 600 : 400,
                    color: isActive(cat.slug) ? '#00658d' : '#3e4850',
                    background: isActive(cat.slug) ? 'rgba(0,101,141,0.06)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 150ms',
                  }}
                >
                  <span className="material-symbols-outlined" style={{
                    fontSize: '20px',
                    fontVariationSettings: isActive(cat.slug) ? "'FILL' 1" : "'FILL' 0",
                  }}>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Brand Filter */}
            <div>
              <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '14px', color: '#181c1e', marginBottom: '12px' }}>
                Thương hiệu
              </h4>
              {brandList.map(brand => (
                <label key={brand._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#3e4850', padding: '4px 0', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand._id)}
                    onChange={() => toggleBrand(brand._id)}
                    style={{ width: '16px', height: '16px', accentColor: '#00658d' }}
                  />
                  {brand.name}
                </label>
              ))}
            </div>
          </aside>

          {/* ═══ PRODUCT GRID ═══ */}
          <main style={{ flex: 1 }}>
            {filteredProducts.length > 0 ? (
              (() => {
                const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
                const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                      {currentProducts.map(product => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      addToCart={addToCart}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                      showAddToCartButton
                      user={user}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '32px' }}>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e0e3e5', background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentPage === 1 ? '#e0e3e5' : '#8a949d' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
                      if (n === 1 || n === totalPages || (n >= currentPage - 1 && n <= currentPage + 1)) {
                        return (
                          <button 
                            key={n} 
                            onClick={() => setCurrentPage(n)}
                            style={{
                              width: '36px', height: '36px', borderRadius: '50%',
                              border: n === currentPage ? 'none' : '1px solid #e0e3e5',
                              background: n === currentPage ? '#00658d' : '#fff',
                              color: n === currentPage ? '#fff' : '#3e4850',
                              cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                            }}>
                            {n}
                          </button>
                        );
                      }
                      if (n === currentPage - 2 || n === currentPage + 2) {
                        return <span key={n} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a949d' }}>...</span>;
                      }
                      return null;
                    })}

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e0e3e5', background: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentPage === totalPages ? '#e0e3e5' : '#8a949d' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            );
          })()
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#8a949d', opacity: 0.3, marginBottom: '8px', display: 'block' }}>inventory_2</span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#3e4850', marginBottom: '4px' }}>Không tìm thấy sản phẩm</p>
                <p style={{ fontSize: '13px', color: '#8a949d', marginBottom: '16px' }}>
                  {selectedBrands.length > 0
                    ? 'Thử bỏ bớt bộ lọc để xem thêm sản phẩm.'
                    : 'Danh mục này đang được cập nhật.'}
                </p>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => { 
                      setSelectedBrands([]); 
                    }}
                    style={{ fontSize: '13px', fontWeight: 600, color: '#00658d', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Xoá tất cả bộ lọc
                  </button>
                )}
                <Link to="/" style={{ fontSize: '13px', fontWeight: 600, color: '#00658d', textDecoration: 'none', display: 'block', marginTop: '8px' }}>Quay lại trang chủ</Link>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
