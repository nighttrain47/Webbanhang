import { Link } from 'react-router';
import { Minus, Plus, Trash2, ShieldCheck, Award, Truck } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { CartItem } from '../App';

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  user?: any;
}

export default function CartPage({ cart, removeFromCart, updateQuantity, user }: CartPageProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedShipping = subtotal > 200000 ? 0 : 15000;
  const pointsEarned = Math.floor(subtotal * 0.01);
  const grandTotal = subtotal + estimatedShipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} user={user} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">Giỏ hàng của bạn đang trống</p>
            <Link
              to="/"
              className="inline-block bg-[#FF9900] text-white px-8 py-3 rounded-lg hover:bg-[#E68A00] transition-colors font-semibold"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 font-semibold text-sm text-gray-600">
                  <div className="col-span-5">Sản phẩm</div>
                  <div className="col-span-2 text-center">Giá</div>
                  <div className="col-span-3 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Tổng</div>
                </div>

                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center">
                      <div className="md:col-span-5 flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/product/${item.id}`}
                            className="font-semibold hover:text-[#FF9900] transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">{item.series}</p>
                          {item.status && (
                            <span className="inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                              {item.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 text-center">
                        <p className="font-semibold">{item.price.toLocaleString()}đ</p>
                      </div>

                      <div className="md:col-span-3 flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="md:col-span-2 text-right">
                        <p className="font-bold text-lg text-[#FF9900]">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

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

                  {estimatedShipping > 0 && (
                    <p className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                      💡 Miễn phí ship đơn hàng trên 5.000.000đ
                    </p>
                  )}

                  <div className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600">Điểm tích lũy</span>
                      <p className="text-xs text-gray-500">Hoàn tiền 1%</p>
                    </div>
                    <span className="font-bold text-[#FF9900]">
                      {pointsEarned.toLocaleString()} điểm
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Tổng cộng</span>
                      <span className="text-2xl font-bold text-[#FF9900]">
                        {grandTotal.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-[#FF9900] text-white py-4 rounded-lg hover:bg-[#E68A00] transition-colors font-bold text-lg mb-4 text-center"
                >
                  Tiến hành thanh toán
                </Link>

                <Link
                  to="/"
                  className="block text-center text-gray-600 hover:text-[#FF9900] transition-colors font-medium"
                >
                  ← Tiếp tục mua sắm
                </Link>

                <div className="mt-8 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span>Thanh toán bảo mật</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span>Hàng chính hãng 100%</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-orange-600" />
                    <span>Giao hàng toàn quốc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}