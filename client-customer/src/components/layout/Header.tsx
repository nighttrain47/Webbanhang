import { Link, useLocation } from 'react-router';

interface HeaderProps {
  cartCount: number;
  user?: any;
}

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/category/new-arrivals', label: 'Sản phẩm mới' },
  { to: '/category/pre-order', label: 'Pre-order' },
  { to: '/category/sale', label: 'Khuyến mãi' },
];

export default function Header({ cartCount, user }: HeaderProps) {
  const location = useLocation();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid #e8ecef',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 lg:px-6"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '64px',
          gap: '32px',
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontStyle: 'italic',
              fontSize: '20px',
              color: '#00658d',
              letterSpacing: '-0.02em',
            }}
          >
            FigureCurator
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex" style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '8px 14px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#00658d' : '#3e4850',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid #00658d' : '2px solid transparent',
                  marginBottom: '-1px',
                  transition: 'color 150ms, border-color 150ms',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Search */}
          <Link
            to="/search"
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              color: '#6e7881',
              textDecoration: 'none',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>search</span>
          </Link>

          {/* Account */}
          <Link
            to={user ? '/my-account' : '/login'}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              color: '#6e7881',
              textDecoration: 'none',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>person</span>
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '24px',
              background: '#00658d',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'background 150ms',
              position: 'relative',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#005577')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#00658d')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_cart</span>
            Giỏ hàng
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  background: '#ff7d36',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>


      </div>
    </header>
  );
}