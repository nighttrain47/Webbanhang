import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Package, Calendar, Download, BarChart3 
} from 'lucide-react';

export default function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('revenue');

  const revenueData = [
    { date: '01/02', revenue: 2450000, orders: 12, avgOrder: 204167 },
    { date: '02/02', revenue: 1890000, orders: 9, avgOrder: 210000 },
    { date: '03/02', revenue: 3250000, orders: 15, avgOrder: 216667 },
    { date: '04/02', revenue: 2100000, orders: 11, avgOrder: 190909 },
    { date: '05/02', revenue: 3680000, orders: 18, avgOrder: 204444 },
    { date: '06/02', revenue: 2980000, orders: 14, avgOrder: 212857 },
    { date: '07/02', revenue: 4120000, orders: 20, avgOrder: 206000 }
  ];

  const topProducts = [
    { 
      name: 'Miku Hatsune 1/7 Scale Figure', 
      category: 'Figures',
      sold: 45, 
      revenue: 8505000,
      growth: 12.5 
    },
    { 
      name: 'Rem: Crystal Dress Ver.', 
      category: 'Figures',
      sold: 32, 
      revenue: 7200000,
      growth: 8.3 
    },
    { 
      name: 'Attack on Titan OST Collection', 
      category: 'CDs',
      sold: 67, 
      revenue: 4556000,
      growth: 15.2 
    },
    { 
      name: 'Nendoroid Nezuko', 
      category: 'Figures',
      sold: 89, 
      revenue: 4005000,
      growth: -2.1 
    },
    { 
      name: 'Demon Slayer Art Book', 
      category: 'Goods',
      sold: 56, 
      revenue: 3080000,
      growth: 5.7 
    }
  ];

  const categoryBreakdown = [
    { category: 'Figures', revenue: 19710000, percentage: 55, orders: 76 },
    { category: 'CDs', revenue: 8130000, percentage: 23, orders: 98 },
    { category: 'Goods', revenue: 7890000, percentage: 22, orders: 65 }
  ];

  const stats = [
    {
      title: 'Tổng doanh thu (7 ngày)',
      value: '20,470,000đ',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Đơn hàng (7 ngày)',
      value: '99',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Giá trị đơn TB',
      value: '206,768đ',
      change: '+3.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Sản phẩm đã bán',
      value: '289',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'orange'
    }
  ];

  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
          <p className="text-gray-500 mt-1">Phân tích doanh thu và hiệu suất kinh doanh</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF9900] text-white px-4 py-3 rounded-lg hover:bg-[#E68A00] font-semibold">
          <Download className="w-5 h-5" />
          Xuất báo cáo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng thời gian
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="6months">6 tháng qua</option>
              <option value="1year">1 năm qua</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại báo cáo
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            >
              <option value="revenue">Doanh thu</option>
              <option value="orders">Đơn hàng</option>
              <option value="products">Sản phẩm</option>
              <option value="customers">Khách hàng</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              So sánh với
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]">
              <option value="previous">Kỳ trước</option>
              <option value="lastYear">Cùng kỳ năm trước</option>
            </select>
          </div>
        </div>
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
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Doanh thu theo ngày</h2>
              <p className="text-sm text-gray-500 mt-1">
                Tổng: {totalRevenue.toLocaleString()}đ
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="h-80 flex items-end justify-around gap-2">
            {revenueData.map((day, index) => {
              const height = (day.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      <p className="font-semibold">{day.revenue.toLocaleString()}đ</p>
                      <p className="text-gray-300">{day.orders} đơn hàng</p>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                    
                    <div 
                      className="w-full bg-gradient-to-t from-[#FF9900] to-[#FFB84D] rounded-t-lg hover:opacity-80 transition-all cursor-pointer"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">{day.date}</p>
                    <p className="text-xs font-semibold text-gray-700 mt-0.5">{day.orders}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold mb-6">Phân loại theo danh mục</h2>
          <div className="space-y-6">
            {categoryBreakdown.map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{cat.category}</p>
                    <p className="text-xs text-gray-500">{cat.orders} đơn hàng</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{cat.percentage}%</p>
                    <p className="text-xs text-gray-500">{cat.revenue.toLocaleString()}đ</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#FF9900] to-[#FFB84D] h-2 rounded-full transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-800">Tổng cộng</p>
                <p className="font-bold text-[#FF9900]">
                  {categoryBreakdown.reduce((sum, cat) => sum + cat.revenue, 0).toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold">Sản phẩm bán chạy nhất</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Xếp hạng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Danh mục</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Đã bán</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Doanh thu</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tăng trưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-[#FF9900] font-bold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{product.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">{product.sold}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#FF9900]">
                      {product.revenue.toLocaleString()}đ
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-sm font-semibold ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Tỷ lệ hoàn thành đơn</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">94.5%</p>
          <p className="text-sm text-gray-500">93/99 đơn đã giao thành công</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.5%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Khách hàng quay lại</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">68%</p>
          <p className="text-sm text-gray-500">Khách hàng mua lại trong 30 ngày</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Thời gian xử lý TB</h3>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">2.3h</p>
          <p className="text-sm text-gray-500">Từ đặt hàng đến xác nhận</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Giảm 15% so với tháng trước
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
