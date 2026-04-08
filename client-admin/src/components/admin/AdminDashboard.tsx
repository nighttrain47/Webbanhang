import { useState } from 'react';
import { useNavigate } from 'react-router';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import CustomerManagement from './CustomerManagement';
import ReportsAnalytics from './ReportsAnalytics';
import CategoryManagement from './CategoryManagement';
import BrandManagement from './BrandManagement';
import { Search, Menu } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export type AdminSection = 'dashboard' | 'products' | 'categories' | 'brands' | 'orders' | 'customers' | 'reports' | 'settings';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminUser = { name: 'Admin', role: 'Super Admin' };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview onNavigate={setActiveSection} />;
      case 'products': return <ProductManagement />;
      case 'categories': return <CategoryManagement />;
      case 'brands': return <BrandManagement />;
      case 'orders': return <OrderManagement />;
      case 'customers': return <CustomerManagement />;
      case 'reports': return <ReportsAnalytics />;
      case 'settings': return <SettingsSection />;
      default: return <DashboardOverview onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-72 pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="font-semibold text-sm text-gray-900">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">{adminUser.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {adminUser.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function SettingsSection() {
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors";

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
              </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Thông tin cửa hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên cửa hàng</label>
            <input type="text" defaultValue="HobbyShop Vietnam" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email liên hệ</label>
            <input type="email" defaultValue="contact@hobbyshop.vn" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
            <input type="tel" defaultValue="+84 28 1234 5678" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
            <input type="text" defaultValue="123 Nguyễn Huệ, Q.1, TP.HCM" className={inputClass} />
          </div>
        </div>
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-colors cursor-pointer">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}