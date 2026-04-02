import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Link, useNavigate } from 'react-router';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { CartItem } from '../App';

interface CheckoutProps {
  cart: CartItem[];
  user: any;
  token: string;
  cartCount: number;
  clearCart: () => void;
}

interface Address {
  _id?: string;
  id?: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

const getAddressId = (addr: Address) => addr._id || addr.id || '';

const pid = (item: CartItem) => item._id || item.id || '';

export default function Checkout({ cart, user, token, cartCount, clearCart }: CheckoutProps) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  const [savedPayments, setSavedPayments] = useState<any[]>([]);

  // Fetch saved addresses from server
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/customer/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.addresses) {
          setAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a: Address) => a.isDefault);
          if (defaultAddr) setSelectedAddressId(getAddressId(defaultAddr));
          else if (data.addresses.length > 0) setSelectedAddressId(getAddressId(data.addresses[0]));
        }
      })
      .catch(console.error);

      // Fetch saved payment methods
      fetch(`${API_URL}/api/customer/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.payments) {
          setSavedPayments(data.payments);
          const defaultPayment = data.payments.find((p: any) => p.isDefault);
          if (defaultPayment) setPaymentMethod(`saved-${defaultPayment._id || defaultPayment.id}`);
          else if (data.payments.length > 0) setPaymentMethod(`saved-${data.payments[0]._id || data.payments[0].id}`);
        }
      })
      .catch(console.error);
    }
  }, [token]);

  // New address form
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Guard against empty cart
  if (!cart || cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
        <Header cartCount={0} user={user} />
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#8a949d', opacity: 0.3, display: 'block', marginBottom: '8px' }}>shopping_cart</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '22px', color: '#181c1e', marginBottom: '8px' }}>Giỏ hàng trống</h2>
          <p style={{ fontSize: '14px', color: '#8a949d', marginBottom: '20px' }}>Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.</p>
          <Link to="/" style={{ padding: '12px 24px', borderRadius: '10px', background: '#00658d', color: '#fff', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
            Tiếp tục mua sắm
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const userPoints = user?.points || 0;
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const getDiscount = (points: number, sub: number) => {
    if (points >= 100000) return { amount: Math.floor(sub * -0.08), rate: 8 };
    if (points >= 30000) return { amount: Math.floor(sub * -0.05), rate: 5 };
    if (points >= 10000) return { amount: Math.floor(sub * -0.02), rate: 2 };
    return { amount: 0, rate: 0 };
  };
  const { amount: discount, rate: discountRate } = getDiscount(userPoints, subtotal);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping + discount;

  const selectedAddress = addresses.find(a => getAddressId(a) === selectedAddressId);

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city) return;
    
    try {
      const isDefault = addresses.length === 0; // First address becomes default automatically
      
      const res = await fetch(`${API_URL}/api/customer/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newAddress, isDefault, label: 'Nhà riêng' }),
      });
      const data = await res.json();
      
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
        // Select the newly added address which should be the last one
        const newestAddr = data.addresses[data.addresses.length - 1];
        if (newestAddr) setSelectedAddressId(getAddressId(newestAddr));
        
        setNewAddress({ fullName: '', phone: '', address: '', city: '', postalCode: '' });
        setShowAddressModal(false);
      } else {
        alert(data.message || 'Không thể lưu địa chỉ');
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setIsSubmitting(true);
    setOrderError('');

    try {
      const paymentMethodMap: Record<string, string> = {
        'credit-card': 'Thẻ tín dụng / Ghi nợ',
        'bank-transfer': 'Chuyển khoản ngân hàng',
        'e-wallet': 'Ví điện tử',
        'cod': 'Thanh toán khi nhận hàng',
      };
      
      let actualPaymentMethod = paymentMethodMap[paymentMethod] || paymentMethod;
      if (paymentMethod.startsWith('saved-')) {
        actualPaymentMethod = 'Thanh toán qua Thẻ đã lưu';
      }

      const orderData = {
        items: cart.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: `${selectedAddress.fullName}, ${selectedAddress.phone}, ${selectedAddress.address}, ${selectedAddress.city}${selectedAddress.postalCode ? `, ${selectedAddress.postalCode}` : ''}`,
        paymentMethod: actualPaymentMethod,
        note: '',
      };

      const res = await fetch(`${API_URL}/api/customer/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        navigate('/order-confirmation');
      } else {
        setOrderError(data.message || 'Đặt hàng thất bại');
      }
    } catch {
      setOrderError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />
      <style>{`
        .checkout-main-container { display: flex; flex-direction: column; gap: 32px; align-items: flex-start; }
        .checkout-sidebar { width: 100%; flex-shrink: 0; margin-top: 32px; }
        @media (min-width: 1024px) {
          .checkout-main-container { flex-direction: row; gap: 32px; }
          .checkout-sidebar { width: 380px; position: sticky; top: 88px; margin-top: 0; }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        {/* Back link */}
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6e7881', textDecoration: 'none', marginBottom: '24px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Quay lại giỏ hàng
        </Link>

        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 800, color: '#181c1e', marginBottom: '32px' }}>
          Thanh toán
        </h1>

        <div className="checkout-main-container">
          {/* ═══ LEFT: Checkout Form ═══ */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Email */}
            <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e8ecef' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#6e7881' }}>person</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#181c1e' }}>{user?.email || 'demo@hobbyshop.vn'}</span>
              </div>
            </div>

            {/* ═══ ADDRESS SECTION ═══ */}
            <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e8ecef' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#181c1e' }}>Địa chỉ giao hàng</h2>
              </div>

              {/* Address List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {addresses.map(addr => (
                  <label
                    key={getAddressId(addr)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      padding: '16px', borderRadius: '12px', cursor: 'pointer',
                      border: selectedAddressId === getAddressId(addr) ? '2px solid #00658d' : '1.5px solid #e0e3e5',
                      background: selectedAddressId === getAddressId(addr) ? 'rgba(0,101,141,0.03)' : '#fff',
                      transition: 'all 150ms',
                    }}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === getAddressId(addr)}
                      onChange={() => setSelectedAddressId(getAddressId(addr))}
                      style={{ marginTop: '2px', accentColor: '#00658d' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#181c1e' }}>{addr.fullName}</span>
                        {addr.isDefault && (
                          <span style={{
                            padding: '2px 8px', borderRadius: '4px', background: '#00658d',
                            color: '#fff', fontSize: '10px', fontWeight: 700,
                          }}>Mặc định</span>
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: '#6e7881', marginBottom: '2px' }}>{addr.phone}</p>
                      <p style={{ fontSize: '13px', color: '#6e7881' }}>{addr.address}, {addr.city}{addr.postalCode ? `, ${addr.postalCode}` : ''}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Add Address Button */}
              <button
                onClick={() => setShowAddressModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#00658d', fontSize: '13px', fontWeight: 600, padding: '8px 0',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Thêm địa chỉ mới
              </button>
            </div>

            {/* ═══ PAYMENT SECTION ═══ */}
            <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e8ecef' }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#181c1e', marginBottom: '4px' }}>Thanh toán</h2>
              <p style={{ fontSize: '12px', color: '#8a949d', marginBottom: '20px' }}>Tất cả giao dịch đều được bảo mật và mã hóa.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* User's Saved Cards */}
                {savedPayments.map(pay => (
                  <label
                    key={`saved-${pay._id || pay.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                      border: paymentMethod === `saved-${pay._id || pay.id}` ? '2px solid #00658d' : '1.5px solid #e0e3e5',
                      background: paymentMethod === `saved-${pay._id || pay.id}` ? 'rgba(0,101,141,0.03)' : '#fff',
                      transition: 'all 150ms',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === `saved-${pay._id || pay.id}`}
                      onChange={() => setPaymentMethod(`saved-${pay._id || pay.id}`)}
                      style={{ accentColor: '#00658d' }}
                    />
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#00658d' }}>credit_card</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#181c1e' }}>{pay.provider}</p>
                        <span style={{ fontSize: '12px', color: '#6e7881', fontFamily: 'monospace' }}>{pay.cardNumber}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#8a949d' }}>{pay.nameOnCard}</p>
                    </div>
                  </label>
                ))}

                {/* Separator if saved cards exist */}
                {savedPayments.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e8ecef' }} />
                    <span style={{ fontSize: '11px', color: '#8a949d', margin: '0 8px' }}>hoặc các phương thức khác</span>
                    <div style={{ flex: 1, height: '1px', background: '#e8ecef' }} />
                  </div>
                )}
                
                {/* Fallback Static Options */}
                {[
                  { id: 'credit-card', label: 'Thẻ mới / Ghi nợ', desc: 'Visa, Mastercard, JCB', icon: 'add_card' },
                  { id: 'bank-transfer', label: 'Chuyển khoản ngân hàng', desc: 'Thanh toán trực tiếp', icon: 'account_balance' },
                  { id: 'e-wallet', label: 'Ví điện tử', desc: 'Momo, ZaloPay, VNPay', icon: 'account_balance_wallet' },
                  { id: 'cod', label: 'Thanh toán khi nhận hàng', desc: 'COD', icon: 'local_shipping' },
                ].map(method => (
                  <label
                    key={method.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                      border: paymentMethod === method.id ? '2px solid #00658d' : '1.5px solid #e0e3e5',
                      background: paymentMethod === method.id ? 'rgba(0,101,141,0.03)' : '#fff',
                      transition: 'all 150ms',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      style={{ accentColor: '#00658d' }}
                    />
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#6e7881' }}>{method.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#181c1e' }}>{method.label}</p>
                      <p style={{ fontSize: '11px', color: '#8a949d' }}>{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Place Order Button (mobile) */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || !selectedAddress}
              style={{
                width: '100%', padding: '16px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #00658d, #00adef)',
                color: '#fff', fontWeight: 700, fontSize: '15px',
                border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
                display: 'none',
              }}
              className="lg:hidden"
            >
              {isSubmitting ? 'Đang xử lý...' : `Đặt hàng · ${total.toLocaleString()}đ`}
            </button>
            {orderError && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>{orderError}</p>}
          </div>

          {/* ═══ RIGHT: Order Summary ═══ */}
          <aside className="checkout-sidebar">
            <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e8ecef', overflow: 'hidden' }}>
              {/* Cart Items */}
              <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item, i) => (
                  <div key={pid(item)} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', background: '#f1f4f6' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      {(item.quantity || 1) > 1 && (
                        <span style={{
                          position: 'absolute', top: '-6px', right: '-6px',
                          minWidth: '18px', height: '18px', borderRadius: '9px',
                          background: '#00658d', color: '#fff', fontSize: '10px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                        }}>{item.quantity}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '13px', fontWeight: 600, color: '#181c1e', lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>{item.name}</p>
                      <p style={{ fontSize: '11px', color: '#8a949d' }}>{item.manufacturer || ''}</p>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#181c1e', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {((item.price || 0) * (item.quantity || 1)).toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ padding: '20px', borderTop: '1px solid #e8ecef', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#6e7881' }}>Tạm tính · {cart.reduce((s, i) => s + (i.quantity || 1), 0)} sản phẩm</span>
                  <span style={{ fontWeight: 600, color: '#181c1e' }}>{subtotal.toLocaleString()}đ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#6e7881' }}>Phí vận chuyển</span>
                  <span style={{ fontWeight: 600, color: shipping === 0 ? '#16a34a' : '#181c1e' }}>
                    {shipping === 0 ? 'MIỄN PHÍ' : `${shipping.toLocaleString()}đ`}
                  </span>
                </div>
                {discount < 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#6e7881' }}>Ưu đãi thành viên ({discountRate}%)</span>
                    <span style={{ fontWeight: 600, color: '#00658d' }}>{discount.toLocaleString()}đ</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{ padding: '20px', borderTop: '1px solid #e8ecef' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 800, color: '#181c1e' }}>Tổng cộng</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 800, color: '#00658d' }}>{total.toLocaleString()}đ</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !selectedAddress}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #00658d, #00adef)',
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                    border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                  {!isSubmitting && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
                </button>
                {orderError && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginTop: '8px' }}>{orderError}</p>}

                {/* Trust */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#16a34a' }}>lock</span>
                  <span style={{ fontSize: '11px', color: '#8a949d' }}>Giao dịch được bảo mật SSL</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      {/* ═══ ADD ADDRESS MODAL ═══ */}
      {showAddressModal && (
        <>
          <div
            onClick={() => setShowAddressModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[480px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] font-['Inter']" style={{ zIndex: 101 }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid #e8ecef',
            }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#181c1e' }}>Thêm địa chỉ</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#8a949d' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Họ và tên *</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none',
                      transition: 'border-color 150ms',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#00658d')}
                    onBlur={e => (e.target.style.borderColor = '#e0e3e5')}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Số điện thoại *</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))}
                    placeholder="0901234567"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none',
                      transition: 'border-color 150ms',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#00658d')}
                    onBlur={e => (e.target.style.borderColor = '#e0e3e5')}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Địa chỉ *</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))}
                  placeholder="Số nhà, tên đường, phường/xã"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                    border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none',
                    transition: 'border-color 150ms',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#00658d')}
                  onBlur={e => (e.target.style.borderColor = '#e0e3e5')}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Thành phố *</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))}
                    placeholder="Hà Nội, TP.HCM..."
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none',
                      transition: 'border-color 150ms',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#00658d')}
                    onBlur={e => (e.target.style.borderColor = '#e0e3e5')}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Mã bưu điện</label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={e => setNewAddress(p => ({ ...p, postalCode: e.target.value }))}
                    placeholder="100000"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none',
                      transition: 'border-color 150ms',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#00658d')}
                    onBlur={e => (e.target.style.borderColor = '#e0e3e5')}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: '12px',
              padding: '16px 24px', borderTop: '1px solid #e8ecef',
            }}>
              <button
                onClick={() => setShowAddressModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '10px',
                  border: '1.5px solid #e0e3e5', background: '#fff',
                  color: '#3e4850', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleAddAddress}
                style={{
                  padding: '10px 20px', borderRadius: '10px',
                  background: '#00658d', border: 'none',
                  color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                }}
              >
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
