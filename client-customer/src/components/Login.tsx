import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', name: '', confirmPassword: '',
  });

  const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/api/customer/login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username, password: formData.password })
        });
        const data = await res.json();
        if (data.success) { onLogin(data); navigate('/'); }
        else setError(data.message || 'Đăng nhập thất bại');
      } else {
        if (formData.password !== formData.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); setIsLoading(false); return; }
        const res = await fetch(`${API_URL}/api/customer/signup`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username, password: formData.password, name: formData.name, email: formData.email })
        });
        const data = await res.json();
        if (data.success) { setIsLogin(true); alert('Đăng ký thành công!'); }
        else setError(data.message || 'Đăng ký thất bại');
      }
    } catch { setError('Lỗi kết nối máy chủ.'); }
    finally { setIsLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px',
    border: '1px solid #e0e3e5', background: '#f7fafc',
    color: '#181c1e', fontSize: '14px', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* ═══ LEFT PANEL ═══ */}
      <div
        className="hidden lg:flex"
        style={{
          width: '45%',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
          background: '#0e1a28',
        }}
      >
        {/* Background Image */}
        <img
          src="/login-bg.png"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.4,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,26,40,0.95) 0%, rgba(14,26,40,0.3) 50%, rgba(14,26,40,0.1) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ff7d36', marginBottom: '16px', display: 'block' }}>
            DIGITAL CURATOR
          </span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '16px' }}>
            Nâng tầm bộ sưu tập<br />của bạn.
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '380px' }}>
            Khám phá những tuyệt tác mô hình được tuyển chọn kỹ lưỡng. Nơi nghệ thuật gặp gỡ niềm đam mê sưu tầm.
          </p>

          {/* Trust Cards */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { icon: 'verified', title: 'Chính hãng 100%', desc: 'Cam kết nguồn gốc rõ ràng từ các studio danh tiếng.' },
              { icon: 'auto_awesome', title: 'Phiên bản giới hạn', desc: 'Tiếp cận những sản phẩm hiếm nhất trên thị trường.' },
            ].map(card => (
              <div key={card.title} style={{
                flex: 1, padding: '16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#00adef', marginBottom: '10px', display: 'block' }}>
                  {card.icon}
                </span>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: '4px' }}>{card.title}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 2, marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00adef' }} />
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
            SECURED BY FIGURECURATOR AUTH
          </span>
        </div>
      </div>

      {/* ═══ RIGHT PANEL (Form) ═══ */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 800, color: '#181c1e', marginBottom: '8px' }}>
            {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
          </h1>
          <p style={{ fontSize: '14px', color: '#6e7881', marginBottom: '28px' }}>
            {isLogin ? 'Vui lòng đăng nhập để quản lý bộ sưu tập của bạn.' : 'Đăng ký để bắt đầu sưu tầm.'}
          </p>

          {/* Social Buttons */}
          {isLogin && (
            <>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '10px', border: '1px solid #e0e3e5',
                  background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#3e4850',
                }}>
                  <img src="https://www.google.com/favicon.ico" alt="" style={{ width: '16px', height: '16px' }} />
                  Google
                </button>
                <button style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '10px', border: '1px solid #e0e3e5',
                  background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#3e4850',
                }}>
                  <span style={{ color: '#1877f2', fontWeight: 700, fontSize: '16px' }}>f</span>
                  Facebook
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '1px', background: '#e8ecef' }} />
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a949d' }}>HOẶC SỬ DỤNG EMAIL</span>
                <div style={{ flex: 1, height: '1px', background: '#e8ecef' }} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
                {error}
              </div>
            )}

            {/* Username / Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3e4850', marginBottom: '6px', display: 'block' }}>
                {isLogin ? 'ĐỊA CHỈ EMAIL' : 'TÊN ĐĂNG NHẬP'}
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#8a949d' }}>mail</span>
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder={isLogin ? 'example@curator.vn' : 'Tên đăng nhập'} required style={inputStyle} />
              </div>
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3e4850', marginBottom: '6px', display: 'block' }}>HỌ VÀ TÊN</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#8a949d' }}>badge</span>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Họ và tên" required style={inputStyle} />
                </div>
              </div>
            )}

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3e4850' }}>MẬT KHẨU</label>
                {isLogin && <button type="button" style={{ fontSize: '12px', fontWeight: 600, color: '#00658d', background: 'none', border: 'none', cursor: 'pointer' }}>Quên mật khẩu?</button>}
              </div>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#8a949d' }}>lock</span>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required style={inputStyle} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a949d' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3e4850', marginBottom: '6px', display: 'block' }}>XÁC NHẬN MẬT KHẨU</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#8a949d' }}>lock</span>
                  <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required style={inputStyle} />
                </div>
              </div>
            )}

            {isLogin && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#3e4850', marginBottom: '20px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#00658d' }} />
                Ghi nhớ đăng nhập cho lần sau
              </label>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #00658d, #00adef)',
                color: '#fff', fontWeight: 700, fontSize: '14px',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
              {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6e7881' }}>
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button onClick={() => setIsLogin(!isLogin)} style={{ fontWeight: 600, color: '#ff7d36', background: 'none', border: 'none', cursor: 'pointer' }}>
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e8ecef' }}>
            <span style={{ fontSize: '11px', color: '#8a949d' }}>© 2024 FIGURECURATOR</span>
            <span style={{ fontSize: '11px', color: '#8a949d', cursor: 'pointer' }}>CHÍNH SÁCH</span>
            <span style={{ fontSize: '11px', color: '#8a949d', cursor: 'pointer' }}>ĐIỀU KHOẢN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
