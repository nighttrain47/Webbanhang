import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Settings, LogOut, X 
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { AdminSection } from './AdminDashboard';

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ 
  activeSection, 
  setActiveSection, 
  onLogout,
  isOpen,
  onClose 
}: AdminSidebarProps) {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'dashboard' as AdminSection, icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'products' as AdminSection, icon: Package, label: 'Sản phẩm' },
    { id: 'orders' as AdminSection, icon: ShoppingCart, label: 'Đơn hàng' },
    { id: 'customers' as AdminSection, icon: Users, label: 'Khách hàng' },
    { id: 'reports' as AdminSection, icon: BarChart3, label: 'Báo cáo' },
    { id: 'settings' as AdminSection, icon: Settings, label: 'Cài đặt' },
  ];

  const handleItemClick = (section: AdminSection) => {
    setActiveSection(section);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                    ${isActive 
                      ? 'bg-orange-50 text-[#FF9900]' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={() => navigate('/store')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-blue-600 hover:bg-blue-50 transition-colors mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Quay lại cửa hàng</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}