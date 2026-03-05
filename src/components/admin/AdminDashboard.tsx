import { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Settings, LogOut, Bell, Search, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import CustomerManagement from './CustomerManagement';
import ReportsAnalytics from './ReportsAnalytics';

interface AdminDashboardProps {
  onLogout: () => void;
}

export type AdminSection = 'dashboard' | 'products' | 'orders' | 'customers' | 'reports' | 'settings';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminUser = {
    name: 'Admin User',
    email: 'admin@animestore.vn',
    role: 'Super Admin',
    avatar: null
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              <span className="text-[#FF9900]">Anime Store</span> Admin
            </h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/store')}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Xem cửa hàng
            </button>
            
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="hidden sm:block text-right">
                <p className="font-semibold text-sm">{adminUser.name}</p>
                <p className="text-xs text-gray-500">{adminUser.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF9900] to-[#E68A00] rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Thông tin cửa hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên cửa hàng
                </label>
                <input
                  type="text"
                  defaultValue="Anime Store Vietnam"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  defaultValue="contact@animestore.vn"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  defaultValue="+84 28 1234 5678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Cài đặt thanh toán</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-[#FF9900]" />
                <div>
                  <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-gray-500">Cho phép khách hàng thanh toán khi nhận hàng</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-[#FF9900]" />
                <div>
                  <p className="font-medium">Chuyển khoản ngân hàng</p>
                  <p className="text-sm text-gray-500">Thanh toán qua chuyển khoản ngân hàng</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" className="w-5 h-5 text-[#FF9900]" />
                <div>
                  <p className="font-medium">Ví điện tử (MoMo, ZaloPay)</p>
                  <p className="text-sm text-gray-500">Thanh toán qua ví điện tử</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="bg-[#FF9900] text-white px-6 py-3 rounded-lg hover:bg-[#E68A00] font-semibold">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}