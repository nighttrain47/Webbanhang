import { Link } from 'react-router';
import { API_URL } from '../../config';
import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Box, 
  Sparkles, 
  Package, 
  Disc, 
  ShoppingBag, 
  Award,
  TrendingUp,
  Clock,
  Tag,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface SidebarCategory {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  icon?: React.ReactNode;
  count?: number;
  subcategories?: string[];
}

export default function Sidebar() {
  const [categories, setCategories] = useState<SidebarCategory[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/customer/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data.map(c => ({
            ...c,
            icon: <Box className="w-6 h-6" /> // default icon
          })));
        }
      })
      .catch(err => console.error(err));
  }, []);
  // Categories fetched from API

  const secondaryLinks = [
    {
      id: 'ranking',
      name: 'Xếp hạng',
      icon: <TrendingUp className="w-5 h-5" />,
      href: '#'
    },
    {
      id: 'new-arrivals',
      name: 'Hàng mới về',
      icon: <Clock className="w-5 h-5" />,
      href: '#'
    },
    {
      id: 'sale',
      name: 'Giảm giá',
      icon: <Tag className="w-5 h-5" />,
      href: '#',
      badge: 'HOT'
    },
    {
      id: 'pre-owned',
      name: 'Hàng cũ',
      icon: <RotateCcw className="w-5 h-5" />,
      href: '#'
    },
    {
      id: 'blog_link', // Dummy ID if we use to loop, but we will change 'to' logic
      name: 'Tin tức & Blog',
      icon: <BookOpen className="w-5 h-5" />,
      href: '/blog'
    }
  ];

  return (
    <aside className="w-full bg-white border-r border-gray-200 shadow-sm h-full sticky top-[73px] overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-4">
        <h2 className="font-bold text-sm uppercase tracking-wide text-gray-700">
          Tìm theo danh mục
        </h2>
      </div>

      {/* Main Categories */}
      <nav className="py-2">
        {categories.length > 0 ? categories.map((category) => (
          <Link
            key={category._id || category.id}
            to={`/category/${category.slug || category._id}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-gray-700 group-hover:text-[#FF6B00] transition-colors">
                {category.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900 group-hover:text-[#FF6B00] transition-colors">
                  {category.name}
                </p>
                {category.count && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {category.count.toLocaleString()} sản phẩm
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B00] transition-colors" />
          </Link>
        )) : (
          <div className="px-4 py-3 text-sm text-gray-500">Đang tải danh mục...</div>
        )}
      </nav>

      {/* Divider */}
      <div className="border-t-2 border-gray-200 my-2"></div>

      {/* Secondary Links */}
      <nav className="py-2">
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Truy cập nhanh
          </p>
        </div>
        {secondaryLinks.map((link) => (
          <Link
            key={link.id}
            to={link.href !== '#' ? link.href : `/category/${link.id}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="text-gray-600 group-hover:text-[#FF6B00] transition-colors">
                {link.icon}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors font-medium">
                {link.name}
              </span>
              {link.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                  {link.badge}
                </span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B00] transition-colors" />
          </Link>
        ))}
      </nav>

      {/* Promotional Banner */}
      <div className="m-4 mt-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide mb-1">
          Ưu đãi thành viên
        </p>
        <p className="text-sm font-bold mb-2">
          Giảm 10%
        </p>
        <p className="text-xs opacity-90 mb-3">
          cho đơn pre-order đầu tiên
        </p>
        <Link
          to="/login"
          className="block w-full bg-white text-[#FF6B00] text-center py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors"
        >
          Đăng ký ngay
        </Link>
      </div>

      {/* Support Info */}
      <div className="border-t border-gray-200 p-4 text-xs text-gray-600 space-y-2">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span>Miễn phí ship đơn trên 5.000.000đ</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-gray-400" />
          <span>Sản phẩm chính hãng 100%</span>
        </div>
      </div>
    </aside>
  );
}
