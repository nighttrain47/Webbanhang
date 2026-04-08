import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { 
  Search, Filter, Eye, Truck, CheckCircle, Clock, 
  XCircle, Package, MapPin, Phone, Mail, X, ChevronLeft, ChevronRight
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
  shippingMethod?: string;
  orderDate: string;
  trackingNumber?: string;
}

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        // Vẫn tải nhiều nhưng phân trang ở client
        const res = await fetch(`${API_URL}/api/admin/orders?limit=1000`, {
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
            subtotal: o.total - (o.shippingFee || 0),
            shipping: o.shippingFee || 0,
            total: o.total,
            status: o.status === 'confirmed' ? 'processing' : o.status,
            paymentMethod: o.paymentMethod || o.note || 'Thanh toán trực tiếp',
            shippingMethod: o.shippingMethod || 'Giao tiêu chuẩn',
            orderDate: new Date(o.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
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

  // Client-side pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset trang khi đổi filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', badgeClass: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20', icon: Clock };
      case 'processing': return { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', badgeClass: 'bg-blue-50 text-blue-700 ring-blue-700/10', icon: Package };
      case 'shipping': return { label: 'Đang vận chuyển', color: 'bg-purple-100 text-purple-800', badgeClass: 'bg-purple-50 text-purple-700 ring-purple-700/10', icon: Truck };
      case 'delivered': return { label: 'Đã giao', color: 'bg-green-100 text-green-800', badgeClass: 'bg-green-50 text-green-700 ring-green-600/20', icon: CheckCircle };
      case 'cancelled': return { label: 'Đã hủy', color: 'bg-red-100 text-red-800', badgeClass: 'bg-red-50 text-red-700 ring-red-600/10', icon: XCircle };
      default: return { label: status, color: 'bg-gray-100 text-gray-800', badgeClass: 'bg-gray-50 text-gray-600 ring-gray-500/10', icon: Clock };
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
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
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
    { label: 'Đang vận chuyển', value: orders.filter(o => o.status === 'shipping').length, color: 'purple' },
    { label: 'Đã giao', value: orders.filter(o => o.status === 'delivered').length, color: 'green' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${
              stat.color === 'blue' ? 'text-blue-600' :
              stat.color === 'yellow' ? 'text-amber-500' :
              stat.color === 'purple' ? 'text-purple-600' :
              'text-emerald-500'
            }`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn, khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400 hidden md:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.length > 0 ? paginatedOrders.map((order) => {
                const conf = getStatusConfig(order.status);
                return (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{order.customer.name}</span>
                        <span className="text-xs text-gray-500">{order.customer.phone || order.customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.orderDate}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{order.total.toLocaleString()}đ</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${conf.badgeClass}`}>
                        {conf.label}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Không có đơn hàng nào phù hợp</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-sm text-gray-500">
              Đang xem {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} trên tổng số {filteredOrders.length}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="font-medium text-gray-700">Trang {currentPage} / {totalPages}</div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Đơn hàng #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedOrder.orderDate}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                selectedOrder.status === 'pending' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' :
                selectedOrder.status === 'processing' ? 'bg-blue-50 border-blue-100 text-blue-800' :
                selectedOrder.status === 'shipping' ? 'bg-purple-50 border-purple-100 text-purple-800' :
                selectedOrder.status === 'delivered' ? 'bg-green-50 border-green-100 text-green-800' :
                'bg-red-50 border-red-100 text-red-800'
              }`}>
                {(() => { const statusConfig = getStatusConfig(selectedOrder.status); const Icon = statusConfig.icon; return <Icon className="w-6 h-6" />; })()}
                <div>
                  <p className="font-bold">{getStatusConfig(selectedOrder.status).label}</p>
                  <p className="text-sm opacity-80 mt-0.5">Vui lòng kiểm tra kỹ thông tin liên hệ và sản phẩm trước khi xử lý.</p>
                </div>
              </div>

              {/* Layout Infos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-gray-800">
                    <MapPin className="w-4 h-4 text-gray-400" /> Thông tin giao hàng
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-3 border border-gray-100">
                    <div className="flex gap-2">
                      <span className="text-gray-500 font-medium w-20">Khách hàng:</span>
                      <span className="font-semibold text-gray-900">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 font-medium w-20">Điện thoại:</span>
                      <span className="text-gray-900">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 font-medium w-20">Địa chỉ:</span>
                      <span className="text-gray-900">{selectedOrder.customer.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-gray-800">
                    <Truck className="w-4 h-4 text-gray-400" /> Thanh toán & Vận chuyển
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-3 border border-gray-100">
                    <div className="flex gap-2">
                      <span className="text-gray-500 font-medium w-20">Thanh toán:</span>
                      <span className="font-semibold text-gray-900">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 font-medium w-20">Vận chuyển:</span>
                      <span className="text-gray-900">{selectedOrder.shippingMethod}</span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="flex gap-2">
                        <span className="text-gray-500 font-medium w-20">Mã vận đơn:</span>
                        <span className="font-mono text-blue-600 font-bold tracking-wider">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h3 className="font-bold flex items-center gap-2 mb-3 text-gray-800">
                  <Package className="w-4 h-4 text-gray-400" /> Chi tiết sản phẩm
                </h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Tên sản phẩm</th>
                        <th className="py-3 px-4 font-semibold text-center">SL</th>
                        <th className="py-3 px-4 font-semibold text-right">Đơn giá</th>
                        <th className="py-3 px-4 font-semibold text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                          <td className="py-3 px-4 text-center">{item.quantity}</td>
                          <td className="py-3 px-4 text-right">{item.price.toLocaleString()}đ</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Summary */}
                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex flex-col gap-2 items-end text-sm">
                    <div className="w-64 flex justify-between">
                      <span className="text-gray-500">Tạm tính:</span>
                      <span className="font-semibold text-gray-900">{selectedOrder.subtotal.toLocaleString()}đ</span>
                    </div>
                    <div className="w-64 flex justify-between">
                      <span className="text-gray-500">Phí vận chuyển:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedOrder.shipping === 0 ? <span className="text-emerald-500">Miễn phí</span> : `${selectedOrder.shipping.toLocaleString()}đ`}
                      </span>
                    </div>
                    <div className="w-64 flex justify-between text-base mt-2 pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-900">TỔNG CỘNG:</span>
                      <span className="font-bold text-blue-600">{selectedOrder.total.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer / Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end rounded-b-2xl">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="px-4 py-2 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Đóng
              </button>
              
              {selectedOrder.status === 'pending' && (
                <>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')} 
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-semibold transition-colors"
                  >
                    Huỷ đơn
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')} 
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" /> Xác nhận đơn
                  </button>
                </>
              )}
              {selectedOrder.status === 'processing' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'shipping')} 
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition-colors"
                >
                  <Truck className="w-5 h-5" /> Chuyển sang vận chuyển
                </button>
              )}
              {selectedOrder.status === 'shipping' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')} 
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" /> Đánh dấu đã giao
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

