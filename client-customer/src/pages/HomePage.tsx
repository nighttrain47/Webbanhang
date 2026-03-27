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

export default function HomePage({ addToCart, wishlist, toggleWishlist, cartCount, user }: HomePageProps) {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);

  useEffect(() => {
    document.title = 'FigureCurator — Bộ sưu tập Figure & Anime Goods cao cấp';
    fetch(`${API_URL}/api/customer/products/new?limit=6`).then(r => r.json()).then(setNewProducts).catch(console.error);
    fetch(`${API_URL}/api/customer/products/hot?limit=6`).then(r => r.json()).then(setHotProducts).catch(console.error);
  }, []);

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
            padding: '48px',
            minHeight: '380px',
            display: 'flex',
            alignItems: 'center',
          }}
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

            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', serif",
              fontSize: '42px',
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

            <div style={{ display: 'flex', gap: '12px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a949d', marginBottom: '2px' }}>BỘ LỌC SẢN PHẨM</p>
            <p style={{ fontSize: '11px', color: '#8a949d' }}>Tìm kiếm theo sở thích</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '24px', color: '#181c1e' }}>
              Sản Phẩm Mới
            </h2>
          </div>
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
          <div style={{ flex: 1 }}>
            {newProducts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
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
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '24px', color: '#181c1e', marginBottom: '4px' }}>
          Pre-order Sớm
        </h2>
        <p style={{ fontSize: '13px', color: '#8a949d', marginBottom: '20px' }}>Đừng bỏ lỡ những tuyệt phẩm sắp ra mắt</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Large Pre-order Card */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #1a2332, #243b50)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '320px',
            gridRow: 'span 2',
          }}>
            <span style={{
              display: 'inline-block', width: 'fit-content',
              padding: '4px 10px', borderRadius: '6px', background: '#e74c3c',
              color: '#fff', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              SẮP HẾT HÀNG
            </span>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Figure Exclusive Pre-order
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '16px', lineHeight: 1.6 }}>
              Phát hành dự kiến: Tháng 12/2024. Cọc trước chỉ từ 500.000đ.
            </p>
            <Link to="/category/pre-order" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              width: 'fit-content', padding: '10px 20px', borderRadius: '8px',
              border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff',
              fontWeight: 600, fontSize: '12px', textDecoration: 'none',
            }}>
              Đặt ngay
            </Link>
          </div>

          {/* Flash Sale Card */}
          <div style={{
            borderRadius: '16px', background: '#f1f4f6', padding: '24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ff7d36', marginBottom: '12px' }}>
              FLASH SALE PRE-ORDER
            </span>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '20px', color: '#181c1e', marginBottom: '16px', lineHeight: 1.3 }}>
              Ưu đãi 15% khi thanh toán 100%
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['04', '12', '45'].map((val, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '8px',
                    border: '1px solid #e0e3e5', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '16px', color: '#181c1e',
                  }}>{val}</div>
                  <span style={{ fontSize: '9px', color: '#8a949d', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>
                    {['NGÀY', 'GIỜ', 'PHÚT'][i]}
                  </span>
                </div>
              ))}
            </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
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
              outline: 'none', background: '#fff',
            }}
          />
          <button style={{
            padding: '12px 20px', borderRadius: '10px',
            background: '#00658d', color: '#fff', fontWeight: 600,
            fontSize: '13px', border: 'none', cursor: 'pointer',
          }}>
            Đăng ký
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}