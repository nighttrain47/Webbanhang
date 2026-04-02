import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Link } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../App';

interface HomePageProps {
  addToCart: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  user?: any;
}


const SIDEBAR_CATS = [
  { icon: 'apps', label: 'Tất cả sản phẩm', to: '/category/all' },
  { icon: 'diamond', label: 'Scale Figures', to: '/category/scale-figure' },
  { icon: 'smart_toy', label: 'Nendoroids', to: '/category/figures' },
  { icon: 'album', label: 'CD/DVD/Blu-ray', to: '/category/media' },
  { icon: 'precision_manufacturing', label: 'Gundam-Mecha', to: '/category/plastic-models' },
  { icon: 'styler', label: 'Action Figures', to: '/category/goods' },
  { icon: 'shopping_bag', label: 'Phụ kiện', to: '/category/goods' },
  { icon: 'more_horiz', label: 'Khác', to: '/category/all' },
];

// Smart date parser — handles DD/MM/YYYY, YYYY-MM-DD, ISO, range strings, and Vietnamese long format
// For ranges like "29/03/2026 cho đến 06/04/2026", returns the LATEST date (closing date)
function parseFlexibleDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const candidates: Date[] = [];

  // Extract ALL DD/MM/YYYY dates from the string
  const allDmyMatches = [...dateStr.matchAll(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/g)];
  for (const m of allDmyMatches) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!isNaN(d.getTime())) candidates.push(d);
  }

  // Extract "ngày DD tháng MM năm YYYY" (Vietnamese long format)
  const vnLongMatches = [...dateStr.matchAll(/ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})/gi)];
  for (const m of vnLongMatches) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!isNaN(d.getTime())) candidates.push(d);
  }

  // Return the latest date found (the closing/end date)
  if (candidates.length > 0) {
    return candidates.reduce((latest, d) => d > latest ? d : latest);
  }

  // Try ISO / YYYY-MM-DD
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) return isoDate;

  // "Tháng MM/YYYY" or just "MM/YYYY"
  const monthYearMatch = dateStr.match(/(?:tháng\s*)?(\d{1,2})[/\-.](\d{4})/i);
  if (monthYearMatch) {
    const d = new Date(Number(monthYearMatch[2]), Number(monthYearMatch[1]) - 1, 1);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

// Countdown timer hook
function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    let targetMs: number;

    const parsed = targetDate ? parseFlexibleDate(targetDate) : null;
    if (parsed) {
      targetMs = parsed.getTime();
    } else {
      // Default: 14 days from now for general promotion
      const defaultTarget = new Date();
      defaultTarget.setDate(defaultTarget.getDate() + 14);
      targetMs = defaultTarget.getTime();
    }

    const calc = () => {
      const now = Date.now();
      const diff = targetMs - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      };
    };

    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// Responsive grid style helper
function responsiveGrid(mobileCols: number, desktopCols: number, gap = '20px') {
  return {
    display: 'grid' as const,
    gridTemplateColumns: `repeat(${mobileCols}, 1fr)`,
    gap,
    // CSS override via class will handle desktop
  };
}

export default function HomePage({ addToCart, wishlist, toggleWishlist, cartCount, user }: HomePageProps) {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [preorderProducts, setPreorderProducts] = useState<Product[]>([]);

  useEffect(() => {
    document.title = 'FigureCurator — Bộ sưu tập Figure & Anime Goods cao cấp';
    fetch(`${API_URL}/api/customer/products/new?limit=6`).then(r => r.json()).then(setNewProducts).catch(console.error);
    fetch(`${API_URL}/api/customer/products/hot?limit=6`).then(r => r.json()).then(setHotProducts).catch(console.error);
    fetch(`${API_URL}/api/customer/products/preorder?limit=4`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setPreorderProducts(data);
    }).catch(console.error);
  }, []);

  // Featured pre-order product (first one)
  const featuredPreorder = preorderProducts[0] || null;
  const featuredId = featuredPreorder?._id || featuredPreorder?.id || '';

  // Countdown to the featured product's preorder deadline
  const countdown = useCountdown(featuredPreorder?.preorderDeadline || null);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      {/* ═══ HERO SECTION ═══ */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '24px', paddingBottom: '16px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a2332, #1e3044, #243b50)',
            minHeight: '320px',
            display: 'flex',
            alignItems: 'center',
          }}
          className="hero-section"
        >
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '480px' }}>
            <span style={{
              display: 'inline-block',
              padding: '5px 14px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.12)',
              color: '#ff7d36',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '20px',
            }}>
              DIGITAL CURATOR PREMIERE
            </span>

            <h1 className="hero-title" style={{
              fontFamily: "'Plus Jakarta Sans', serif",
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: '16px',
            }}>
              Nghệ thuật<br />trong{' '}
              <span style={{ fontStyle: 'italic', color: '#5bb8d4' }}>Từng Chi Tiết</span>
            </h1>

            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              marginBottom: '28px',
              maxWidth: '380px',
            }}>
              Khám phá bộ sưu tập Figure cao cấp nhất, được tuyển chọn kỹ lưỡng dành cho những nhà sưu tầm tinh hoa.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/category/new-arrivals"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: '#00658d',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'background 150ms',
                }}
              >
                Khám phá ngay
              </Link>
              <Link
                to="/category/all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '13px',
                  textDecoration: 'none',
                  background: 'transparent',
                }}
              >
                Xem bộ sưu tập
              </Link>
            </div>
          </div>

          {/* Decorative gradient orb */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,101,141,0.3), transparent 70%)',
            filter: 'blur(30px)',
          }} />
        </div>
      </section>


      {/* ═══ NEW PRODUCTS SECTION ═══ */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingBottom: '48px' }}>
        {/* Section Header */}
        <div className="section-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div className="hidden lg:block">
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a949d', marginBottom: '2px' }}>BỘ LỌC SẢN PHẨM</p>
            <p style={{ fontSize: '11px', color: '#8a949d' }}>Tìm kiếm theo sở thích</p>
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '24px', color: '#181c1e' }}>
            Sản Phẩm Mới
          </h2>
          <Link to="/category/new-arrivals" style={{ fontSize: '13px', fontWeight: 600, color: '#00658d', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Xem tất cả <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Sidebar */}
          <aside className="hidden lg:block" style={{ width: '160px', flexShrink: 0, paddingTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {SIDEBAR_CATS.map((cat, i) => (
                <Link
                  key={cat.label}
                  to={cat.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: i === 0 ? 600 : 400,
                    color: i === 0 ? '#00658d' : '#3e4850',
                    background: i === 0 ? 'rgba(0,101,141,0.06)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'background 150ms',
                  }}
                >
                  <span className="material-symbols-outlined" style={{
                    fontSize: '20px',
                    fontVariationSettings: i === 0 ? "'FILL' 1" : "'FILL' 0",
                  }}>{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </aside>

          {/* Product Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {newProducts.length > 0 ? (
              <div className="product-grid-3">
                {newProducts.slice(0, 3).map(product => (
                  <ProductCard key={product._id || product.id} product={product} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8a949d' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.3, marginBottom: '8px', display: 'block' }}>inventory_2</span>
                <p>Chưa có sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ PRE-ORDER BENTO SECTION ═══ */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '24px', color: '#181c1e' }}>
            Pre-order Sớm
          </h2>
          <Link to="/category/pre-order" style={{ fontSize: '13px', fontWeight: 600, color: '#00658d', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Xem tất cả <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>
        <p style={{ fontSize: '13px', color: '#8a949d', marginBottom: '20px' }}>
          Đừng bỏ lỡ những tuyệt phẩm sắp ra mắt{preorderProducts.length > 0 ? ` — ${preorderProducts.length} sản phẩm đang mở đặt trước` : ''}
        </p>

        <div className="preorder-bento">
          {/* Large Pre-order Card — Dynamic from API */}
          <Link
            to={featuredPreorder ? `/product/${featuredId}` : '/category/pre-order'}
            className="preorder-featured"
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #1a2332, #243b50)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              minHeight: '280px',
              textDecoration: 'none',
              transition: 'transform 200ms, box-shadow 200ms',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {/* Background image from product */}
            {featuredPreorder?.image && (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${featuredPreorder.image})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: 0.25,
                transition: 'opacity 300ms',
              }} />
            )}
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(26,35,50,0.95) 30%, rgba(26,35,50,0.4) 100%)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Status badge */}
              <span style={{
                display: 'inline-block', width: 'fit-content',
                padding: '4px 10px', borderRadius: '6px',
                background: featuredPreorder?.stock && featuredPreorder.stock <= 5 ? '#e74c3c' : '#ff7d36',
                color: '#fff', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                {!featuredPreorder ? 'PRE-ORDER' : featuredPreorder.stock && featuredPreorder.stock <= 5 ? 'SẮP HẾT HÀNG' : 'ĐANG MỞ ĐẶT TRƯỚC'}
              </span>

              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>
                {featuredPreorder?.name || 'Figure Exclusive Pre-order'}
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', lineHeight: 1.6 }}>
                {featuredPreorder?.estimatedDelivery
                  ? `Phát hành dự kiến: ${featuredPreorder.estimatedDelivery}`
                  : featuredPreorder?.preorderDeadline
                    ? `Hạn đặt: ${new Date(featuredPreorder.preorderDeadline).toLocaleDateString('vi-VN')}`
                    : 'Đặt trước ngay để đảm bảo sở hữu'}
              </p>
              {featuredPreorder && (
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#5bb8d4', marginBottom: '16px' }}>
                  {featuredPreorder.price?.toLocaleString('vi-VN')}đ
                  {featuredPreorder.originalPrice && featuredPreorder.originalPrice > featuredPreorder.price && (
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', marginLeft: '8px', fontWeight: 400 }}>
                      {featuredPreorder.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </p>
              )}

              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                width: 'fit-content', padding: '10px 20px', borderRadius: '8px',
                border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff',
                fontWeight: 600, fontSize: '12px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shopping_cart</span>
                Đặt ngay
              </span>
            </div>
          </Link>

          {/* Flash Sale Countdown Card — Real timer */}
          <div style={{
            borderRadius: '16px', background: '#f1f4f6', padding: '24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff7d36', marginBottom: '12px' }}>
              {countdown.expired ? 'ĐÃ KẾT THÚC' : 'FLASH SALE PRE-ORDER'}
            </span>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: '#181c1e', marginBottom: '16px', lineHeight: 1.3 }}>
              {countdown.expired ? 'Đợt ưu đãi đã kết thúc' : 'Ưu đãi 15% khi thanh toán 100%'}
            </h3>
            {!countdown.expired && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { val: String(countdown.days).padStart(2, '0'), label: 'NGÀY' },
                  { val: String(countdown.hours).padStart(2, '0'), label: 'GIỜ' },
                  { val: String(countdown.minutes).padStart(2, '0'), label: 'PHÚT' },
                  { val: String(countdown.seconds).padStart(2, '0'), label: 'GIÂY' },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      border: '1px solid #e0e3e5', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '18px', color: '#181c1e',
                      background: '#fff',
                      fontVariantNumeric: 'tabular-nums',
                    }}>{item.val}</div>
                    <span style={{ fontSize: '9px', color: '#8a949d', textTransform: 'uppercase', marginTop: '4px', display: 'block', letterSpacing: '0.05em' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {countdown.expired && (
              <Link to="/category/pre-order" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                width: 'fit-content', padding: '10px 20px', borderRadius: '8px',
                background: '#00658d', color: '#fff',
                fontWeight: 600, fontSize: '12px', textDecoration: 'none',
              }}>
                Xem sản phẩm Pre-order
              </Link>
            )}
          </div>

          {/* Member Benefits Card */}
          <div style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00658d, #0088b0)',
            padding: '24px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
              Quyền lợi thành viên
            </h3>
            <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '12px', lineHeight: 1.6 }}>
              Tích lũy điểm thưởng và nhận quà độc quyền cho mỗi đơn hàng Pre-order.
            </p>
            <Link to="/my-account" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
              Tìm hiểu thêm <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
            </Link>
            {/* Star decoration */}
            <span className="material-symbols-outlined" style={{
              position: 'absolute', bottom: '-8px', right: '-4px',
              fontSize: '80px', opacity: 0.15, fontVariationSettings: "'FILL' 1",
            }}>star</span>
          </div>
        </div>

        {/* Pre-order product thumbnails row */}
        {preorderProducts.length > 1 && (
          <div className="preorder-thumbs">
            {preorderProducts.slice(1, 4).map(product => {
              const pid = product._id || product.id || '';
              return (
                <Link
                  key={pid}
                  to={`/product/${pid}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '16px', borderRadius: '12px',
                    background: '#fff', border: '1px solid #e8ecef',
                    textDecoration: 'none', transition: 'border-color 200ms, box-shadow 200ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#00658d'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,101,141,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8ecef'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '10px',
                    overflow: 'hidden', background: '#f1f4f6', flexShrink: 0,
                  }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 6px', borderRadius: '4px',
                      background: '#fff3e8', color: '#ff7d36', fontSize: '9px', fontWeight: 700,
                      textTransform: 'uppercase', marginBottom: '4px',
                    }}>PRE-ORDER</span>
                    <p style={{
                      fontSize: '13px', fontWeight: 600, color: '#181c1e', lineHeight: 1.3,
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      marginBottom: '4px',
                    }}>{product.name}</p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#00658d' }}>
                      {product.price?.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#8a949d' }}>chevron_right</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══ HOT PRODUCTS ═══ */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '24px', color: '#181c1e' }}>
            Sản phẩm HOT
          </h2>
          <Link to="/category/ranking" style={{ fontSize: '13px', fontWeight: 600, color: '#00658d', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Tất cả Ranking <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>
        {hotProducts.length > 0 ? (
          <div className="product-grid-4">
            {hotProducts.slice(0, 4).map(product => (
              <ProductCard key={product._id || product.id} product={product} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8a949d' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.3, marginBottom: '8px', display: 'block' }}>local_fire_department</span>
            <p>Chưa có sản phẩm nào</p>
          </div>
        )}
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ textAlign: 'center', padding: '48px 16px', background: '#eef2f5' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#00658d', marginBottom: '12px' }}>mail</span>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '22px', color: '#181c1e', marginBottom: '8px' }}>
          Không bỏ lỡ bất kỳ sản phẩm nào
        </h2>
        <p style={{ fontSize: '13px', color: '#8a949d', marginBottom: '20px' }}>
          Đăng ký để nhận thông báo pre-order và ưu đãi độc quyền
        </p>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '10px',
              border: '1px solid #e0e3e5', fontSize: '13px',
              outline: 'none', background: '#fff', minWidth: 0,
            }}
          />
          <button style={{
            padding: '12px 20px', borderRadius: '10px',
            background: '#00658d', color: '#fff', fontWeight: 600,
            fontSize: '13px', border: 'none', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            Đăng ký
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}