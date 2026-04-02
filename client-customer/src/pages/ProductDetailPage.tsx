import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { useParams, Link, useNavigate } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../App';

interface ProductDetailPageProps {
  addToCart: (product: Product) => void;
  addToCartSilent: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  user?: any;
}

export default function ProductDetailPage({ addToCart, addToCartSilent, wishlist, toggleWishlist, cartCount, user }: ProductDetailPageProps) {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('detail');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!productId) return;
    setActiveImage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch(`${API_URL}/api/customer/products/${productId}`)
      .then(r => r.json()).then(data => { setProduct(data); document.title = `${data.name} | FigureCurator`; }).catch(console.error);
    fetch(`${API_URL}/api/customer/products/hot?limit=4`)
      .then(r => r.json()).then(setRelatedProducts).catch(console.error);
  }, [productId]);

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
      <Header cartCount={cartCount} user={user} />
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#8a949d', opacity: 0.3, display: 'block', marginBottom: '8px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
        <p style={{ color: '#8a949d' }}>Đang tải...</p>
      </div>
    </div>
  );

  const images = product.images?.length ? product.images : [product.image];
  const isPreorder = !!product.preorderDeadline;
  const isInWishlist = wishlist.includes(product._id || product.id || '');

  const scaleBadge = (() => {
    if (product.scale) return product.scale;
    const name = product.name?.toLowerCase() || '';
    if (name.includes('1/7')) return 'SCALE 1/7';
    if (name.includes('1/8')) return 'SCALE 1/8';
    if (name.includes('1/4')) return 'SCALE 1/4';
    if (name.includes('nendoroid')) return 'NENDOROID';
    return null;
  })();

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />
      <style>{`
        .product-main-container { display: flex; flex-direction: column; gap: 32px; margin-bottom: 48px; }
        .product-image-container { width: 100%; flex-shrink: 0; }
        @media (min-width: 1024px) {
          .product-main-container { flex-direction: row; gap: 40px; }
          .product-image-container { width: 480px; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a949d', marginBottom: '24px' }}>
          <Link to="/" style={{ color: '#8a949d', textDecoration: 'none' }}>Trang chủ</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <Link to="/category/all" style={{ color: '#8a949d', textDecoration: 'none' }}>Sản phẩm</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#3e4850', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
        </div>

        {/* Product Main */}
        <div className="product-main-container">
          {/* ═══ IMAGE GALLERY ═══ */}
          <div className="product-image-container">
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#f1f4f6', marginBottom: '12px' }}>
              <img src={images[activeImage]} alt={product.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
              {/* Badges */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {isPreorder && <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#e74c3c', color: '#fff', fontSize: '10px', fontWeight: 700 }}>PRE-ORDER</span>}
                {scaleBadge && <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(24,28,30,0.85)', color: '#fff', fontSize: '10px', fontWeight: 700 }}>{scaleBadge}</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImage(i)} style={{
                    aspectRatio: '1', borderRadius: '10px', overflow: 'hidden',
                    border: activeImage === i ? '2px solid #00658d' : '2px solid transparent',
                    cursor: 'pointer', background: '#f1f4f6', padding: 0,
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══ PRODUCT INFO ═══ */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a949d', marginBottom: '8px' }}>
              {product.manufacturer || product.series || 'HOBBYSHOP'}
            </p>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: '#181c1e', lineHeight: 1.25, marginBottom: '12px' }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: '#00658d' }}>
                {product.price?.toLocaleString()}đ
              </span>
              {product.originalPrice !== undefined && product.originalPrice > product.price && (
                <span style={{ fontSize: '15px', color: '#8a949d', textDecoration: 'line-through' }}>
                  {product.originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>

            {/* Pre-order notice */}
            {isPreorder && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', border: '1px solid #e0e3e5',
                display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#00658d' }}>info</span>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#181c1e' }}>Trạng thái: Pre-order</p>
                  {product.preorderDeadline && (
                    <p style={{ fontSize: '12px', color: '#6e7881' }}>Thời hạn đặt trước: {product.preorderDeadline}</p>
                  )}
                  {product.estimatedDelivery && (
                    <p style={{ fontSize: '12px', color: '#6e7881' }}>Thời gian giao hàng dự kiến: {product.estimatedDelivery}</p>
                  )}
                  {!product.preorderDeadline && !product.estimatedDelivery && (
                    <p style={{ fontSize: '12px', color: '#6e7881' }}>Đặt trước ngay để nhận ưu đãi giới hạn.</p>
                  )}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <button
              onClick={() => { addToCartSilent(product); navigate('/checkout'); }}
              style={{
                width: '100%', padding: '16px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #00658d, #00adef)',
                color: '#fff', fontWeight: 700, fontSize: '15px',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '10px',
              }}
            >
              Đặt hàng ngay
            </button>

            <button
              onClick={() => addToCart(product)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: '1.5px solid #e0e3e5', background: '#fff',
                color: '#3e4850', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              Thêm vào giỏ hàng
            </button>

            {/* Trust badges */}
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { icon: 'verified_user', text: 'Chính hãng 100%', label: 'CAM KẾT' },
                { icon: 'local_shipping', text: 'Miễn phí toàn quốc', label: 'VẬN CHUYỂN' },
              ].map(b => (
                <div key={b.text} style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '10px', border: '1px solid #e8ecef',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#00658d' }}>{b.icon}</span>
                  <div>
                    <p style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a949d' }}>{b.label}</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#181c1e' }}>{b.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Specs table */}
            <div style={{ marginTop: '24px', padding: '20px', borderRadius: '12px', background: '#fff', border: '1px solid #e8ecef' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#181c1e', marginBottom: '12px' }}>Thông số kỹ thuật</h3>
              <table style={{ width: '100%', fontSize: '13px' }}>
                <tbody>
                  {[
                    ['Dòng sản phẩm', product.series || 'N/A'],
                    ['Thương hiệu', (product.brand as any)?.name || 'N/A'],
                    ['Danh mục', (product.category as any)?.name || 'N/A'],
                    ['Nhà sản xuất', product.manufacturer || 'N/A'],
                    ['Tỷ lệ', product.scale || 'N/A'],
                    ['Kích thước', product.dimensions || 'N/A'],
                    ['Chất liệu', product.material || 'N/A'],
                  ].filter(([, value]) => value && value !== 'N/A').map(([label, value]) => (
                    <tr key={label as string} style={{ borderBottom: '1px solid #f1f4f6' }}>
                      <td style={{ padding: '8px 0', color: '#6e7881' }}>{label}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: '#181c1e' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ═══ PRODUCT DESCRIPTION ═══ */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#181c1e', marginBottom: '16px' }}>Chi tiết sản phẩm</h3>
          <div style={{ fontSize: '14px', color: '#3e4850', lineHeight: 1.8, maxWidth: '700px', whiteSpace: 'pre-wrap' }}>
            {product.description || 'Mô tả sản phẩm đang được cập nhật.'}
          </div>
        </div>

        {/* ═══ RELATED PRODUCTS ═══ */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a949d' }}>GỢI Ý DÀNH CHO BẠN</p>
            <Link to="/category/all" style={{ fontSize: '13px', fontWeight: 600, color: '#00658d', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Xem tất cả <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </Link>
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '22px', color: '#181c1e', marginBottom: '20px' }}>Sản phẩm liên quan</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p._id || p.id} product={p} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} user={user} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}
