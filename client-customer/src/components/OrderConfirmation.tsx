import { Link } from 'react-router';
import { CheckCircle, Package, Mail, Award } from 'lucide-react';
import Header from './layout/Header';
import Footer from './layout/Footer';

interface OrderConfirmationProps {
  cartCount: number;
  user: any;
}

export default function OrderConfirmation({ cartCount, user }: OrderConfirmationProps) {
  const orderNumber = 'ORD-2026-' + Math.floor(Math.random() * 1000).toString().padStart(4, '0');
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600 mb-8">Cảm ơn bạn đã mua hàng</p>

          {/* Order Number */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
            <p className="text-2xl font-bold text-[#FF6B00]">{orderNumber}</p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Email xác nhận</p>
              <p className="text-xs text-gray-600 mt-1">Đã gửi đến email của bạn</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Giao hàng dự kiến</p>
              <p className="text-xs text-gray-600 mt-1">{estimatedDelivery}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <Award className="w-6 h-6 text-[#FF6B00] mx-auto mb-2" />
              <p className="text-sm font-semibold">Điểm tích lũy</p>
              <p className="text-xs text-gray-600 mt-1">Sẽ được cộng sau khi giao hàng</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold mb-4">Các bước tiếp theo?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <p>Chúng tôi sẽ xử lý đơn hàng trong vòng 24 giờ</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <p>Bạn sẽ nhận mã vận đơn qua email</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                  3
                </div>
                <p>Đơn hàng sẽ đến trong 7-14 ngày làm việc</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                  4
                </div>
                <p>Điểm sẽ được cộng vào tài khoản sau khi xác nhận giao hàng</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/my-account"
              className="flex-1 bg-[#FF6B00] text-white py-3 rounded-lg hover:bg-[#E55D00] transition-colors font-semibold"
            >
              Xem chi tiết đơn hàng
            </Link>
            <Link
              to="/"
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t text-sm text-gray-600">
            <p>Cần hỗ trợ? Liên hệ đội ngũ chăm sóc khách hàng tại</p>
            <a href="mailto:support@animeshop.com" className="text-[#FF6B00] hover:underline font-semibold">
              support@animeshop.com
            </a>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-lg mb-4">📦 Bạn có thể thích</h2>
          <p className="text-sm text-gray-600">
            Khám phá sản phẩm mới nhất và đặt trước trong khi chờ đơn hàng!
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-[#FF6B00] hover:underline font-semibold"
          >
            Xem sản phẩm mới →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
