import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

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
          {/* Search - Expandable */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                borderRadius: '24px',
                border: searchOpen ? '1.5px solid #00658d' : '1.5px solid transparent',
                background: searchOpen ? '#f8fafb' : 'transparent',
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                width: searchOpen ? '280px' : '40px',
                height: '40px',
              }}
            >
              {/* Search Icon / Button */}
              <button
                onClick={() => {
                  if (!searchOpen) {
                    setSearchOpen(true);
                  } else {
                    handleSearch();
                  }
                }}
                style={{
                  width: '40px',
                  minWidth: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  color: searchOpen ? '#00658d' : '#6e7881',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 150ms',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  if (!searchOpen) e.currentTarget.style.background = '#f1f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                title="Tìm kiếm"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>search</span>
              </button>

              {/* Search Input */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                placeholder="Tìm kiếm sản phẩm..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13.5px',
                  color: '#1a2530',
                  fontFamily: "'Inter', sans-serif",
                  padding: '0 4px',
                  opacity: searchOpen ? 1 : 0,
                  transition: 'opacity 200ms',
                }}
              />

              {/* Close Button */}
              {searchOpen && (
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  style={{
                    width: '32px',
                    minWidth: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    color: '#6e7881',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '4px',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e8ecef')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                </button>
              )}
            </div>
          </div>

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