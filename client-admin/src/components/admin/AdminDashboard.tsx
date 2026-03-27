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

interface AdminDashboardProps {
  onLogout: () => void;
}

export type AdminSection = 'dashboard' | 'products' | 'categories' | 'brands' | 'orders' | 'customers' | 'reports' | 'settings';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminUser = { name: 'Admin User', role: 'Super Admin' };

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
      default: return <DashboardOverview />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dc-surface)', fontFamily: 'var(--dc-font-body)' }}>
      {/* Top Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(189, 200, 209, 0.3)',
        marginLeft: '260px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dc-on-surface-variant)' }}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Search */}
            <div style={{ position: 'relative' }} className="hidden md:block">
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: 'var(--dc-outline)' }}>search</span>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                style={{
                  paddingLeft: '2.5rem', paddingRight: '1rem',
                  padding: '0.5rem 1rem 0.5rem 2.5rem',
                  borderRadius: '0.75rem', border: 'none',
                  background: 'var(--dc-surface-container-high)',
                  fontSize: '0.875rem', width: '300px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="hidden sm:block" style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dc-on-surface)' }}>{adminUser.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--dc-outline)' }}>{adminUser.role}</p>
              </div>
              <div className="signature-gradient" style={{
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.875rem',
              }}>A</div>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div style={{ display: 'flex' }}>
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main style={{ flex: 1, padding: '2rem', marginLeft: '260px' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function SettingsSection() {
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    borderRadius: '0.75rem', border: 'none',
    background: 'var(--dc-surface-container-high)',
    fontSize: '0.875rem', outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--dc-font-headline)', fontSize: '1.75rem', fontWeight: 700 }}>Cài đặt</h1>
        <p style={{ color: 'var(--dc-on-surface-variant)', marginTop: '0.25rem' }}>Quản lý cài đặt hệ thống</p>
      </div>

      <div style={{ background: 'var(--dc-surface-container-lowest)', borderRadius: '1rem', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--dc-font-headline)', fontWeight: 700, marginBottom: '1.5rem' }}>Thông tin cửa hàng</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--dc-on-surface-variant)' }}>Tên cửa hàng</label>
            <input type="text" defaultValue="HobbyShop Vietnam" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--dc-on-surface-variant)' }}>Email liên hệ</label>
            <input type="email" defaultValue="contact@hobbyshop.vn" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--dc-on-surface-variant)' }}>SĐT</label>
            <input type="tel" defaultValue="+84 28 1234 5678" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--dc-on-surface-variant)' }}>Địa chỉ</label>
            <input type="text" defaultValue="123 Nguyễn Huệ, Q.1, TP.HCM" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="signature-gradient" style={{
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
            color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
          }}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}