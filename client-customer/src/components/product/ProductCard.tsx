import { Link, useNavigate, useLocation } from 'react-router';
import { Product } from '../../App';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  showAddToCartButton?: boolean; // full-width button for category pages
  user?: any;
}

const pid = (p: Product) => p._id || p.id || '';

function getBadge(product: Product): { text: string; bg: string } | null {
  if (product.preorderDeadline) return { text: 'PRE-ORDER', bg: '#e74c3c' };
  if (product.status === 'out-of-stock') return { text: 'SẮP HẾT HÀNG', bg: '#e74c3c' };
  if (product.isNew) return { text: 'NEW', bg: '#16a34a' };
  if (product.isHot) return { text: 'HOT', bg: '#ff7d36' };
  if ((product as any).isLimited) return { text: 'LIMITED EDITION', bg: '#e74c3c' };
  return null;
}

function getScaleBadge(product: Product): string | null {
  if (product.scale) return product.scale;
  if (product.category === 'nendoroid' || product.series?.toLowerCase().includes('nendoroid')) return 'NENDOROID';
  const name = product.name?.toLowerCase() || '';
  if (name.includes('1/7')) return 'SCALE 1/7';
  if (name.includes('1/8')) return 'SCALE 1/8';
  if (name.includes('1/4')) return 'SCALE 1/4';
  if (name.includes('1/6')) return 'SCALE 1/6';
  if (name.includes('nendoroid')) return 'NENDOROID';
  return null;
}

export default function ProductCard({ product, addToCart, wishlist, toggleWishlist, showAddToCartButton, user }: ProductCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = pid(product);
  const isInWishlist = wishlist.includes(productId);
  const badge = getBadge(product);
  const scaleBadge = getScaleBadge(product);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image Container */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Link to={`/product/${productId}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div
            style={{
              position: 'relative',
              paddingBottom: '100%', /* 1:1 ratio for 540x540 thumbnails */
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#f1f4f6',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 400ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        </Link>

        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {badge && (
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '6px',
              background: badge.bg,
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {badge.text}
            </span>
          )}
          {scaleBadge && (
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(24, 28, 30, 0.85)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {scaleBadge}
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!user) {
              navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
              return;
            }
            toggleWishlist(productId);
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 2,
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: isInWishlist ? '#00658d' : 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span className="material-symbols-outlined" style={{
            fontSize: '18px',
            color: isInWishlist ? '#fff' : '#6e7881',
            fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0",
          }}>favorite</span>
        </button>
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Manufacturer */}
        <p style={{
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#8a949d',
          marginBottom: '4px',
          fontFamily: "'Inter', sans-serif",
        }}>
          {product.manufacturer || product.series || 'HOBBYSHOP'}
        </p>

        {/* Name */}
        <Link
          to={`/product/${productId}`}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#181c1e',
            textDecoration: 'none',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '8px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {product.name}
        </Link>

        {/* Price + Cart Icon Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {product.originalPrice > 0 && product.originalPrice > product.price && (
              <span style={{
                fontSize: '11px',
                color: '#8a949d',
                textDecoration: 'line-through',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                marginBottom: '2px',
              }}>
                {product.originalPrice.toLocaleString()}đ
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                fontSize: '15px',
                fontWeight: 700,
                color: product.originalPrice && product.originalPrice > product.price ? '#e74c3c' : '#00658d',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {product.price?.toLocaleString()}đ
              </span>
              {product.originalPrice > 0 && product.originalPrice > product.price && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#e74c3c',
                  background: 'rgba(231, 76, 60, 0.1)',
                  padding: '2px 4px',
                  borderRadius: '4px',
                }}>
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
          </div>

          {!showAddToCartButton && (
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#181c1e',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 150ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#00658d')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#181c1e')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff' }}>shopping_cart</span>
            </button>
          )}
        </div>

        {/* Full-width Add to Cart button (for category pages) */}
        {showAddToCartButton && (
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              borderRadius: '10px',
              border: '1px solid #e0e3e5',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              color: '#3e4850',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#00658d'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#00658d'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#3e4850'; e.currentTarget.style.borderColor = '#e0e3e5'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shopping_cart</span>
            THÊM VÀO GIỎ
          </button>
        )}
      </div>
    </div>
  );
}