import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import Login from './components/Login';
import Checkout from './components/Checkout';
import MyAccount from './components/MyAccount';
import OrderConfirmation from './components/OrderConfirmation';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';

export interface Product {
  id: string;
  name: string;
  series: string;
  manufacturer: string;
  price: number;
  image: string;
  category: string;
  status?: string;
  rating?: number;
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

export interface BundleItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AdminLogin
              onLogin={handleLogin}
            />
          }
        />
        <Route
          path="/store"
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
          path="/product/:id"
          element={
            <ProductDetailPage
              addToCart={addToCart}
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
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              user={user}
            />
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              user={user}
              cartCount={cartCount}
            />
          }
        />
        <Route
          path="/my-account"
          element={
            <MyAccount
              user={user}
              onLogout={handleLogout}
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
            />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AdminDashboard
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/admin-login"
          element={
            <AdminLogin
              onLogin={handleLogin}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;