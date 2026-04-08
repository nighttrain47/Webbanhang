import { useNavigate } from 'react-router';
import { AdminSection } from './AdminDashboard';
import { LayoutDashboard, Package, Folders, Store, ShoppingCart, Users, BarChart3, Settings, Home, LogOut, X, Box } from 'lucide-react';

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: { id: AdminSection; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
  { id: 'products', icon: Package, label: 'Sản phẩm' },
  { id: 'categories', icon: Folders, label: 'Danh mục' },
  { id: 'brands', icon: Store, label: 'Thương hiệu' },
  { id: 'orders', icon: ShoppingCart, label: 'Đơn hàng' },
  { id: 'customers', icon: Users, label: 'Khách hàng' },
  { id: 'reports', icon: BarChart3, label: 'Báo cáo' },
  { id: 'settings', icon: Settings, label: 'Cài đặt' },
];

export default function AdminSidebar({
  activeSection, setActiveSection, onLogout, isOpen, onClose
}: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleItemClick = (section: AdminSection) => {
    setActiveSection(section);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 z-50 flex flex-col font-sans transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-900 tracking-tight">HobbyShop</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 w-full text-left ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-1 bg-gray-50/50">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-gray-700 font-medium text-sm transition-colors hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
          >
            <Home className="w-5 h-5 text-gray-400" />
            Quay lại cửa hàng
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-600 font-medium text-sm transition-colors hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}