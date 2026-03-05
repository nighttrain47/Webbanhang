import { useState } from 'react';
import { 
  Search, Filter, Eye, Mail, Phone, MapPin, 
  ShoppingBag, Award, Calendar, TrendingUp, User 
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  status: 'active' | 'inactive';
}

export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const mockCustomers: Customer[] = [
    {
      id: 'CUST-001',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '+84 90 123 4567',
      address: 'Quận 1, TP. Hồ Chí Minh',
      joinDate: '2024-01-15',
      totalOrders: 12,
      totalSpent: 5420000,
      points: 54200,
      tier: 'Gold',
      status: 'active'
    },
    {
      id: 'CUST-002',
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '+84 91 234 5678',
      address: 'Quận Cầu Giấy, Hà Nội',
      joinDate: '2024-03-20',
      totalOrders: 8,
      totalSpent: 2150000,
      points: 21500,
      tier: 'Silver',
      status: 'active'
    },
    {
      id: 'CUST-003',
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '+84 92 345 6789',
      address: 'Quận 3, TP. Hồ Chí Minh',
      joinDate: '2025-06-10',
      totalOrders: 3,
      totalSpent: 780000,
      points: 7800,
      tier: 'Bronze',
      status: 'active'
    },
    {
      id: 'CUST-004',
      name: 'Phạm Thị D',
      email: 'phamthid@email.com',
      phone: '+84 93 456 7890',
      address: 'Quận Tân Bình, TP. Hồ Chí Minh',
      joinDate: '2023-11-05',
      totalOrders: 25,
      totalSpent: 12500000,
      points: 125000,
      tier: 'Platinum',
      status: 'active'
    },
    {
      id: 'CUST-005',
      name: 'Hoàng Văn E',
      email: 'hoangvane@email.com',
      phone: '+84 94 567 8901',
      address: 'Quận 7, TP. Hồ Chí Minh',
      joinDate: '2025-12-20',
      totalOrders: 1,
      totalSpent: 189000,
      points: 1890,
      tier: 'Bronze',
      status: 'active'
    }
  ];

  const [customers] = useState(mockCustomers);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || customer.tier === tierFilter;
    
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-amber-700';
      case 'Silver':
        return 'bg-gray-400';
      case 'Gold':
        return 'bg-yellow-500';
      case 'Platinum':
        return 'bg-purple-500';
      default:
        return 'bg-gray-400';
    }
  };

  const stats = [
    { label: 'Tổng khách hàng', value: customers.length, icon: User, color: 'blue' },
    { label: 'Khách hàng mới (tháng)', value: 3, icon: TrendingUp, color: 'green' },
    { label: 'Tổng đơn hàng', value: customers.reduce((sum, c) => sum + c.totalOrders, 0), icon: ShoppingBag, color: 'orange' },
    { label: 'Tổng doanh thu', value: `${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 1000000).toFixed(1)}tr`, icon: Award, color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
        <p className="text-gray-500 mt-1">Quản lý thông tin khách hàng và lịch sử mua hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-8 h-8 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'orange' ? 'text-orange-600' :
                  'text-purple-600'
                }`} />
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
          
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          >
            <option value="all">Tất cả hạng thành viên</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Liên hệ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hạng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Đơn hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tổng chi tiêu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Điểm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getTierColor(customer.tier)}`}>
                      {customer.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">{customer.totalOrders}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#FF9900]">
                      {customer.totalSpent.toLocaleString()}đ
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">
                      {customer.points.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

// Customer Detail Modal Component
function CustomerDetailModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const recentOrders = [
    { id: 'ORD-2026-124', date: '2026-02-07', total: 189000, status: 'Đang xử lý' },
    { id: 'ORD-2026-098', date: '2026-01-28', total: 225000, status: 'Đã giao' },
    { id: 'ORD-2026-067', date: '2026-01-15', total: 68000, status: 'Đã giao' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Chi tiết khách hàng</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{customer.name}</h3>
                <p className="text-sm opacity-90 mb-4">{customer.id}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${customer.tier === 'Bronze' ? 'bg-amber-700' : customer.tier === 'Silver' ? 'bg-gray-400' : customer.tier === 'Gold' ? 'bg-yellow-500' : 'bg-purple-500'}`}>
                    {customer.tier}
                  </span>
                  <span className="text-sm opacity-90">Thành viên từ {customer.joinDate}</span>
                </div>
              </div>
              <Award className="w-16 h-16 opacity-80" />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white border-opacity-30">
              <div>
                <p className="text-sm opacity-90">Tổng đơn</p>
                <p className="text-2xl font-bold">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Tổng chi tiêu</p>
                <p className="text-2xl font-bold">{(customer.totalSpent / 1000000).toFixed(1)}tr</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Điểm tích lũy</p>
                <p className="text-2xl font-bold">{customer.points.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold mb-4">Thông tin liên hệ</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Địa chỉ</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <h4 className="font-semibold mb-4">Đơn hàng gần đây</h4>
            <div className="space-y-2">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{order.total.toLocaleString()}đ</p>
                    <p className="text-xs text-green-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button className="flex-1 px-4 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] font-semibold">
              Gửi email
            </button>
            <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">
              Xem tất cả đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
