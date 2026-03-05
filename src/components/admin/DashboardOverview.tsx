import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Package, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

export default function DashboardOverview() {
  const stats = [
    {
      title: 'Doanh thu hôm nay',
      value: '15,240,000đ',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Đơn hàng mới',
      value: '24',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Khách hàng mới',
      value: '12',
      change: '-3.1%',
      trend: 'down',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Sản phẩm bán chạy',
      value: '156',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'orange'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-2026-124',
      customer: 'Nguyễn Văn A',
      product: 'Miku Hatsune 1/7 Scale Figure',
      amount: 189000,
      status: 'Đang xử lý',
      statusColor: 'yellow'
    },
    {
      id: 'ORD-2026-123',
      customer: 'Trần Thị B',
      product: 'Attack on Titan OST Collection',
      amount: 68000,
      status: 'Đã giao',
      statusColor: 'green'
    },
    {
      id: 'ORD-2026-122',
      customer: 'Lê Văn C',
      product: 'Rem: Crystal Dress Ver.',
      amount: 225000,
      status: 'Đang vận chuyển',
      statusColor: 'blue'
    },
    {
      id: 'ORD-2026-121',
      customer: 'Phạm Thị D',
      product: 'Nendoroid Nezuko',
      amount: 45000,
      status: 'Đã giao',
      statusColor: 'green'
    }
  ];

  const topProducts = [
    { name: 'Miku Hatsune 1/7 Scale Figure', sales: 45, revenue: 8505000 },
    { name: 'Rem: Crystal Dress Ver.', sales: 32, revenue: 7200000 },
    { name: 'Attack on Titan OST Collection', sales: 67, revenue: 4556000 },
    { name: 'Nendoroid Nezuko', sales: 89, revenue: 4005000 },
    { name: 'Demon Slayer Art Book', sales: 56, revenue: 3080000 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
        <p className="text-gray-500 mt-1">Thống kê tổng quan hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Đơn hàng gần đây</h2>
              <button className="text-[#FF9900] hover:underline text-sm font-medium">
                Xem tất cả
              </button>
            </div>
          </div>
          <div className="divide-y">
            {recentOrders.map((order, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-800">{order.id}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                        order.statusColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{order.amount.toLocaleString()}đ</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold">Sản phẩm bán chạy</h2>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-[#FF9900] font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{product.sales} đã bán</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs font-semibold text-[#FF9900]">
                      {product.revenue.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold mb-6">Doanh thu 7 ngày gần đây</h2>
        <div className="h-64 flex items-end justify-around gap-2">
          {[65, 45, 78, 52, 88, 72, 95].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gradient-to-t from-[#FF9900] to-[#FFB84D] rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer"
                   style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-500">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
