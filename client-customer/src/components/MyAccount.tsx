import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Link, useNavigate } from 'react-router';
import {
  User, Package, Heart, Award, Settings, LogOut, Star, TrendingUp,
  MapPin, Phone, Mail, Globe, Calendar, Shield, Bell, CreditCard,
  Truck, CheckCircle, Clock, AlertCircle, Eye, Search, Filter, Trash2
} from 'lucide-react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import ProductCard from './product/ProductCard';
import { Product } from '../App';

interface MyAccountProps {
  user: any;
  token: string;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onUpdateUser: (updatedUser: any) => void;
  wishlist: string[];
  cartCount: number;
  toggleWishlist?: (productId: string) => void;
  addToCart?: (product: Product) => void;
}

type ActiveTab = 'profile' | 'orders' | 'wishlist' | 'points' | 'settings';

export default function MyAccount({ user, token, onLogout, onDeleteAccount, onUpdateUser, wishlist, cartCount, toggleWishlist, addToCart }: MyAccountProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'>('all');
  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Fetch profile to ensure fresh data (createdAt, phone, etc.)
  useEffect(() => {
    if (user && token) {
      fetch(`${API_URL}/api/customer/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.customer) {
            onUpdateUser(data.customer);
          }
        })
        .catch(() => {});
    }
  }, [token]);

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
          <Link to="/login" className="text-orange-600 hover:underline">
            Đăng nhập
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const userPoints = user.points || 0;

  const membershipTiers = [
    { name: 'Cấp 3', minPoints: 0, maxPoints: 9999, color: 'bg-amber-700', benefits: ['Hoàn 1% điểm', 'Hỗ trợ tiêu chuẩn'] },
    { name: 'Cấp 2', minPoints: 10000, maxPoints: 29999, color: 'bg-gray-400', benefits: ['Giảm 2% hóa đơn', 'Hoàn 1.5% điểm', 'Hỗ trợ ưu tiên', 'Thưởng sinh nhật'] },
    { name: 'Cấp 1', minPoints: 30000, maxPoints: 99999, color: 'bg-yellow-500', benefits: ['Giảm 5% hóa đơn', 'Hoàn 2% điểm', 'Hỗ trợ VIP', 'Truy cập sớm', 'Giao hàng nhanh miễn phí'] },
    { name: 'Đặc Cấp', minPoints: 100000, maxPoints: Infinity, color: 'bg-purple-500', benefits: ['Giảm 8% hóa đơn', 'Hoàn 3% điểm', 'Hỗ trợ chuyên biệt', 'Sản phẩm độc quyền', 'Giao hàng toàn cầu miễn phí'] }
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

  // Mock Data mappings (progressive points calculation)
  let runningPoints = 0;
  const sortedRealOrders = [...realOrders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  const mappedOrdersSorted = sortedRealOrders.map(order => {
    let rate = 0.01;
    if (runningPoints >= 100000) rate = 0.03;
    else if (runningPoints >= 30000) rate = 0.02;
    else if (runningPoints >= 10000) rate = 0.015;
    
    const earned = Math.floor(order.total * rate);
    if (order.status === 'delivered') runningPoints += earned;

    return {
      id: order._id,
      date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
      status: statusMap[order.status] || order.status,
      statusColor: statusColorMap[order.status] || 'gray',
      total: order.total,
      items: order.items?.length || 0,
      pointsEarned: earned,
      shippingAddress: order.shippingAddress || '',
      paymentMethod: order.paymentMethod || order.note || 'Thanh toán trực tiếp',
      trackingNumber: order.status === 'shipping' ? 'Đang vận chuyển' : (order.status === 'pending' ? 'Chờ xử lý' : ''),
      products: (order.items || []).map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      originalOrder: order
    };
  });

  const mappedOrders = realOrders.map(ro => mappedOrdersSorted.find(mo => mo.id === ro._id)!);

  const filteredOrders = orderFilter === 'all'
    ? mappedOrders
    : mappedOrders.filter(order => {
      const originalOrder = realOrders.find(o => o._id === order.id);
      return originalOrder?.status === orderFilter;
    });

  const monthlyPoints = mappedOrdersSorted
    .filter(o => o.originalOrder.status === 'delivered' && new Date(o.originalOrder.createdAt).getMonth() === new Date().getMonth() && new Date(o.originalOrder.createdAt).getFullYear() === new Date().getFullYear())
    .reduce((sum, o) => sum + o.pointsEarned, 0);

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
        return <ProfileSection user={{ ...user, points: userPoints }} currentTier={currentTier} nextTier={nextTier} pointsToNextTier={pointsToNextTier} mockOrders={mappedOrders} wishlist={wishlist} monthlyPoints={monthlyPoints} token={token} />;

      case 'orders':
        return <OrdersSection orders={filteredOrders} orderFilter={orderFilter} setOrderFilter={setOrderFilter} isLoading={ordersLoading} />;

      case 'wishlist':
        return <WishlistSection wishlistProducts={wishlistProducts} toggleWishlist={toggleWishlist} addToCart={addToCart} wishlist={wishlist} />;

      case 'points':
        return <PointsSection user={{ ...user, points: userPoints }} currentTier={currentTier} nextTier={nextTier} pointsToNextTier={pointsToNextTier} pointsHistory={pointsHistory} membershipTiers={membershipTiers} monthlyPoints={monthlyPoints} />;

      case 'settings':
        return <SettingsSection user={user} token={token} onUpdateUser={onUpdateUser} onDeleteAccount={onDeleteAccount} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.875rem)' }}>Tài khoản của tôi</h1>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden" style={{ marginBottom: '24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px', minWidth: 'max-content' }}>
            {[
              { key: 'profile' as ActiveTab, icon: <User className="w-4 h-4" />, label: 'Tổng quan' },
              { key: 'orders' as ActiveTab, icon: <Package className="w-4 h-4" />, label: 'Đơn hàng' },
              { key: 'wishlist' as ActiveTab, icon: <Heart className="w-4 h-4" />, label: 'Yêu thích' },
              { key: 'points' as ActiveTab, icon: <Award className="w-4 h-4" />, label: 'Điểm' },
              { key: 'settings' as ActiveTab, icon: <Settings className="w-4 h-4" />, label: 'Cài đặt' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab.key ? '#FFF7ED' : '#f3f4f6',
                  color: activeTab === tab.key ? '#ea580c' : '#4b5563',
                  transition: 'all 150ms',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: 'pointer',
                background: '#FEF2F2',
                color: '#dc2626',
              }}
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block" style={{ width: '280px', flexShrink: 0 }}>
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ position: 'sticky', top: '96px', zIndex: 0 }}>
              <div className="text-center mb-6">
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff7d36, #ffaa5b)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#fff', fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', boxShadow: '0 8px 24px rgba(255,125,54,0.25)' }}>
                  {user.name ? user.name.charAt(0) : 'U'}
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <User className="w-5 h-5" />
                  <span>Tổng quan</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Đơn hàng</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'wishlist' ? 'bg-orange-50 text-orange-600' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Yêu thích ({wishlist.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('points')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'points' ? 'bg-orange-50 text-orange-600' : 'hover:bg-white text-gray-700'
                    }`}
                >
                  <Award className="w-5 h-5" />
                  <span>Điểm thưởng</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-orange-50 text-orange-600' : 'hover:bg-white text-gray-700'
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
          <div style={{ flex: 1, minWidth: 0 }}>
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Profile Section Component
function ProfileSection({ user, currentTier, nextTier, pointsToNextTier, mockOrders, wishlist, monthlyPoints, token }: any) {
  const userPoints = user.points || 0;
  const [defaultAddress, setDefaultAddress] = useState<string>('');

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/customer/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.addresses) {
          const defaultAdd = data.addresses.find((a: any) => a.isDefault);
          if (defaultAdd) {
            setDefaultAddress(`${defaultAdd.address}, ${defaultAdd.city}`);
          }
        }
      })
      .catch(() => {});
    }
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Tổng điểm</p>
            <p className="text-4xl font-bold">{userPoints.toLocaleString()}</p>
            <p className="text-sm opacity-90 mt-1">≈ {userPoints.toLocaleString()}đ giá trị</p>
          </div>
          <Award className="w-12 h-12 opacity-80" />
        </div>

        {nextTier && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Tiến tới hạng {nextTier.name}</span>
              <span>Còn {pointsToNextTier.toLocaleString()} điểm</span>
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
            <p className="text-sm opacity-90">Tổng tích lũy</p>
            <p className="text-xl font-bold">{userPoints.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Tháng này</p>
            <p className="text-xl font-bold">+{monthlyPoints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng đơn hàng</p>
              <p className="text-2xl font-bold">{mockOrders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sản phẩm yêu thích</p>
              <p className="text-2xl font-bold">{wishlist.length}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Thành viên từ</p>
              <p className="text-2xl font-bold">{user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Thông tin tài khoản</h2>
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
              <p className="text-sm text-gray-500">Thành viên từ</p>
              <p className="font-semibold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Địa chỉ mặc định</p>
              <p className="font-semibold text-gray-800">{defaultAddress || user.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-semibold">{user.phone || <span className="text-gray-400">Chưa cập nhật</span>}</p>
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
          <h2 className="text-xl font-bold">Lịch sử đơn hàng</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Lọc:</span>
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
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={
                  orderFilter === filter
                    ? { backgroundColor: '#ea580c', color: 'white' }
                    : { backgroundColor: '#f3f4f6', color: '#4b5563' }
                }
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Không tìm thấy đơn hàng</p>
          <p className="text-sm text-gray-500 mt-2">Hãy thử điều chỉnh bộ lọc</p>
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
                    <p className="text-gray-500">Sản phẩm</p>
                    <p className="font-semibold">{order.items}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tổng cộng</p>
                    <p className="font-semibold">{order.total.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Điểm nhận được</p>
                    <p className="font-semibold text-orange-600">+{order.pointsEarned}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Thanh toán</p>
                    <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Theo dõi</p>
                    <p className="font-semibold text-xs">{order.trackingNumber}</p>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              <div className="p-6">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="flex items-center gap-2 text-orange-600 hover:underline font-medium mb-4"
                >
                  <Eye className="w-4 h-4" />
                  {expandedOrder === order.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                </button>

                {expandedOrder === order.id && (
                  <div className="space-y-4">
                    {/* Products */}
                    <div>
                      <h4 className="font-semibold mb-3">Sản phẩm:</h4>
                      <div className="space-y-2">
                        {order.products.map((product: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">SL: {product.quantity}</p>
                            </div>
                            <p className="font-semibold">{product.price.toLocaleString()}đ</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h4 className="font-semibold mb-2">Địa chỉ giao hàng:</h4>
                      <p className="text-gray-600">{order.shippingAddress}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      {order.status === 'Shipping' && (
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                          Theo dõi đơn hàng
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <button className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium">
                          Đánh giá
                        </button>
                      )}
                      <button
                        onClick={() => window.location.href = `mailto:support@figurecurator.vn?subject=Hỗ trợ đơn hàng #${order.id}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium"
                      >
                        Liên hệ hỗ trợ
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
          <h2 className="text-xl font-bold">Danh sách yêu thích</h2>
          <div className="flex items-center gap-2 text-gray-500">
            <Heart className="w-5 h-5" />
            <span className="font-semibold">{wishlistProducts.length} sản phẩm</span>
          </div>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">Danh sách yêu thích trống</p>
          <p className="text-sm text-gray-500 mb-6">Hãy thêm những sản phẩm bạn yêu thích!</p>
          <Link
            to="/"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            Khám phá sản phẩm
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
              user={true} // User is always logged in in MyAccount
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Points Section Component
function PointsSection({ user, currentTier, nextTier, pointsToNextTier, pointsHistory, membershipTiers, monthlyPoints }: any) {
  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm opacity-90 mb-2">Tổng hạng điểm</p>
            <p className="text-5xl font-bold mb-2">{user.points.toLocaleString()}</p>
            <p className="text-sm opacity-90">Hạn mức chiết khấu hiện tại: {user.points >= 100000 ? 8 : user.points >= 30000 ? 5 : user.points >= 10000 ? 2 : 0}% trên Hóa đơn</p>
          </div>
          <Award className="w-16 h-16 opacity-80" />
        </div>

        {nextTier && (
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm mb-3">
              <span>Tiến tới hạng {nextTier.name}</span>
              <span className="font-bold">Cần {pointsToNextTier.toLocaleString()} điểm</span>
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
        <h2 className="text-xl font-bold mb-6">Hạng thành viên</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {membershipTiers.map((tier: any) => (
            <div
              key={tier.name}
              className={`border-2 rounded-lg p-4 transition-all ${tier.name === currentTier.name
                ? 'border-orange-600 bg-orange-50'
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
                      {tier.minPoints.toLocaleString()}{tier.maxPoints === Infinity ? '+' : ` - ${tier.maxPoints.toLocaleString()}`} điểm
                    </p>
                  </div>
                </div>
                {tier.name === currentTier.name && (
                  <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Hiện tại
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
          <h2 className="text-xl font-bold">Lịch sử điểm</h2>
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
          Cách tích điểm
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Tích lũy 1-3% điểm trên mỗi đơn hàng tùy theo hạng thành viên</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>1 điểm = 1đ giảm giá khi quy đổi</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Sử dụng tối đa 10% giá trị đơn hàng bằng điểm</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Điểm hết hạn sau 1 năm kể từ ngày tích lũy</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Điểm thưởng vào tháng sinh nhật và các chương trình khuyến mãi đặc biệt</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection({ user, token, onUpdateUser, onDeleteAccount }: any) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saveStatus, setSaveStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Address Management
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Payment Management
  const [payments, setPayments] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'credit-card',
    provider: 'Visa',
    cardNumber: '',
    expiryDate: '',
    nameOnCard: '',
  });

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/customer/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.addresses) {
          setAddresses(data.addresses);
        }
      })
      .catch(console.error);

      // Fetch payment methods
      fetch(`${API_URL}/api/customer/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.payments) {
          setPayments(data.payments);
        }
      })
      .catch(console.error);
    }
  }, [token]);

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city) return;
    try {
      const isDefault = addresses.length === 0;
      const res = await fetch(`${API_URL}/api/customer/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newAddress, isDefault, label: 'Nhà riêng' }),
      });
      const data = await res.json();
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
        setNewAddress({ fullName: '', phone: '', address: '', city: '', postalCode: '' });
        setShowAddressModal(false);
      } else {
        alert(data.message || 'Không thể lưu địa chỉ');
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/customer/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/customer/addresses/${id}/default`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleAddPayment = async () => {
    if (!newPayment.cardNumber || !newPayment.nameOnCard || !newPayment.expiryDate) {
      alert('Vui lòng điền đầy đủ thông tin thẻ');
      return;
    }
    try {
      const isDefault = payments.length === 0;
      const last4 = newPayment.cardNumber.length > 4 ? `**** **** **** ${newPayment.cardNumber.slice(-4)}` : `**** ${newPayment.cardNumber}`;
      const res = await fetch(`${API_URL}/api/customer/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newPayment, cardNumber: last4, isDefault }),
      });
      const data = await res.json();
      if (data.success && data.payments) {
        setPayments(data.payments);
        setNewPayment({ type: 'credit-card', provider: 'Visa', cardNumber: '', expiryDate: '', nameOnCard: '' });
        setShowPaymentModal(false);
      } else {
        alert(data.message || 'Không thể lưu phương thức thanh toán');
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) return;
    try {
      const res = await fetch(`${API_URL}/api/customer/payments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.payments) {
        setPayments(data.payments);
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleSetDefaultPayment = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/customer/payments/${id}/default`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.payments) {
        setPayments(data.payments);
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    newProducts: true
  });

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 10 }}>
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Thông tin cá nhân</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
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
              style={{ backgroundColor: '#FF6B00', color: '#fff', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', border: 'none', transition: 'background-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E55D00')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF6B00')}
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => {
                setFormData({
                  name: user.name || '',
                  email: user.email || '',
                  phone: user.phone || '',
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
                setSaveStatus('');
              }}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Huỷ
            </button>
          </div>
          {saveStatus && (
            <p className={`mt-3 text-sm font-medium ${saveStatus.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
              {saveStatus}
            </p>
          )}
        </div>
      </div>

      {/* Address Book */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gray-600" />
            Sổ địa chỉ
          </h2>
          <button
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
          >
            + Thêm địa chỉ mới
          </button>
        </div>
        
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm">Bạn chưa có địa chỉ nào lưu trong sổ.</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr._id || addr.id} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-semibold text-gray-900">{addr.fullName}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600">{addr.phone}</span>
                      {addr.isDefault && (
                        <span className="text-white text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: '#FF6B00' }}>
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {addr.address}, {addr.city} {addr.postalCode && `- ${addr.postalCode}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr._id || addr.id)}
                        className="text-orange-600 font-medium hover:underline text-sm whitespace-nowrap"
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(addr._id || addr.id)}
                      className="text-gray-400 font-medium hover:text-red-600 text-sm whitespace-nowrap"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Methods Book */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-600">credit_card</span>
            Phương thức thanh toán
          </h2>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
          >
            + Thêm thẻ mới
          </button>
        </div>
        
        <div className="space-y-4">
          {payments.length === 0 ? (
            <p className="text-gray-500 text-sm">Bạn chưa có phương thức thanh toán nào.</p>
          ) : (
            payments.map((pay) => (
              <div key={pay._id || pay.id} className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{pay.provider}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600 font-mono">{pay.cardNumber}</span>
                    {pay.isDefault && (
                      <span className="text-white text-xs px-2 py-1 rounded font-semibold ml-2" style={{ backgroundColor: '#FF6B00' }}>
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                    Chủ thẻ: {pay.nameOnCard} {pay.expiryDate && `| Hết hạn: ${pay.expiryDate}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 md:justify-end text-sm">
                  {!pay.isDefault && (
                    <button
                      onClick={() => handleSetDefaultPayment(pay._id || pay.id)}
                      className="text-orange-600 font-medium hover:underline"
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePayment(pay._id || pay.id)}
                    className="text-gray-500 font-medium hover:text-red-600"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-gray-600" />
          Đổi mật khẩu
        </h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
          </div>
          {passwordStatus && (
            <p className={`text-sm font-medium mb-3 ${passwordStatus.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
              {passwordStatus}
            </p>
          )}
          <div className="flex gap-3">
            <button
              disabled={passwordLoading}
              onClick={async () => {
                setPasswordStatus('');
                if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
                  setPasswordStatus('Vui lòng điền đầy đủ các trường');
                  return;
                }
                if (formData.newPassword.length < 6) {
                  setPasswordStatus('Mật khẩu mới phải có ít nhất 6 ký tự');
                  return;
                }
                if (formData.newPassword !== formData.confirmPassword) {
                  setPasswordStatus('Mật khẩu xác nhận không khớp');
                  return;
                }
                setPasswordLoading(true);
                try {
                  const res = await fetch(`${API_URL}/api/customer/change-password`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ currentPassword: formData.currentPassword, newPassword: formData.newPassword })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setPasswordStatus('Đổi mật khẩu thành công!');
                    setFormData(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
                  } else {
                    setPasswordStatus(data.message || 'Đổi mật khẩu thất bại');
                  }
                } catch {
                  setPasswordStatus('Lỗi kết nối máy chủ');
                } finally {
                  setPasswordLoading(false);
                }
              }}
              style={{ backgroundColor: '#FF6B00', color: '#fff', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', border: 'none', opacity: passwordLoading ? 0.6 : 1 }}
            >
              {passwordLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
            <button
              onClick={() => {
                setFormData(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
                setPasswordStatus('');
              }}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Huỷ
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-gray-600" />
          Tùy chọn thông báo
        </h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-white cursor-pointer">
              <div>
                <p className="font-semibold capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-gray-500">
                  {key === 'orderUpdates' && 'Nhận cập nhật về đơn hàng của bạn'}
                  {key === 'promotions' && 'Nhận ưu đãi và giảm giá độc quyền'}
                  {key === 'newsletter' && 'Bản tin hàng tuần về sản phẩm mới'}
                  {key === 'newProducts' && 'Thông báo khi có sản phẩm mới ra mắt'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-600"
              />
            </label>
          ))}
        </div>
      </div>


      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
          <Trash2 className="w-6 h-6" />
          Vùng nguy hiểm
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Khi bạn xóa tài khoản, tất cả dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục lại. Hãy cân nhắc kỹ.
        </p>
        {deleteError && (
          <p className="text-sm text-red-600 mb-3 font-medium">{deleteError}</p>
        )}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Xóa tài khoản
          </button>
        ) : (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-3">Bạn có chắc chắn muốn xóa tài khoản?</p>
            <p className="text-sm text-red-700 mb-4">Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.</p>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  setDeleteLoading(true);
                  setDeleteError('');
                  try {
                    const res = await fetch(`${API_URL}/api/customer/profile`, {
                      method: 'DELETE',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success) {
                      onDeleteAccount();
                      navigate('/');
                    } else {
                      setDeleteError(data.message || 'Không thể xóa tài khoản');
                    }
                  } catch {
                    setDeleteError('Lỗi kết nối máy chủ');
                  } finally {
                    setDeleteLoading(false);
                  }
                }}
                disabled={deleteLoading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xóa...
                  </>
                ) : (
                  'Xác nhận xóa'
                )}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ ADD ADDRESS MODAL ═══ */}
      {showAddressModal && (
        <>
          <div
            onClick={() => setShowAddressModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%', maxWidth: '480px', background: '#fff', borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 101,
          }} className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Thêm địa chỉ</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Họ và tên *</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Địa chỉ *</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))}
                  placeholder="Số nhà, đường, phường/xã"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Thành phố *</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mã bưu điện</label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={e => setNewAddress(p => ({ ...p, postalCode: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddAddress}
                className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
                style={{ backgroundColor: '#FF6B00', transition: 'background-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E55D00')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF6B00')}
              >
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══ ADD PAYMENT MODAL ═══ */}
      {showPaymentModal && (
        <>
          <div
            onClick={() => setShowPaymentModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%', maxWidth: '480px', background: '#fff', borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 101,
          }} className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Thêm thẻ thanh toán</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Loại thẻ / Ngân hàng *</label>
                <select
                  value={newPayment.provider}
                  onChange={e => setNewPayment(p => ({ ...p, provider: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600 bg-white"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="JCB">JCB</option>
                  <option value="Napas">Thẻ ATM Nội địa (Napas)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Số thẻ *</label>
                <input
                  type="text"
                  value={newPayment.cardNumber}
                  onChange={e => setNewPayment(p => ({ ...p, cardNumber: e.target.value.replace(/\D/g, '') }))}
                  placeholder="4123 4567 8901 2345"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tên in trên thẻ *</label>
                  <input
                    type="text"
                    value={newPayment.nameOnCard}
                    onChange={e => setNewPayment(p => ({ ...p, nameOnCard: e.target.value.toUpperCase() }))}
                    placeholder="NGUYEN VAN A"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ngày hết hạn *</label>
                  <input
                    type="text"
                    value={newPayment.expiryDate}
                    onChange={e => setNewPayment(p => ({ ...p, expiryDate: e.target.value }))}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddPayment}
                className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
                style={{ backgroundColor: '#FF6B00', transition: 'background-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E55D00')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FF6B00')}
              >
                Lưu thẻ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
