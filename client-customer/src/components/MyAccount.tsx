import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Link } from 'react-router';
import {
  User, Package, Heart, Award, Settings, LogOut, Star, TrendingUp,
  MapPin, Phone, Mail, Globe, Calendar, Shield, Bell, CreditCard,
  Truck, CheckCircle, Clock, AlertCircle, Eye, Search, Filter
} from 'lucide-react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import ProductCard from './product/ProductCard';
import { Product } from '../App';

interface MyAccountProps {
  user: any;
  token: string;
  onLogout: () => void;
  onUpdateUser: (updatedUser: any) => void;
  wishlist: string[];
  cartCount: number;
  toggleWishlist?: (productId: string) => void;
  addToCart?: (product: Product) => void;
}

type ActiveTab = 'profile' | 'orders' | 'wishlist' | 'points' | 'settings';

export default function MyAccount({ user, token, onLogout, onUpdateUser, wishlist, cartCount, toggleWishlist, addToCart }: MyAccountProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'>('all');
  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Fetch real orders from API
  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  // Fetch wishlist products from API
  useEffect(() => {
    if (wishlist.length > 0) {
      fetchWishlistProducts();
    } else {
      setWishlistProducts([]);
    }
  }, [wishlist]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customer/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRealOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchWishlistProducts = async () => {
    try {
      const products: Product[] = [];
      const invalidIds: string[] = [];
      for (const id of wishlist) {
        const res = await fetch(`${API_URL}/api/customer/products/${id}`);
        if (res.ok) {
          const product = await res.json();
          products.push(product);
        } else if (res.status === 404) {
          // Product was deleted from database, mark for cleanup
          invalidIds.push(id);
        }
      }
      // Remove invalid product IDs from wishlist
      if (invalidIds.length > 0 && toggleWishlist) {
        invalidIds.forEach(id => toggleWishlist(id));
      }
      setWishlistProducts(products);
    } catch (error) {
      console.error('Fetch wishlist error:', error);
    }
  };

  // Check if user exists first
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartCount={cartCount} user={user} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập để xem tài khoản</h2>
          <Link to="/login" className="text-[#FF6B00] hover:underline">
            Đăng nhập
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const userPoints = user.points || 0;

  const membershipTiers = [
    { name: 'Bronze', minPoints: 0, maxPoints: 9999, color: 'bg-amber-700', benefits: ['1% cashback', 'Standard support'] },
    { name: 'Silver', minPoints: 10000, maxPoints: 29999, color: 'bg-gray-400', benefits: ['1.5% cashback', 'Priority support', 'Birthday bonus'] },
    { name: 'Gold', minPoints: 30000, maxPoints: 99999, color: 'bg-yellow-500', benefits: ['2% cashback', 'VIP support', 'Early access', 'Free express shipping'] },
    { name: 'Platinum', minPoints: 100000, maxPoints: Infinity, color: 'bg-purple-500', benefits: ['3% cashback', 'Dedicated support', 'Exclusive items', 'Free worldwide shipping'] }
  ];

  const currentTier = membershipTiers.reduce((acc, tier) => {
    if (userPoints >= tier.minPoints) return tier;
    return acc;
  }, membershipTiers[0]);

  const nextTier = membershipTiers.find(tier => tier.minPoints > userPoints);
  const pointsToNextTier = nextTier ? nextTier.minPoints - userPoints : 0;

  // Filter orders from real API data
  const statusMap: Record<string, string> = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'shipping': 'Đang vận chuyển',
    'delivered': 'Đã giao',
    'cancelled': 'Đã hủy'
  };

  const statusColorMap: Record<string, string> = {
    'pending': 'yellow',
    'confirmed': 'blue',
    'shipping': 'blue',
    'delivered': 'green',
    'cancelled': 'red'
  };

  const mappedOrders = realOrders.map(order => ({
    id: order._id,
    date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
    status: statusMap[order.status] || order.status,
    statusColor: statusColorMap[order.status] || 'gray',
    total: order.total,
    items: order.items?.length || 0,
    pointsEarned: Math.floor(order.total * 0.01),
    shippingAddress: order.shippingAddress || '',
    trackingNumber: order.status === 'shipping' ? 'Đang vận chuyển' : (order.status === 'pending' ? 'Chờ xử lý' : ''),
    products: (order.items || []).map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  }));

  const filteredOrders = orderFilter === 'all'
    ? mappedOrders
    : mappedOrders.filter(order => {
      const originalOrder = realOrders.find(o => o._id === order.id);
      return originalOrder?.status === orderFilter;
    });

  // Render content based on active tab
  // Points history from orders
  const pointsHistory = mappedOrders.map(order => ({
    date: order.date,
    description: `Đơn hàng #${order.id?.slice(-6) || ''}`,
    points: order.pointsEarned,
    type: 'earned' as const
  }));

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection user={user} currentTier={currentTier} nextTier={nextTier} pointsToNextTier={pointsToNextTier} mockOrders={mappedOrders} wishlist={wishlist} />;

      case 'orders':
        return <OrdersSection orders={filteredOrders} orderFilter={orderFilter} setOrderFilter={setOrderFilter} isLoading={ordersLoading} />;

      case 'wishlist':
        return <WishlistSection wishlistProducts={wishlistProducts} toggleWishlist={toggleWishlist} addToCart={addToCart} wishlist={wishlist} />;

      case 'points':
        return <PointsSection user={{ ...user, points: userPoints }} currentTier={currentTier} nextTier={nextTier} pointsToNextTier={pointsToNextTier} pointsHistory={pointsHistory} membershipTiers={membershipTiers} />;

      case 'settings':
        return <SettingsSection user={user} token={token} onUpdateUser={onUpdateUser} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B00] to-[#E55D00] rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-bold text-lg">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${currentTier.color} text-white`}>
                  Thành viên {currentTier.name}
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <User className="w-5 h-5" />
                  <span>Tổng quan</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Đơn hàng</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'wishlist' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Yêu thích ({wishlist.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('points')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'points' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <Award className="w-5 h-5" />
                  <span>Điểm thưởng</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Cài đặt</span>
                </button>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors hover:bg-red-50 text-red-600 mt-4 border-t pt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Profile Section Component
function ProfileSection({ user, currentTier, nextTier, pointsToNextTier, mockOrders, wishlist }: any) {
  const userPoints = user.points || 0;
  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Total Points</p>
            <p className="text-4xl font-bold">{userPoints.toLocaleString()}</p>
            <p className="text-sm opacity-90 mt-1">≈ {userPoints.toLocaleString()}đ value</p>
          </div>
          <Award className="w-12 h-12 opacity-80" />
        </div>

        {nextTier && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to {nextTier.name}</span>
              <span>{pointsToNextTier.toLocaleString()} pts to go</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{
                  width: `${((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white border-opacity-30">
          <div>
            <p className="text-sm opacity-90">Lifetime Earned</p>
            <p className="text-xl font-bold">{(userPoints + 5000).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">This Month</p>
            <p className="text-xl font-bold">+4,820</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{mockOrders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Wishlist Items</p>
              <p className="text-2xl font-bold">{wishlist.length}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-2xl font-bold">2024</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-semibold">{user.memberSince || '2024-01-15'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Default Address</p>
              <p className="font-semibold">Hà Nội, Hoàn Kiếm, Việt Nam</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">+84 90-123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Orders Section Component
function OrdersSection({ orders, orderFilter, setOrderFilter, isLoading }: any) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Order History</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Filter:</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'].map((filter) => {
            const labels: Record<string, string> = {
              all: 'Tất cả',
              pending: 'Chờ xác nhận',
              confirmed: 'Đã xác nhận',
              shipping: 'Đang giao',
              delivered: 'Đã giao',
              cancelled: 'Đã hủy'
            };
            return (
              <button
                key={filter}
                onClick={() => setOrderFilter(filter as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${orderFilter === filter
                    ? 'bg-[#FF6B00] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {labels[filter] || filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B00]"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No orders found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-lg">{order.id}</p>
                      {getStatusIcon(order.status)}
                    </div>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${order.statusColor === 'green'
                      ? 'bg-green-100 text-green-800'
                      : order.statusColor === 'blue'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Items</p>
                    <p className="font-semibold">{order.items}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold">{order.total.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Points Earned</p>
                    <p className="font-semibold text-[#FF6B00]">+{order.pointsEarned}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tracking</p>
                    <p className="font-semibold text-xs">{order.trackingNumber}</p>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              <div className="p-6">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="flex items-center gap-2 text-[#FF6B00] hover:underline font-medium mb-4"
                >
                  <Eye className="w-4 h-4" />
                  {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedOrder === order.id && (
                  <div className="space-y-4">
                    {/* Products */}
                    <div>
                      <h4 className="font-semibold mb-3">Products:</h4>
                      <div className="space-y-2">
                        {order.products.map((product: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                            </div>
                            <p className="font-semibold">{product.price.toLocaleString()}đ</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address:</h4>
                      <p className="text-gray-600">{order.shippingAddress}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      {order.status === 'Shipping' && (
                        <button className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55D00] transition-colors font-medium">
                          Track Package
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <button className="px-4 py-2 border border-[#FF6B00] text-[#FF6B00] rounded-lg hover:bg-orange-50 transition-colors font-medium">
                          Leave Review
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium">
                        Contact Support
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Wishlist Section Component
function WishlistSection({ wishlistProducts, toggleWishlist, addToCart, wishlist }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">My Wishlist</h2>
          <div className="flex items-center gap-2 text-gray-500">
            <Heart className="w-5 h-5" />
            <span className="font-semibold">{wishlistProducts.length} items</span>
          </div>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">Your wishlist is empty</p>
          <p className="text-sm text-gray-500 mb-6">Start adding items you love!</p>
          <Link
            to="/"
            className="inline-block bg-[#FF6B00] text-white px-6 py-3 rounded-lg hover:bg-[#E55D00] transition-colors font-semibold"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product: Product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              addToCart={addToCart}
              wishlist={wishlist || []}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Points Section Component
function PointsSection({ user, currentTier, nextTier, pointsToNextTier, pointsHistory, membershipTiers }: any) {
  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm opacity-90 mb-2">Available Points</p>
            <p className="text-5xl font-bold mb-2">{user.points.toLocaleString()}</p>
            <p className="text-sm opacity-90">≈ {user.points.toLocaleString()}đ discount value</p>
          </div>
          <Award className="w-16 h-16 opacity-80" />
        </div>

        {nextTier && (
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm mb-3">
              <span>Progress to {nextTier.name} Tier</span>
              <span className="font-bold">{pointsToNextTier.toLocaleString()} pts needed</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all"
                style={{
                  width: `${Math.min(((user.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Membership Tiers */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Membership Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {membershipTiers.map((tier: any) => (
            <div
              key={tier.name}
              className={`border-2 rounded-lg p-4 transition-all ${tier.name === currentTier.name
                  ? 'border-[#FF6B00] bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${tier.color} rounded-full flex items-center justify-center`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">{tier.name}</h3>
                    <p className="text-xs text-gray-500">
                      {tier.minPoints.toLocaleString()}{tier.maxPoints === Infinity ? '+' : ` - ${tier.maxPoints.toLocaleString()}`} pts
                    </p>
                  </div>
                </div>
                {tier.name === currentTier.name && (
                  <span className="bg-[#FF6B00] text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Current
                  </span>
                )}
              </div>
              <ul className="space-y-1 text-sm text-gray-600">
                {tier.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Points History */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-white">
          <h2 className="text-xl font-bold">Points History</h2>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {pointsHistory.map((transaction: any, index: number) => (
            <div key={index} className="p-6 flex items-center justify-between hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'earned'
                    ? 'bg-green-100'
                    : transaction.type === 'used'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`}>
                  {transaction.type === 'earned' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : transaction.type === 'used' ? (
                    <Award className="w-5 h-5 text-red-600" />
                  ) : (
                    <Award className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <p className={`font-bold text-lg ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How Points Work */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          How Points Work
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Earn 1-3% points on every purchase based on your tier</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>1 điểm = 1đ giảm giá khi quy đổi</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Use up to 10% of order value with points</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Points expire after 1 year from earning date</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Bonus points on birthday month and special promotions</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection({ user, token, onUpdateUser }: any) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: '',
    postalCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saveStatus, setSaveStatus] = useState('');

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    newProducts: true
  });

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={async () => {
              setSaveStatus('');
              try {
                const res = await fetch(`${API_URL}/api/customer/profile`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                  })
                });
                const data = await res.json();
                if (data.success) {
                  onUpdateUser(data.customer);
                  setSaveStatus('Cập nhật thành công!');
                } else {
                  setSaveStatus(data.message || 'Lỗi cập nhật');
                }
              } catch {
                setSaveStatus('Lỗi kết nối máy chủ');
              }
            }}
            className="bg-[#FF6B00] text-white px-6 py-3 rounded-lg hover:bg-[#E55D00] transition-colors font-semibold"
          >
            Lưu thay đổi
          </button>
          {saveStatus && (
            <span className={`ml-4 text-sm font-medium ${saveStatus.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
              {saveStatus}
            </span>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-gray-600" />
          Change Password
        </h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>
          <button className="bg-[#FF6B00] text-white px-6 py-3 rounded-lg hover:bg-[#E55D00] transition-colors font-semibold">
            Update Password
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-gray-600" />
          Notification Preferences
        </h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-white cursor-pointer">
              <div>
                <p className="font-semibold capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-gray-500">
                  {key === 'orderUpdates' && 'Get updates about your orders'}
                  {key === 'promotions' && 'Receive exclusive deals and discounts'}
                  {key === 'newsletter' && 'Weekly newsletter with new arrivals'}
                  {key === 'newProducts' && 'Notifications for new product launches'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                className="w-5 h-5 text-[#FF6B00] border-gray-300 rounded focus:ring-[#FF6B00]"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-gray-600" />
          Saved Payment Methods
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-semibold">Visa •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2027</p>
              </div>
            </div>
            <button className="text-red-600 hover:underline text-sm font-medium">Remove</button>
          </div>
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors font-medium">
            + Add New Payment Method
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
          Delete Account
        </button>
      </div>
    </div>
  );
}
