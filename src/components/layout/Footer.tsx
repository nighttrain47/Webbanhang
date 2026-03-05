import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-white font-bold mb-4">AnimeShop Việt Nam</h3>
            <p className="text-sm mb-4">
              Nguồn cung cấp uy tín các sản phẩm figure anime, mô hình và đồ sưu tầm Nhật Bản chính hãng từ năm 2010.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="hover:text-[#FF9900] transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-[#FF9900] transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-[#FF9900] transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-[#FF9900] transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Real Store Information */}
          <div>
            <h3 className="text-white font-bold mb-4">Cửa hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 Chi nhánh Hà Nội</li>
              <li>48 Tràng Tiền, Hoàn Kiếm</li>
              <li>Hà Nội, Việt Nam</li>
              <li className="pt-2">🕐 9:00 - 21:00 (Hàng ngày)</li>
              <li>📞 +84 24-1234-5678</li>
            </ul>
          </div>

          {/* Column 3: Support & Policy */}
          <div>
            <h3 className="text-white font-bold mb-4">Hỗ trợ & Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Thông tin vận chuyển
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Đổi trả & Hoàn tiền
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: User & Points */}
          <div>
            <h3 className="text-white font-bold mb-4">Tài khoản & Điểm thưởng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-[#FF9900] transition-colors">
                  Đăng nhập / Đăng ký
                </Link>
              </li>
              <li>
                <Link to="/my-account" className="hover:text-[#FF9900] transition-colors">
                  Tài khoản của tôi
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Lịch sử đơn hàng
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Hướng dẫn tích điểm
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF9900] transition-colors">
                  Hạng thành viên
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2026 AnimeShop Việt Nam. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <img src="https://via.placeholder.com/40x25?text=VISA" alt="Visa" className="h-6" />
            <img src="https://via.placeholder.com/40x25?text=MC" alt="Mastercard" className="h-6" />
            <img src="https://via.placeholder.com/40x25?text=JCB" alt="JCB" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}