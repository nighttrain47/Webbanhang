import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { 
  Search, Filter, Eye, Truck, CheckCircle, Clock, 
  XCircle, Package, MapPin, Phone, Mail, ChevronDown 
} from 'lucide-react';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: string;
  orderDate: string;
  trackingNumber?: string;
}

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_URL}/api/admin/orders?limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.orders) {
          const fetchedOrders = data.orders.map((o: any) => ({
            id: o._id,
            customer: {
              name: o.customer?.name || 'Khách vãng lai',
              email: o.customer?.email || '',
              phone: o.customer?.phone || '',
              address: o.shippingAddress || '',
            },
            items: o.items.map((i: any) => ({
              name: i.name || 'Sản phẩm',
              quantity: i.quantity || 1,
              price: i.price || 0,
            })),
            subtotal: o.total,
            shipping: 0,
            total: o.total,
            status: o.status === 'confirmed' ? 'processing' : o.status,
            paymentMethod: o.paymentMethod || o.note || 'Thanh toán khi nhận hàng',
            orderDate: new Date(o.createdAt).toLocaleDateString('vi-VN'),
          }));
          setOrders(fetchedOrders);
        }
      } catch (err) {
        console.error('Lỗi fetch đơn hàng:', err);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Chờ xác nhận', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock 
        };
      case 'processing':
        return { 
          label: 'Đang xử lý', 
          color: 'bg-blue-100 text-blue-800',
          icon: Package 
        };
      case 'shipping':
        return { 
          label: 'Đang vận chuyển', 
          color: 'bg-purple-100 text-purple-800',
          icon: Truck 
        };
      case 'delivered':
        return { 
          label: 'Đã giao', 
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle 
        };
      case 'cancelled':
        return { 
          label: 'Đã hủy', 
          color: 'bg-red-100 text-red-800',
          icon: XCircle 
        };
      default:
        return { 
          label: status, 
          color: 'bg-gray-100 text-gray-800',
          icon: Clock 
        };
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const token = localStorage.getItem('adminToken');
      const backendStatus = newStatus === 'processing' ? 'confirmed' : newStatus;
      
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: backendStatus })
      });
      
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('Cập nhật trạng thái thất bại');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi cập nhật trạng thái');
    }
  };

  const stats = [
    { label: 'Tổng đơn hàng', value: orders.length, color: 'blue' },
    { label: 'Chờ xác nhận', value: orders.filter(o => o.status === 'pending').length, color: 'yellow' },
    { label: 'Đang xử lý', value: orders.filter(o => o.status === 'processing').length, color: 'purple' },
    { label: 'Đã giao', value: orders.filter(o => o.status === 'delivered').length, color: 'green' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
        <p className="text-gray-500 mt-1">Quản lý và theo dõi đơn hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${
              stat.color === 'blue' ? 'text-blue-600' :
              stat.color === 'yellow' ? 'text-yellow-600' :
              stat.color === 'purple' ? 'text-purple-600' :
              'text-green-600'
            }`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang vận chuyển</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{order.orderDate}</p>
                  </div>
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="flex items-center gap-2 text-[#FF9900] hover:underline font-medium"
                  >
                    {isExpanded ? 'Thu gọn' : 'Chi tiết'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Khách hàng</p>
                    <p className="font-semibold text-gray-800">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Số sản phẩm</p>
                    <p className="font-semibold text-gray-800">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Tổng tiền</p>
                    <p className="font-semibold text-[#FF9900]">{order.total.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Thanh toán</p>
                    <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Thông tin khách hàng
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium">{order.customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Số điện thoại</p>
                          <p className="text-sm font-medium">{order.customer.phone}</p>
                        </div>
                      </div>
                      <div className="md:col-span-2 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                          <p className="text-sm font-medium">{order.customer.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      Sản phẩm
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-semibold">{order.subtotal.toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="font-semibold">
                          {order.shipping === 0 ? (
                            <span className="text-green-600">MIỄN PHÍ</span>
                          ) : (
                            `${order.shipping.toLocaleString()}đ`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Tổng cộng:</span>
                        <span className="text-[#FF9900]">{order.total.toLocaleString()}đ</span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        Vận chuyển
                      </h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Mã vận đơn</p>
                        <p className="font-mono font-semibold text-blue-600">{order.trackingNumber}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="flex-1 px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] font-semibold"
                        >
                          Xác nhận đơn
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-semibold"
                        >
                          Hủy đơn
                        </button>
                      </>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipping')}
                        className="flex-1 px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] font-semibold"
                      >
                        Chuyển sang vận chuyển
                      </button>
                    )}
                    {order.status === 'shipping' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex-1 px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] font-semibold"
                      >
                        Đánh dấu đã giao
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
