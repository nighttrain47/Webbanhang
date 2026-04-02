import { Link } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Product } from '../App';

interface CartPageProps {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  cartCount: number;
  user?: any;
}

const pid = (p: Product) => p._id || p.id || '';

function getTag(product: Product): string | null {
  if (product.preorderDeadline) return 'PRE-ORDER';
  if (product.scale) return product.scale;
  const name = product.name?.toLowerCase() || '';
  if (name.includes('nendoroid')) return 'NENDOROID';
  if (name.includes('1/7')) return 'SCALE 1/7';
  if (name.includes('1/8')) return 'SCALE 1/8';
  if (name.includes('1/4')) return 'SCALE 1/4';
  return null;
}

export default function CartPage({ cart, addToCart, removeFromCart, updateCartQuantity, cartCount, user }: CartPageProps) {
  const userPoints = user?.points || 0;
  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const getDiscount = (points: number, sub: number) => {
    if (points >= 100000) return { amount: Math.floor(sub * -0.08), rate: 8 };
    if (points >= 30000) return { amount: Math.floor(sub * -0.05), rate: 5 };
    if (points >= 10000) return { amount: Math.floor(sub * -0.02), rate: 2 };
    return { amount: 0, rate: 0 };
  };
  const { amount: discount, rate: discountRate } = getDiscount(userPoints, subtotal);
  const total = subtotal + discount;

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 800, color: '#181c1e', marginBottom: '4px' }}>
          Giỏ hàng của bạn
        </h1>
        <p style={{ fontSize: '13px', color: '#6e7881', marginBottom: '32px' }}>
          Bạn có <span style={{ fontWeight: 700, color: '#00658d' }}>{cart.length} sản phẩm</span> được giám tuyển trong danh sách.
        </p>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* ═══ CART ITEMS ═══ */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.length > 0 ? cart.map(item => {
              const tag = getTag(item);
              return (
                <div key={pid(item)} style={{
                  display: 'flex', gap: '20px', padding: '24px',
                  borderRadius: '16px', background: '#fff',
                  border: '1px solid #e8ecef',
                }}>
                  {/* Image */}
                  <Link to={`/product/${pid(item)}`} style={{ flexShrink: 0, position: 'relative' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', background: '#f1f4f6' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {tag && (
                      <span style={{
                        position: 'absolute', top: '6px', left: '6px',
                        padding: '3px 8px', borderRadius: '5px',
                        background: tag === 'PRE-ORDER' ? '#e74c3c' : 'rgba(24,28,30,0.85)',
                        color: '#fff', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                      }}>{tag}</span>
                    )}
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', fontWeight: 700, color: '#181c1e', marginBottom: '4px' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a949d', marginBottom: '12px' }}>
                      {item.manufacturer || 'HOBBYSHOP'} • {item.material || 'ABS & PVC'}
                    </p>

                    {/* Quantity + Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e3e5' }}>
                        <button onClick={() => updateCartQuantity(pid(item), (item.quantity || 1) - 1)} style={{ width: '34px', height: '34px', border: 'none', background: '#f7fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3e4850' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
                        </button>
                        <span style={{ width: '38px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#181c1e' }}>{item.quantity || 1}</span>
                        <button onClick={() => updateCartQuantity(pid(item), (item.quantity || 1) + 1)} style={{ width: '34px', height: '34px', border: 'none', background: '#f7fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3e4850' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(pid(item))} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                        Gỡ bỏ
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#00658d', flexShrink: 0 }}>
                    {((item.price || 0) * (item.quantity || 1)).toLocaleString()}đ
                  </span>
                </div>
              );
            }) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e8ecef' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#8a949d', opacity: 0.3, marginBottom: '8px', display: 'block' }}>shopping_cart</span>
                <p style={{ fontWeight: 600, color: '#3e4850', marginBottom: '4px' }}>Giỏ hàng trống</p>
                <p style={{ fontSize: '13px', color: '#8a949d', marginBottom: '16px' }}>Khám phá sản phẩm để thêm vào giỏ hàng.</p>
                <Link to="/" style={{ fontSize: '13px', fontWeight: 600, color: '#00658d', textDecoration: 'none' }}>Khám phá ngay</Link>
              </div>
            )}

            {/* Continue shopping */}
            {cart.length > 0 && (
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#3e4850', textDecoration: 'none', marginTop: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                Tiếp tục mua sắm
              </Link>
            )}
          </div>

          {/* ═══ ORDER SUMMARY ═══ */}
          {cart.length > 0 && (
            <aside style={{ width: '340px', flexShrink: 0, position: 'sticky', top: '88px' }}>
              <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e8ecef', padding: '28px' }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 800, color: '#181c1e', marginBottom: '24px' }}>Tổng cộng</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6e7881' }}>Tạm tính</span>
                    <span style={{ fontWeight: 600, color: '#181c1e' }}>{subtotal.toLocaleString()}đ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6e7881' }}>Phí vận chuyển</span>
                    <span style={{ fontWeight: 500, color: '#8a949d' }}>Tính khi thanh toán</span>
                  </div>
                  {discount < 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#6e7881' }}>Ưu đãi thành viên ({discountRate}%)</span>
                      <span style={{ fontWeight: 600, color: '#00658d' }}>{discount.toLocaleString()}đ</span>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #e8ecef', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 800, color: '#181c1e' }}>Tổng đơn hàng</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 800, color: '#00658d' }}>{total.toLocaleString()}đ</span>
                  </div>
                  <p style={{ textAlign: 'right', fontSize: '11px', color: '#8a949d', textTransform: 'uppercase' }}>ĐÃ BAO GỒM VAT</p>
                </div>

                <Link to="/checkout" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #00658d, #00adef)',
                  color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                }}>
                  Thanh Toán Ngay
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                </Link>

                {/* Trust Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '16px', padding: '14px', borderRadius: '10px', background: '#f7fafc' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#00658d', fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#181c1e', marginBottom: '2px' }}>ĐẢM BẢO AN TOÀN</p>
                    <p style={{ fontSize: '11px', color: '#8a949d', lineHeight: 1.5 }}>FigureCurator cam kết 100% hàng chính hãng. Toàn bộ giao dịch được mã hóa đầu cuối.</p>
                  </div>
                </div>

                {/* Payment Icons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                  {['credit_card', 'account_balance', 'qr_code_2'].map(icon => (
                    <span key={icon} className="material-symbols-outlined" style={{ fontSize: '22px', color: '#8a949d' }}>{icon}</span>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
