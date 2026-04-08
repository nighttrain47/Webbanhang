import { useState, useEffect } from 'react';
import { AdminSection } from './AdminDashboard';
import { API_URL } from '../../config';
import { 
  Banknote, ShoppingCart, UserPlus, Package, 
  Tag, Clock, BoxSelect, Warehouse, 
  ChevronRight, PlusCircle, Truck, Building2, Receipt, LineChart
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigate: (section: AdminSection) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_URL}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data && data.stats) {
          setDashboardData(data);
        }
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      }
    };
    fetchDashboard();
  }, []);

  const formatS = (val: any) => (val != null ? Number(val).toLocaleString() : '0');

  const stats = [
    { title: 'Doanh thu tháng', value: `${formatS(dashboardData?.stats?.monthlyRevenue)}₫`, change: '+0%', icon: Banknote, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
    { title: 'Đơn hàng', value: formatS(dashboardData?.stats?.monthlyOrders), change: '+0%', icon: ShoppingCart, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
    { title: 'Người dùng mới', value: formatS(dashboardData?.stats?.newUsers), change: '+0%', icon: UserPlus, colorClass: 'text-violet-600', bgClass: 'bg-violet-50' },
    { title: 'Tổng sản phẩm', value: formatS(dashboardData?.stats?.totalProducts), change: '+0%', icon: Package, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
    { title: 'Đang bán', value: formatS(dashboardData?.stats?.activeProducts), change: '+0%', icon: Tag, colorClass: 'text-teal-600', bgClass: 'bg-teal-50' },
    { title: 'Pre-order', value: formatS(dashboardData?.stats?.preorderProducts), change: '+0%', icon: Clock, colorClass: 'text-amber-600', bgClass: 'bg-amber-50' },
    { title: 'Hết hàng', value: formatS(dashboardData?.stats?.outOfStockProducts), change: '+0%', icon: BoxSelect, colorClass: 'text-red-600', bgClass: 'bg-red-50' },
    { title: 'Tổng tồn kho', value: formatS(dashboardData?.stats?.totalStock), change: '+0%', icon: Warehouse, colorClass: 'text-cyan-600', bgClass: 'bg-cyan-50' },
  ];

  const recentOrders: any[] = dashboardData?.recentOrders || [];
  const topProducts: any[] = dashboardData?.topProducts || [];
  const revenue7days: number[] = dashboardData?.revenue7days || [0, 0, 0, 0, 0, 0, 0];

  const quickActions: { icon: any; label: string; colorClass: string; bgClass: string; section: AdminSection }[] = [
    { icon: PlusCircle, label: 'Thêm sản phẩm', colorClass: 'text-blue-600', bgClass: 'group-hover:bg-blue-50', section: 'products' },
    { icon: Truck, label: 'Xử lý đơn hàng', colorClass: 'text-emerald-600', bgClass: 'group-hover:bg-emerald-50', section: 'orders' },
    { icon: Building2, label: 'Quản lý thương hiệu', colorClass: 'text-violet-600', bgClass: 'group-hover:bg-violet-50', section: 'brands' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
              </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgClass}`}>
                  <Icon className={`w-6 h-6 ${stat.colorClass}`} />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-sm text-gray-500 mb-1 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h2>
            <button
              onClick={() => onNavigate('orders')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-semibold text-gray-500">
                    <th className="px-6 py-3 font-medium">Mã đơn</th>
                    <th className="px-6 py-3 font-medium">Khách hàng</th>
                    <th className="px-6 py-3 font-medium text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{order.id.toString().slice(-6)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{order.amount?.toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400 h-full">
                <Receipt className="w-12 h-12 mb-3 stroke-1" />
                <p>Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions + Top Products */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
            <div className="flex flex-col gap-2">
              {quickActions.map(a => {
                const Icon = a.icon;
                return (
                  <button 
                    key={a.label} 
                    onClick={() => onNavigate(a.section)} 
                    className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-gray-50 transition-all text-left w-full"
                  >
                    <div className={`p-2 rounded-md bg-gray-50 ${a.bgClass} transition-colors`}>
                      <Icon className={`w-5 h-5 ${a.colorClass}`} />
                    </div>
                    <span className="font-semibold text-sm text-gray-700 group-hover:text-gray-900 border-l border-transparent pl-1">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Bán chạy nhất</h2>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-50 text-orange-700'}`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sales} đã bán</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-8">Doanh thu 7 ngày gần đây</h2>
        {Math.max(...revenue7days) > 0 ? (
          <div className="h-64 flex items-end justify-between gap-4 px-4 overflow-hidden">
            {revenue7days.map((h, i) => {
              const maxRev = Math.max(...revenue7days, 1);
            const percent = (h / maxRev) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-3 group h-full pt-8 cursor-pointer">
                <div 
                  className="w-10 sm:w-16 rounded-t-xl relative transition-all duration-500 ease-out shadow-sm"
                  style={{
                    height: `${h > 0 ? Math.max(2, percent) : 0}%`,
                    background: 'linear-gradient(to top, #0284c7, #38bdf8)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    {h.toLocaleString()}₫
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {(() => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.getDay() === 0 ? 'CN' : `T${d.getDay() + 1}`;
                  })()}
                </span>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <LineChart className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
            <p>Chưa có dữ liệu doanh thu</p>
          </div>
        )}
      </div>
    </div>
  );
}
