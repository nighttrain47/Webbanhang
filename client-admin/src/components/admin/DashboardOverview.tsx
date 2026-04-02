import { useState, useEffect } from 'react';
import { AdminSection } from './AdminDashboard';
import { API_URL } from '../../config';

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

  const stats = [
    { title: 'Doanh thu tháng', value: dashboardData ? `${dashboardData.stats.monthlyRevenue.toLocaleString()}₫` : '0₫', change: '+0%', icon: 'payments', color: 'var(--dc-primary)' },
    { title: 'Đơn hàng', value: dashboardData ? dashboardData.stats.monthlyOrders.toString() : '0', change: '+0%', icon: 'shopping_cart', color: 'var(--dc-tertiary-container)' },
    { title: 'Người dùng mới', value: dashboardData ? dashboardData.stats.newUsers.toString() : '0', change: '+0%', icon: 'person_add', color: '#8b5cf6' },
    { title: 'Tổng sản phẩm', value: dashboardData ? dashboardData.stats.totalProducts.toString() : '0', change: '+0%', icon: 'inventory_2', color: '#16a34a' },
  ];

  const recentOrders: any[] = dashboardData?.recentOrders || [];
  const topProducts: any[] = dashboardData?.topProducts || [];
  const revenue7days: number[] = dashboardData?.revenue7days || [0, 0, 0, 0, 0, 0, 0];

  const quickActions: { icon: string; label: string; color: string; section: AdminSection }[] = [
    { icon: 'add_circle', label: 'Thêm sản phẩm', color: 'var(--dc-primary)', section: 'products' },
    { icon: 'local_shipping', label: 'Xử lý đơn hàng', color: 'var(--dc-tertiary-container)', section: 'orders' },
    { icon: 'storefront', label: 'Quản lý thương hiệu', color: '#8b5cf6', section: 'brands' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--dc-font-headline)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--dc-on-surface)' }}>
          Tổng quan
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--dc-on-surface-variant)', marginTop: '0.25rem' }}>
          Xin chào! Đây là tóm tắt hoạt động hệ thống hôm nay.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: 'var(--dc-surface-container-lowest)',
            borderRadius: '1rem', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '0.75rem',
                background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: stat.color }}>{stat.icon}</span>
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16a34a' }}>{stat.change}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--dc-on-surface-variant)', marginBottom: '0.25rem' }}>{stat.title}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dc-on-surface)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders + Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        {/* Recent Orders */}
        <div style={{ background: 'var(--dc-surface-container-lowest)', borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(189,200,209,0.2)' }}>
            <h2 style={{ fontFamily: 'var(--dc-font-headline)', fontWeight: 700, fontSize: '1.125rem' }}>Đơn hàng gần đây</h2>
            <button
              onClick={() => onNavigate('orders')}
              style={{ color: 'var(--dc-primary)', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Xem tất cả
            </button>
          </div>
          {recentOrders.length > 0 ? recentOrders.map((order, i) => (
            <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(189,200,209,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{order.id}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--dc-on-surface-variant)' }}>{order.customer}</p>
              </div>
              <span style={{ fontWeight: 700 }}>{order.amount?.toLocaleString()}₫</span>
            </div>
          )) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--dc-outline)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.3, display: 'block', marginBottom: '0.5rem' }}>receipt_long</span>
              <p>Chưa có đơn hàng nào</p>
            </div>
          )}
        </div>

        {/* Quick Actions + Top Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Actions */}
          <div style={{ background: 'var(--dc-surface-container-lowest)', borderRadius: '1rem', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--dc-font-headline)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>Thao tác nhanh</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {quickActions.map(a => (
                <button key={a.label} onClick={() => onNavigate(a.section)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: '0.75rem',
                  background: 'var(--dc-surface-container-low)',
                  border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                  fontSize: '0.875rem', fontWeight: 500, color: 'var(--dc-on-surface)',
                  transition: 'background 0.15s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--dc-surface-container)')}
                onMouseOut={e => (e.currentTarget.style.background = 'var(--dc-surface-container-low)')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '22px', color: a.color }}>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div style={{ background: 'var(--dc-surface-container-lowest)', borderRadius: '1rem', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--dc-font-headline)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>Bán chạy nhất</h2>
            {topProducts.length > 0 ? topProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--dc-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--dc-outline)' }}>{p.sales} đã bán</p>
                </div>
              </div>
            )) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--dc-outline)', textAlign: 'center' }}>Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div style={{ background: 'var(--dc-surface-container-lowest)', borderRadius: '1rem', padding: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--dc-font-headline)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.5rem' }}>
          Doanh thu 7 ngày gần đây
        </h2>
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '0.75rem' }}>
          {revenue7days.map((h, i) => {
            const maxRev = Math.max(...revenue7days, 1);
            const percent = (h / maxRev) * 100;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div className="signature-gradient" style={{
                  width: '100%', borderRadius: '0.5rem 0.5rem 0 0',
                  height: `${h > 0 ? Math.max(4, percent) : 0}%`,
                  opacity: 0.7,
                  position: 'relative',
                  cursor: 'pointer',
                  minHeight: h > 0 ? '4px' : '0'
                }} title={`${h.toLocaleString()}₫`} />
                <span style={{ fontSize: '0.75rem', color: 'var(--dc-outline)' }}>
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
      </div>
    </div>
  );
}
