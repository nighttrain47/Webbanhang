import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Footer from './layout/Footer';

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login/register
    const mockUser = {
      id: '1',
      name: formData.name || 'Otaku User',
      email: formData.email,
      points: 15000,
      memberSince: '2024-01-15'
    };

    onLogin(mockUser);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-[#FF9900]">
            AnimeShop
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Toggle Login/Register */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 font-semibold transition-colors ${
                isLogin
                  ? 'text-[#FF9900] border-b-2 border-[#FF9900]'
                  : 'text-gray-400'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 font-semibold transition-colors ${
                !isLogin
                  ? 'text-[#FF9900] border-b-2 border-[#FF9900]'
                  : 'text-gray-400'
              }`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ tên của bạn"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <Link
                  to="#"
                  className="text-sm text-[#FF9900] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FF9900] text-white py-3 rounded-lg hover:bg-[#E68A00] transition-colors font-semibold"
            >
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>

            {!isLogin && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  🎁 <strong>Quà chào mừng:</strong> Nhận 1.000 điểm khi tạo tài khoản!
                </p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[#FF9900] font-semibold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>
                Đã có tài khoản?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#FF9900] font-semibold hover:underline"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4">Đặc quyền thành viên</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[#FF9900]">✓</span>
              <span>Tích điểm 1% cho mọi đơn hàng</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FF9900]">✓</span>
              <span>Ưu tiên đặt trước và mua sản phẩm giới hạn</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FF9900]">✓</span>
              <span>Giảm giá độc quyền dành cho thành viên</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FF9900]">✓</span>
              <span>Ưu đãi đặc biệt vào tháng sinh nhật</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}