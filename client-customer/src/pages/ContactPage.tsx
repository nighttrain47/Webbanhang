import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface PageProps {
  cartCount: number;
  user?: any;
}

export default function ContactPage({ cartCount, user }: PageProps) {
  useEffect(() => { document.title = 'Liên hệ | FigureCurator'; }, []);
  const [sent, setSent] = useState(false);

  const contactInfo = [
    { icon: 'mail', label: 'Email', value: 'support@figurecurator.vn' },
    { icon: 'phone', label: 'Hotline', value: '1900 xxxx xx' },
    { icon: 'schedule', label: 'Giờ làm việc', value: 'T2 – T7: 9:00 – 18:00' },
    { icon: 'location_on', label: 'Địa chỉ', value: 'TP. Hồ Chí Minh, Việt Nam' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a949d', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#8a949d', textDecoration: 'none' }}>Trang chủ</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#3e4850' }}>Liên hệ</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00658d', marginBottom: '12px' }}>LIÊN HỆ VỚI CHÚNG TÔI</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181c1e', marginBottom: '12px' }}>
            Chúng tôi luôn sẵn sàng hỗ trợ
          </h1>
          <p style={{ fontSize: '14px', color: '#6e7881', maxWidth: '500px', margin: '0 auto' }}>
            Bạn có câu hỏi về sản phẩm, đơn hàng hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#181c1e', marginBottom: '24px' }}>Thông tin liên hệ</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {contactInfo.map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0,101,141,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#00658d' }}>{c.icon}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#8a949d', marginBottom: '2px' }}>{c.label}</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#181c1e' }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e8ecef' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#16a34a', display: 'block', marginBottom: '12px' }}>check_circle</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#181c1e', marginBottom: '8px' }}>Cảm ơn bạn!</h3>
                <p style={{ fontSize: '13px', color: '#6e7881' }}>Chúng tôi đã nhận được tin nhắn và sẽ phản hồi trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Họ tên</label>
                  <input required type="text" placeholder="Nhập họ tên" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e3e5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Email</label>
                  <input required type="email" placeholder="email@example.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e3e5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#3e4850', display: 'block', marginBottom: '6px' }}>Nội dung</label>
                  <textarea required rows={5} placeholder="Nhập nội dung tin nhắn..." style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e3e5', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{
                  padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #00658d, #00adef)',
                  color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer',
                }}>
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
