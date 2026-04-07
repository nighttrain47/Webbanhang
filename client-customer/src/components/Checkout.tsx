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
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  const [shippingMethodId, setShippingMethodId] = useState('giao-thuong');
  const [shippingFee, setShippingFee] = useState(21000);
  
  const [savedPayments, setSavedPayments] = useState<any[]>([]);
  
  // Guard against empty cart early
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

  // Pre-order checking logic
  const isPreorderInCart = cart.some(item => item.status === 'pre-order' || item.isPreorder);
  const [paymentMethod, setPaymentMethod] = useState(isPreorderInCart ? 'vietqr' : 'cod');

  // Load user data
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

      fetch(`${API_URL}/api/customer/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.payments) {
            setSavedPayments(data.payments);
            // Auto select saved card if needed, but here we provide standard options mainly.
          }
        })
        .catch(console.error);
    }
  }, [token]);

  // Sync shipping fee
  useEffect(() => {
    if (shippingMethodId === 'giao-thuong') setShippingFee(21000);
    else if (shippingMethodId === 'nhan-tai-cua-hang') setShippingFee(0);
    else if (shippingMethodId === 'grab-express') setShippingFee(48000);
    else if (shippingMethodId === 'grab-express-4h') setShippingFee(27000);
  }, [shippingMethodId]);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', address: '', city: '', postalCode: '',
  });

  const userPoints = user?.points || 0;
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const getDiscount = (points: number, sub: number) => {
    if (points >= 100000) return { amount: Math.floor(sub * -0.08), rate: 8 };
    if (points >= 30000) return { amount: Math.floor(sub * -0.05), rate: 5 };
    if (points >= 10000) return { amount: Math.floor(sub * -0.02), rate: 2 };
    return { amount: 0, rate: 0 };
  };
  const { amount: discount, rate: discountRate } = getDiscount(userPoints, subtotal);
  const total = subtotal + shippingFee + discount;

  // Check for expired pre-orders
  const expiredItems = cart.filter(item => {
    if ((item.status === 'pre-order' || item.isPreorder) && item.preorderDeadline) {
      const deadline = new Date(item.preorderDeadline);
      if (!isNaN(deadline.getTime())) {
        deadline.setHours(23, 59, 59, 999);
        return new Date() > deadline;
      }
    }
    return false;
  });
  const expiredMessage = expiredItems.length > 0 
    ? `Không thể đặt hàng vì có sản phẩm đã hết hạn đặt trước: ${expiredItems.map(i => i.name).join(', ')}`
    : '';

  const selectedAddress = addresses.find(a => getAddressId(a) === selectedAddressId);
  const nextDisabled = !selectedAddress || expiredItems.length > 0;
  const checkoutDisabled = isSubmitting || nextDisabled;

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city) return;
    try {
      const isDefault = addresses.length === 0;
      const res = await fetch(`${API_URL}/api/customer/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newAddress, isDefault, label: 'Nhà riêng' }),
      });
      const data = await res.json();
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
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
        'vietqr': 'Chuyển khoản (VietQR)',
        'momo': 'Thanh toán MoMo',
        'cod': 'Thanh toán khi nhận hàng',
      };
      
      let actualPaymentMethod = paymentMethodMap[paymentMethod] || paymentMethod;
      if (paymentMethod.startsWith('saved-')) {
        actualPaymentMethod = 'Thanh toán qua Thẻ đã lưu';
      }

      const shippingMap: Record<string, string> = {
        'giao-thuong': 'Giao tận nơi - Giao thường',
        'nhan-tai-cua-hang': 'Tự nhận hàng tại cửa hàng',
        'grab-express': 'GrabExpress',
        'grab-express-4h': 'GrabExpress 4h',
      };
      const actualShippingMethod = shippingMap[shippingMethodId] || 'Giao tận nơi';

      const orderData = {
        items: cart.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: `${selectedAddress.fullName}, ${selectedAddress.phone}, ${selectedAddress.address}, ${selectedAddress.city}${selectedAddress.postalCode ? `, ${selectedAddress.postalCode}` : ''}`,
        paymentMethod: actualPaymentMethod,
        shippingFee: shippingFee,
        shippingMethod: actualShippingMethod,
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

  // Static options
  const shippingOptions = [
    { id: 'giao-thuong', label: 'Giao tận nơi - Giao thường', price: 21000 },
    { id: 'nhan-tai-cua-hang', label: 'Tự nhận hàng tại cửa hàng', price: 0 },
    { id: 'grab-express', label: 'GrabExpress', price: 48000 },
    { id: 'grab-express-4h', label: 'GrabExpress 4h', price: 27000 }
  ];

  const paymentOptions = [
    { id: 'momo', label: 'Thanh toán MoMo', icon: 'account_balance_wallet', disabled: false },
    { id: 'vietqr', label: 'Thanh toán chuyển khoản (VietQR)', icon: 'account_balance', disabled: false },
    { id: 'cod', label: 'Thanh toán khi giao hàng (COD)', icon: 'local_shipping', disabled: isPreorderInCart, disabledMessage: '[KHÔNG ÁP DỤNG CHO CỌC PRE-ORDER]' },
    { id: 'credit-card', label: 'Thẻ tín dụng / Thẻ ghi nợ', icon: 'credit_card', disabled: false }
  ];

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
        .radio-box { display: flex; align-items: center; gap: 12px; padding: 16px; border: 1.5px solid #e8ecef; background: #fff; cursor: pointer; transition: all 150ms; }
        .radio-box.active { border-color: #00658d; background: rgba(0,101,141,0.03); }
        .radio-box:first-child { border-radius: 12px 12px 0 0; }
        .radio-box:last-child { border-radius: 0 0 12px 12px; }
        .radio-box:not(:last-child) { border-bottom: none; border-bottom-width: 0px; }
        .radio-box.disabled { opacity: 0.5; cursor: not-allowed; background: #f8fafb; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        
        {/* Breadcrumb Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '32px' }}>
          <Link to="/cart" style={{ color: '#00658d', textDecoration: 'none' }}>Giỏ hàng</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#8a949d' }}>chevron_right</span>
          
          {step === 1 ? (
            <span style={{ fontWeight: 700, color: '#181c1e' }}>Thông tin giao hàng</span>
          ) : (
            <span style={{ color: '#00658d', cursor: 'pointer' }} onClick={() => setStep(1)}>Thông tin giao hàng</span>
          )}
          
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#8a949d' }}>chevron_right</span>
          <span style={{ fontWeight: step === 2 ? 700 : 400, color: step === 2 ? '#181c1e' : '#8a949d' }}>Phương thức thanh toán</span>
        </div>

        <div className="checkout-main-container">
          {/* ═══ LEFT CONTENT ═══ */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            
            {step === 1 && (
              <>
                {/* ═══ STEP 1: ADDRESS ═══ */}
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: '#181c1e', marginBottom: '8px' }}>Thông tin giao hàng</h2>
                
                {/* Email / User Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e3e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#8a949d', fontSize: '24px' }}>person</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#6e7881' }}>{user?.name || 'Tài khoản'} ({user?.email || 'demo@hobbyshop.vn'})</p>
                    <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={{ background: 'none', border: 'none', color: '#00658d', fontSize: '13px', cursor: 'pointer', padding: 0 }}>Đăng xuất</button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
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
                        style={{ marginTop: '4px', accentColor: '#00658d' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: '#181c1e' }}>{addr.fullName}</span>
                          {addr.isDefault && (
                            <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#00658d', color: '#fff', fontSize: '10px', fontWeight: 700 }}>Mặc định</span>
                          )}
                        </div>
                        <p style={{ fontSize: '14px', color: '#6e7881', marginBottom: '2px' }}>{addr.phone}</p>
                        <p style={{ fontSize: '14px', color: '#3e4850' }}>{addr.address}, {addr.city}{addr.postalCode ? `, ${addr.postalCode}` : ''}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddressModal(true)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#f8fafb', border: '1.5px dashed #d1d8df', borderRadius: '12px', cursor: 'pointer', color: '#00658d', fontSize: '14px', fontWeight: 600, padding: '16px', transition: 'all 0.2s', marginTop: '8px' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#00658d'; e.currentTarget.style.background = 'rgba(0,101,141,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d8df'; e.currentTarget.style.background = '#f8fafb'; }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                  Thêm địa chỉ mới
                </button>

                {expiredMessage && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px', padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>{expiredMessage}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button
                    onClick={() => { window.scrollTo(0,0); setStep(2); }}
                    disabled={nextDisabled}
                    style={{ padding: '16px 32px', borderRadius: '12px', background: 'linear-gradient(135deg, #00658d, #00adef)', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: nextDisabled ? 'not-allowed' : 'pointer', opacity: nextDisabled ? 0.6 : 1 }}
                  >
                    Tiếp tục tới phương thức thanh toán
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* ═══ STEP 2: SHIPPING & PAYMENT ═══ */}
                
                {/* Shipping Method */}
                <div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#181c1e', marginBottom: '16px' }}>Phương thức vận chuyển</h2>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {shippingOptions.map(method => (
                      <label key={method.id} className={`radio-box ${shippingMethodId === method.id ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethodId === method.id}
                          onChange={() => setShippingMethodId(method.id)}
                          style={{ accentColor: '#00658d' }}
                        />
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: '#181c1e' }}>{method.label}</span>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#181c1e' }}>{method.price > 0 ? `${method.price.toLocaleString()}đ` : '0đ'}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div style={{ marginTop: '24px' }}>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#181c1e', marginBottom: '16px' }}>Phương thức thanh toán</h2>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    
                    {/* User's Saved Cards section */}
                    {savedPayments.length > 0 && savedPayments.map(pay => (
                      <label key={`saved-${pay._id || pay.id}`} className={`radio-box ${paymentMethod === `saved-${pay._id || pay.id}` ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === `saved-${pay._id || pay.id}`}
                          onChange={() => setPaymentMethod(`saved-${pay._id || pay.id}`)}
                          style={{ accentColor: '#00658d' }}
                        />
                        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#00658d' }}>credit_card</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <p style={{ fontSize: '14px', color: '#181c1e' }}>Thanh toán qua Thẻ đã lưu ({pay.provider})</p>
                          </div>
                          <p style={{ fontSize: '12px', color: '#6e7881', marginTop: '2px', fontFamily: 'monospace' }}>{pay.cardNumber}</p>
                        </div>
                      </label>
                    ))}

                    {/* Standard Options */}
                    {paymentOptions.map((method, index) => {
                      const isDisabled = method.disabled;
                      const isLast = index === paymentOptions.length - 1;
                      // Special border logic if card input expands
                      const isActiveCard = paymentMethod === 'credit-card' && method.id === 'credit-card';
                      return (
                        <div key={method.id}>
                          <label
                            className={`radio-box ${paymentMethod === method.id ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                            style={{ 
                              borderRadius: savedPayments.length === 0 && index === 0 ? '12px 12px 0 0' : 
                                            isActiveCard ? '0' :
                                            isLast ? '0 0 12px 12px' : '0',
                              borderBottom: isActiveCard ? 'none' : (isLast ? '1.5px solid #e8ecef' : '0px solid transparent')
                             }}
                          >
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === method.id}
                              onChange={() => { if (!isDisabled) setPaymentMethod(method.id); }}
                              disabled={isDisabled}
                              style={{ accentColor: '#00658d' }}
                            />
                            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: paymentMethod === method.id ? '#00658d' : '#8a949d' }}>{method.icon}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '14px', color: '#181c1e' }}>
                                {method.label} 
                                {isDisabled && method.disabledMessage && <span style={{ color: '#ef4444', marginLeft: '4px', fontSize: '12px' }}>{method.disabledMessage}</span>}
                              </p>
                            </div>
                          </label>

                          {isActiveCard && (
                            <div style={{ padding: '20px', background: 'rgba(0,101,141,0.03)', border: '1.5px solid #00658d', borderTop: 'none', borderRadius: '0 0 12px 12px', marginBottom: isLast ? 0 : '-1.5px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <input type="text" placeholder="Số thẻ (VD: 4123 4567 8901 2345)" style={{ gridColumn: 'span 2', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }} />
                                <input type="text" placeholder="Tên in trên thẻ" style={{ gridColumn: 'span 2', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }} />
                                <input type="text" placeholder="Tháng/Năm (MM/YY)" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }} />
                                <input type="text" placeholder="CVC" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }} />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {orderError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '16px', padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>{orderError}</p>}
                {expiredMessage && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '16px', padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>{expiredMessage}</p>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                  <button
                    onClick={() => { window.scrollTo(0,0); setStep(1); }}
                    style={{ background: 'none', border: 'none', color: '#00658d', fontSize: '14px', cursor: 'pointer', padding: '8px 0', display: 'flex', alignItems: 'center' }}
                  >
                    Quay lại thông tin giao hàng
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={checkoutDisabled}
                    style={{ padding: '16px 36px', borderRadius: '12px', background: 'linear-gradient(135deg, #00658d, #00adef)', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: checkoutDisabled ? 'not-allowed' : 'pointer', opacity: checkoutDisabled ? 0.6 : 1 }}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
                  </button>
                </div>
              </>
            )}

          </div>

          {/* ═══ RIGHT: ORDER SUMMARY ═══ */}
          <aside className="checkout-sidebar">
            <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e8ecef', overflow: 'hidden' }}>
              {/* Cart Items */}
              <div style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '150px', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item) => (
                  <div key={pid(item)} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden', background: '#f1f4f6', border: '1px solid #e8ecef' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      {(item.quantity || 1) > 1 && (
                        <span style={{
                          position: 'absolute', top: '-8px', right: '-8px',
                          minWidth: '22px', height: '22px', borderRadius: '11px',
                          background: 'rgba(113, 113, 113, 0.9)', color: '#fff', fontSize: '11px', fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
                        }}>{item.quantity}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#333', flexShrink: 0 }}>
                      {((item.price || 0) * (item.quantity || 1)).toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ padding: '24px', borderTop: '1px solid #e8ecef', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#717171' }}>Tạm tính</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>{subtotal.toLocaleString()}đ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#717171' }}>Phí vận chuyển</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>
                    {step === 1 ? '-' : `${shippingFee.toLocaleString()}đ`}
                  </span>
                </div>
                {discount < 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#717171' }}>Ưu đãi thành viên ({discountRate}%)</span>
                    <span style={{ color: '#00658d', fontWeight: 500 }}>{discount.toLocaleString()}đ</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{ padding: '24px', borderTop: '1px solid #e8ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', color: '#333' }}>Tổng cộng</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: '#00658d' }}>
                  {step === 1 ? (subtotal + discount).toLocaleString() : total.toLocaleString()}đ
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      {/* ═══ ADD ADDRESS MODAL ═══ */}
      {showAddressModal && (
        <>
          <div onClick={() => setShowAddressModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[480px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] font-['Inter']" style={{ zIndex: 101 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e8ecef' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#181c1e' }}>Thêm địa chỉ</h3>
              <button onClick={() => setShowAddressModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#8a949d' }}><span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span></button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Họ và tên *</label>
                  <input type="text" value={newAddress.fullName} onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))} placeholder="Nguyễn Văn A" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none', transition: 'border-color 150ms' }} onFocus={e => (e.target.style.borderColor = '#00658d')} onBlur={e => (e.target.style.borderColor = '#e0e3e5')} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Số điện thoại *</label>
                  <input type="tel" value={newAddress.phone} onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))} placeholder="0901234567" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none', transition: 'border-color 150ms' }} onFocus={e => (e.target.style.borderColor = '#00658d')} onBlur={e => (e.target.style.borderColor = '#e0e3e5')} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Địa chỉ *</label>
                <input type="text" value={newAddress.address} onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))} placeholder="Số nhà, tên đường, phường/xã" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none', transition: 'border-color 150ms' }} onFocus={e => (e.target.style.borderColor = '#00658d')} onBlur={e => (e.target.style.borderColor = '#e0e3e5')} />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Thành phố *</label>
                  <input type="text" value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} placeholder="Hà Nội, TP.HCM..." style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none', transition: 'border-color 150ms' }} onFocus={e => (e.target.style.borderColor = '#00658d')} onBlur={e => (e.target.style.borderColor = '#e0e3e5')} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Mã bưu điện</label>
                  <input type="text" value={newAddress.postalCode} onChange={e => setNewAddress(p => ({ ...p, postalCode: e.target.value }))} placeholder="100000" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e0e3e5', fontSize: '14px', outline: 'none', transition: 'border-color 150ms' }} onFocus={e => (e.target.style.borderColor = '#00658d')} onBlur={e => (e.target.style.borderColor = '#e0e3e5')} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid #e8ecef' }}>
              <button onClick={() => setShowAddressModal(false)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #e0e3e5', background: '#fff', color: '#3e4850', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleAddAddress} style={{ padding: '10px 20px', borderRadius: '10px', background: '#00658d', border: 'none', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Lưu địa chỉ</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
