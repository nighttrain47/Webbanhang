import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import BlogPage from './pages/BlogPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import Login from './components/Login';
import Checkout from './components/Checkout';
import MyAccount from './components/MyAccount';
import OrderConfirmation from './components/OrderConfirmation';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SupportPage from './pages/SupportPage';
import BrandsPage from './pages/BrandsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  series: string;
  manufacturer: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  status?: string;
  rating?: number;
  stock?: number;
  sold?: number;
  sku?: string;
  description?: string;
  tags?: string[];
  preorderDeadline?: string;
  estimatedDelivery?: string;
  maxPerOrder?: number;
  scale?: string;
  dimensions?: string;
  material?: string;
  originalPrice?: number;
  promotionPrice?: number;
  quantity?: number;
  reviews?: number;
  isNew?: boolean;
  isHot?: boolean;
  isPromotion?: boolean;
  isPreorder?: boolean;
  brand?: any;
  specs?: {
    material: string;
    size: string;
    sculptor: string;
    releaseDate: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

// Helper to get product ID consistently
const getProductId = (product: Product): string => {
  return product._id || product.id || '';
};

function App() {
  // Restore state from localStorage on initial load
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hobbyshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hobbyshop_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('hobbyshop_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem('hobbyshop_token') || '';
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hobbyshop_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('hobbyshop_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('hobbyshop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hobbyshop_user');
    }
  }, [user]);

  // Persist token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('hobbyshop_token', token);
    } else {
      localStorage.removeItem('hobbyshop_token');
    }
  }, [token]);

  // Demo auto-login removed — users must login via email

  const [popupProduct, setPopupProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (popupProduct) {
      const timer = setTimeout(() => {
        setPopupProduct(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [popupProduct]);

  const addToCart = (product: Product) => {
    const pid = getProductId(product);
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => getProductId(item) === pid);
      if (existingItem) {
        return prevCart.map((item) =>
          getProductId(item) === pid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setPopupProduct(product);
  };

  const addToCartSilent = (product: Product) => {
    const pid = getProductId(product);
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => getProductId(item) === pid);
      if (existingItem) {
        return prevCart.map((item) =>
          getProductId(item) === pid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => getProductId(item) !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        getProductId(item) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleLogin = (userData: any) => {
    setUser(userData.customer || userData);
    setToken(userData.token || '');
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('hobbyshop_user');
    localStorage.removeItem('hobbyshop_token');
    localStorage.removeItem('hobbyshop_cart');
    localStorage.removeItem('hobbyshop_wishlist');
  };

  const handleDeleteAccount = () => {
    setUser(null);
    setToken('');
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('hobbyshop_user');
    localStorage.removeItem('hobbyshop_token');
    localStorage.removeItem('hobbyshop_cart');
    localStorage.removeItem('hobbyshop_wishlist');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              cartCount={cartCount}
              user={user}
            />
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <CategoryPage
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              cartCount={cartCount}
              user={user}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetailPage
              addToCart={addToCart}
              addToCartSilent={addToCartSilent}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              cartCount={cartCount}
              user={user}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateCartQuantity={updateQuantity}
              cartCount={cartCount}
              user={user}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/checkout"
          element={
            user ? (
              <Checkout
                cart={cart}
                user={user}
                token={token}
                cartCount={cartCount}
                clearCart={clearCart}
              />
            ) : (
              <Navigate to="/login?redirect=/checkout" replace />
            )
          }
        />
        <Route
          path="/my-account"
          element={
            <MyAccount
              user={user}
              token={token}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
              onUpdateUser={(updatedUser: any) => setUser(updatedUser)}
              wishlist={wishlist}
              cartCount={cartCount}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <OrderConfirmation
              cartCount={cartCount}
              user={user}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchPage
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              cartCount={cartCount}
              user={user}
            />
          }
        />
        <Route
          path="/blog"
          element={
            <BlogPage cartCount={cartCount} user={user} />
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <ArticleDetailPage cartCount={cartCount} user={user} />
          }
        />
        <Route path="/about" element={<AboutPage cartCount={cartCount} user={user} />} />
        <Route path="/contact" element={<ContactPage cartCount={cartCount} user={user} />} />
        <Route path="/support" element={<SupportPage cartCount={cartCount} user={user} />} />
        <Route path="/brands" element={<BrandsPage cartCount={cartCount} user={user} />} />
        <Route path="/terms" element={<TermsPage cartCount={cartCount} user={user} />} />
        <Route path="/privacy" element={<PrivacyPage cartCount={cartCount} user={user} />} />
      </Routes>

      {/* ═══ GLOBAL CART POPUP ═══ */}
      {popupProduct && (
        <>
          <style>{`
            @keyframes slideInPop {
              0% { transform: translateY(-20px) scale(0.95); opacity: 0; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }
          `}</style>
          <div style={{
            position: 'fixed', top: '80px', right: '24px',
            width: '380px', background: '#fff', borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)', zIndex: 101,
            overflow: 'hidden', fontFamily: "'Inter', sans-serif",
            animation: 'slideInPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: '1px solid #e8ecef',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a' }}>check_circle</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#181c1e' }}>Đã thêm vào giỏ hàng</span>
              </div>
              <button
                onClick={() => setPopupProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', color: '#8a949d' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>
            <div style={{ display: 'flex', gap: '14px', padding: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', background: '#f1f4f6', flexShrink: 0 }}>
                <img src={popupProduct.image} alt={popupProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '13px', fontWeight: 600, color: '#181c1e', lineHeight: 1.4, marginBottom: '6px',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{popupProduct.name}</p>
                <p style={{ fontSize: '11px', color: '#8a949d', marginBottom: '4px' }}>{popupProduct.manufacturer || 'HOBBYSHOP'}</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#00658d' }}>{popupProduct.price?.toLocaleString()}đ</p>
              </div>
              <span style={{ fontSize: '13px', color: '#8a949d', flexShrink: 0 }}>Số lượng: {cart.find(i => getProductId(i) === getProductId(popupProduct))?.quantity || 1}</span>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                to="/cart"
                onClick={() => setPopupProduct(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '12px', borderRadius: '10px',
                  border: '1.5px solid #e0e3e5', background: '#fff',
                  color: '#3e4850', fontWeight: 600, fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                Xem giỏ hàng ({cartCount})
              </Link>
              <Link
                to="/checkout"
                onClick={() => setPopupProduct(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '12px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00658d, #00adef)',
                  color: '#fff', fontWeight: 700, fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                Thanh toán ngay
              </Link>
              <button
                onClick={() => setPopupProduct(null)}
                style={{
                  padding: '8px', background: 'none', border: 'none',
                  color: '#00658d', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', textDecoration: 'underline',
                }}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </>
      )}
    </Router>
  );
}

export default App;