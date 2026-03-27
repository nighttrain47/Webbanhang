import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Menu, 
  X,
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
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const mainCategories: SidebarCategory[] = [
    {
      id: 'figures',
      name: 'Mô hình Figure',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'plastic-models',
      name: 'Mô hình lắp ráp',
      icon: <Box className="w-6 h-6" />
    },
    {
      id: 'goods',
      name: 'Goods & Phụ kiện',
      icon: <ShoppingBag className="w-6 h-6" />
    },
    {
      id: 'media',
      name: 'Media (CD/DVD)',
      icon: <Disc className="w-6 h-6" />
    },
    {
      id: 'brands',
      name: 'Thương hiệu',
      icon: <Award className="w-6 h-6" />
    }
  ];

  const secondaryLinks = [
    {
      id: 'ranking',
      name: 'Bảng xếp hạng',
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
      name: 'Hàng đã qua sử dụng',
      icon: <RotateCcw className="w-5 h-5" />,
      href: '#'
    },
    {
      id: 'blog_link',
      name: 'Tin tức & Blog',
      icon: <BookOpen className="w-5 h-5" />,
      href: '/blog',
      badge: 'NEW'
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0">
          <h2 className="font-bold text-sm uppercase tracking-wide text-gray-700">
            Danh mục sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Categories */}
        <nav className="py-2">
          {mainCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              onClick={onClose}
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
          ))}
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
              onClick={onClose}
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
            Giảm ngay 10%
          </p>
          <p className="text-xs opacity-90 mb-3">
            cho đơn đặt trước đầu tiên
          </p>
          <Link
            to="/login"
            onClick={onClose}
            className="block w-full bg-white text-[#FF6B00] text-center py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </div>
      </aside>
    </>
  );
}
