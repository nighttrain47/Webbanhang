import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Package, Calendar, Download, BarChart3 
} from 'lucide-react';

export default function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('revenue');

  const [reportsData, setReportsData] = useState<any>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_URL}/api/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data && data.stats) {
          setReportsData(data);
        }
      } catch (e) {
        console.error('Lỗi khi tải báo cáo:', e);
      }
    };
    fetchReports();
  }, [dateRange]);

  const revenueData: any[] = reportsData?.revenueData || [];
  const topProducts: any[] = reportsData?.topProducts || [];
  const categoryBreakdown: any[] = reportsData?.categoryBreakdown || [];

  const stats = [
    {
      title: 'Tổng doanh thu (7 ngày)',
      value: reportsData ? `${reportsData.stats.totalRevenue.toLocaleString()}đ` : '0đ',
      change: '0%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Đơn hàng (7 ngày)',
      value: reportsData ? reportsData.stats.totalOrders.toString() : '0',
      change: '0%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Giá trị đơn TB',
      value: reportsData ? `${Math.round(reportsData.stats.averageOrderValue).toLocaleString()}đ` : '0đ',
      change: '0%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Sản phẩm đã bán',
      value: reportsData ? reportsData.stats.itemsSold.toString() : '0',
      change: '0%',
      trend: 'up',
      icon: Package,
      color: 'orange'
    }
  ];

  const totalRevenue = reportsData?.stats?.totalRevenue || 0;
  const maxRevenue = reportsData ? Math.max(...reportsData.revenueData.map((d: any) => d.revenue), 1) : 100000;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
                  </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">
          <Download className="w-4 h-4" />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
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
                  'bg-teal-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-teal-600'
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
                          </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="h-80 flex items-end justify-around gap-2">
            {revenueData.length > 0 ? revenueData.map((day, index) => {
              const height = (day.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full">
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      <p className="font-semibold">{day.revenue.toLocaleString()}đ</p>
                      <p className="text-gray-300">{day.orders} đơn hàng</p>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                    
                    <div 
                      className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">{day.date}</p>
                    <p className="text-xs font-semibold text-gray-700 mt-0.5">{day.orders}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="text-gray-500 flex items-center justify-center w-full h-full">Chưa có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold mb-6">Phân loại theo danh mục</h2>
          <div className="space-y-6">
            {categoryBreakdown.length > 0 ? categoryBreakdown.map((cat, index) => (
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
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-gray-500 text-center">Chưa có dữ liệu</div>
            )}

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-800">Tổng cộng</p>
                <p className="font-bold text-blue-600">
                  {totalRevenue.toLocaleString()}đ
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
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
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
                    <span className="font-semibold text-blue-600">
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
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">Chưa có dữ liệu</td>
                </tr>
              )}
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
          <p className="text-3xl font-bold text-gray-800 mb-2">{reportsData?.stats?.completionRate || 0}%</p>
          <p className="text-sm text-gray-500">{reportsData?.stats?.totalDelivered || 0}/{reportsData?.stats?.totalOrders || 0} đơn đã giao thành công</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${reportsData?.stats?.completionRate || 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Khách hàng quay lại</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">{reportsData?.stats?.returnRate || 0}%</p>
          <p className="text-sm text-gray-500">Khách mua nhiều hơn 1 đơn</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${reportsData?.stats?.returnRate || 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Thời gian xử lý TB</h3>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">2h</p>
          <p className="text-sm text-gray-500">Từ đặt hàng đến xác nhận</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Giảm 0% so với tháng trước
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
