import { useNavigate } from 'react-router';
import { AdminSection } from './AdminDashboard';

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: { id: AdminSection; icon: string; label: string }[] = [
  { id: 'dashboard', icon: 'dashboard', label: 'Tổng quan' },
  { id: 'products', icon: 'inventory_2', label: 'Sản phẩm' },
  { id: 'categories', icon: 'category', label: 'Danh mục' },
  { id: 'brands', icon: 'storefront', label: 'Thương hiệu' },
  { id: 'orders', icon: 'shopping_cart', label: 'Đơn hàng' },
  { id: 'customers', icon: 'group', label: 'Khách hàng' },
  { id: 'reports', icon: 'bar_chart', label: 'Báo cáo' },
  { id: 'settings', icon: 'settings', label: 'Cài đặt' },
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
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          className="lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '260px', height: '100vh',
          background: 'var(--dc-surface-container-lowest)',
          borderRight: '1px solid rgba(189, 200, 209, 0.3)',
          zIndex: 50,
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 300ms ease',
          fontFamily: 'var(--dc-font-body)',
        }}
        className={isOpen ? '' : 'hidden lg:flex'}
      >
        {/* Brand */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="signature-gradient" style={{
              width: '36px', height: '36px', borderRadius: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'white' }}>storefront</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--dc-font-headline)', fontWeight: 700, fontSize: '1rem', color: 'var(--dc-on-surface)' }}>HobbyShop</p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--dc-outline)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dc-outline)' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0.5rem 1rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.625rem 1rem', borderRadius: '0.75rem',
                    fontWeight: isActive ? 600 : 500, fontSize: '0.875rem',
                    background: isActive ? 'rgba(0, 101, 141, 0.08)' : 'transparent',
                    color: isActive ? 'var(--dc-primary)' : 'var(--dc-on-surface-variant)',
                    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                    transition: 'all 200ms',
                  }}
                >
                  <span className="material-symbols-outlined" style={{
                    fontSize: '22px',
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(189, 200, 209, 0.3)' }}>
          <button
            onClick={() => navigate('/store')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              width: '100%', padding: '0.625rem 1rem', borderRadius: '0.75rem',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--dc-primary)', fontWeight: 500, fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>home</span>
            Quay lại cửa hàng
          </button>
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              width: '100%', padding: '0.625rem 1rem', borderRadius: '0.75rem',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#ef4444', fontWeight: 500, fontSize: '0.875rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}