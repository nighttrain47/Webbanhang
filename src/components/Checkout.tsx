import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CreditCard, Building2, Wallet, ShieldCheck, ChevronLeft } from 'lucide-react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { CartItem } from '../App';

interface CheckoutProps {
  cart: CartItem[];
  user: any;
  cartCount: number;
}

export default function Checkout({ cart, user, cartCount }: CheckoutProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [usePoints, setUsePoints] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Vietnam'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedShipping = subtotal > 200000 ? 0 : 15000;
  const pointsDiscount = usePoints ? Math.min(user?.points || 0, Math.floor(subtotal * 0.1)) : 0;
  const grandTotal = subtotal + estimatedShipping - pointsDiscount;
  const pointsEarned = Math.floor(subtotal * 0.01);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock order placement
    navigate('/order-confirmation');
  };

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Thẻ tín dụng/Ghi nợ',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'bank-transfer',
      name: 'Chuyển khoản ngân hàng',
      icon: Building2,
      description: 'Thanh toán trực tiếp qua ngân hàng'
    },
    {
      id: 'e-wallet',
      name: 'Ví điện tử',
      icon: Wallet,
      description: 'Momo, ZaloPay, VNPay'
    }
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={cartCount} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
          <Link to="/" className="text-[#FF9900] hover:underline">
            Quay về trang chủ
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/cart" className="hover:text-[#FF9900] flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Quay lại giỏ hàng
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#FF9900]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? 'bg-[#FF9900] text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="font-medium hidden sm:inline">Giao hàng</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#FF9900]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? 'bg-[#FF9900] text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="font-medium hidden sm:inline">Thanh toán</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#FF9900]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 3 ? 'bg-[#FF9900] text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="font-medium hidden sm:inline">Xác nhận</span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Information */}
              {step >= 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        placeholder="Nhập họ tên đầy đủ"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        placeholder="0901234567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        placeholder="Số nhà, tên đường"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thành phố *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        placeholder="Hà Nội, TP.HCM..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã bưu điện *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        placeholder="100000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {step === 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="mt-6 w-full bg-[#FF9900] text-white py-3 rounded-lg hover:bg-[#E68A00] transition-colors font-semibold"
                    >
                      Tiếp tục thanh toán
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step >= 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                  <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-[#FF9900] bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 text-[#FF9900] focus:ring-[#FF9900]"
                        />
                        <method.icon className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                          <p className="font-semibold">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'credit-card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentChange}
                          placeholder="NGUYEN VAN A"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 bg-[#FF9900] text-white py-3 rounded-lg hover:bg-[#E68A00] transition-colors font-semibold"
                      >
                        Review Order
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review Order */}
              {step >= 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Order Review</h2>

                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">¥{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#FF9900] text-white py-3 rounded-lg hover:bg-[#E68A00] transition-colors font-semibold"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold">{subtotal.toLocaleString()}đ</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">
                      {estimatedShipping === 0 ? (
                        <span className="text-green-600">MIỄN PHÍ</span>
                      ) : (
                        `${estimatedShipping.toLocaleString()}đ`
                      )}
                    </span>
                  </div>

                  {user && (
                    <div className="border-t pt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usePoints}
                          onChange={(e) => setUsePoints(e.target.checked)}
                          className="w-5 h-5 text-[#FF9900] rounded focus:ring-[#FF9900]"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Sử dụng điểm</p>
                          <p className="text-xs text-gray-500">
                            Có sẵn: {user.points.toLocaleString()} điểm
                          </p>
                        </div>
                      </label>
                      {usePoints && (
                        <p className="text-sm text-green-600 mt-2">
                          -{pointsDiscount.toLocaleString()}đ
                        </p>
                      )}
                    </div>
                  )}

                  {user && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Điểm tích lũy</p>
                      <p className="text-lg font-bold text-[#FF9900]">
                        +{pointsEarned.toLocaleString()} điểm
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Tổng cộng</span>
                      <span className="text-2xl font-bold text-[#FF9900]">
                        {grandTotal.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span>Bảo mật SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span>Đảm bảo hoàn tiền</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}