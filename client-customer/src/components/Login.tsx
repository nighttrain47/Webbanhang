import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

interface LoginProps {
  onLogin: (user: any) => void;
}

type ViewState = 'login' | 'register' | 'verify-otp' | 'forgot-password' | 'forgot-otp' | 'reset-password';

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const [view, setView] = useState<ViewState>('login');
  const [showPasswordFields, setShowPasswordFields] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '',
  });

  // OTP state
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPurpose, setOtpPurpose] = useState<'verify' | 'reset'>('verify');
  const [countdown, setCountdown] = useState(0);
  const [verifiedOtp, setVerifiedOtp] = useState(''); // store verified OTP for reset-password step
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const resetForm = useCallback(() => {
    setFormData({ username: '', email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
    setOtpValues(['', '', '', '', '', '']);
    setError('');
    setSuccessMsg('');
    setVerifiedOtp('');
  }, []);

  // ===== HANDLERS =====

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customer/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (data.success) { onLogin(data); navigate(redirect); }
      else if (data.needVerify) {
        // Account not verified yet - redirect to OTP
        setOtpEmail(data.email);
        setOtpPurpose('verify');
        setView('verify-otp');
        setCountdown(0); // Allow immediate resend
        setError('');
      }
      else setError(data.message || 'Đăng nhập thất bại');
    } catch { setError('Lỗi kết nối máy chủ.'); }
    finally { setIsLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      if (formData.password !== formData.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); setIsLoading(false); return; }
      if (formData.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); setIsLoading(false); return; }
      const res = await fetch(`${API_URL}/api/customer/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (data.success) {
        setOtpEmail(data.email || formData.email);
        setOtpPurpose('verify');
        setOtpValues(['', '', '', '', '', '']);
        setCountdown(60);
        setView('verify-otp');
        setSuccessMsg('Đã gửi mã xác thực tới email của bạn!');
      }
      else setError(data.message || 'Đăng ký thất bại');
    } catch { setError('Lỗi kết nối máy chủ.'); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async () => {
    const otp = otpValues.join('');
    if (otp.length !== 6) { setError('Vui lòng nhập đủ 6 số'); return; }
    setError(''); setIsLoading(true);
    try {
      if (otpPurpose === 'verify') {
        const res = await fetch(`${API_URL}/api/customer/verify-otp`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: otpEmail, otp, purpose: 'verify' })
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Xác thực thành công! Đang chuyển tới đăng nhập...');
          setTimeout(() => { resetForm(); setView('login'); }, 2000);
        }
        else setError(data.message || 'Xác thực thất bại');
      } else {
        // Forgot password - verify OTP first, then show reset password form
        const res = await fetch(`${API_URL}/api/customer/verify-otp`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: otpEmail, otp, purpose: 'reset' })
        });
        const data = await res.json();
        if (data.success) {
          setVerifiedOtp(otp);
          setError('');
          setView('reset-password');
        }
        else setError(data.message || 'Mã OTP không đúng');
      }
    } catch { setError('Lỗi kết nối máy chủ.'); }
    finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setError(''); setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customer/resend-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, purpose: otpPurpose })
      });
      const data = await res.json();
      if (data.success) {
        setOtpValues(['', '', '', '', '', '']);
        setCountdown(60);
        setSuccessMsg('Đã gửi lại mã xác thực!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
      else setError(data.message || 'Gửi lại thất bại');
    } catch { setError('Lỗi kết nối máy chủ.'); }
    finally { setIsLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customer/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (data.success) {
        setOtpEmail(formData.email);
        setOtpPurpose('reset');
        setOtpValues(['', '', '', '', '', '']);
        setCountdown(60);
        setView('forgot-otp');
        setSuccessMsg('Đã gửi mã xác thực tới email!');
      }
      else setError(data.message || 'Không thể gửi OTP');
    } catch { setError('Lỗi kết nối máy chủ.'); }
    finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      if (formData.newPassword !== formData.confirmNewPassword) { setError('Mật khẩu xác nhận không khớp'); setIsLoading(false); return; }
      if (formData.newPassword.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); setIsLoading(false); return; }
      const res = await fetch(`${API_URL}/api/customer/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: verifiedOtp, newPassword: formData.newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đổi mật khẩu thành công! Đang chuyển tới đăng nhập...');
        setTimeout(() => { resetForm(); setView('login'); }, 2000);
      }
      else setError(data.message || 'Đổi mật khẩu thất bại');
    } catch { setError('Lỗi kết nối máy chủ.'); }
    finally { setIsLoading(false); }
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && otpValues.join('').length === 6) {
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otpValues];
      for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || '';
      setOtpValues(newOtp);
      const focusIdx = Math.min(pasted.length, 5);
      otpRefs.current[focusIdx]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const switchToView = (v: ViewState) => {
    resetForm();
    setView(v);
  };

  // ===== STYLES =====
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px',
    border: '1px solid #e0e3e5', background: '#f7fafc',
    color: '#181c1e', fontSize: '14px', outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
    boxSizing: 'border-box',
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#00658d'; e.target.style.boxShadow = '0 0 0 3px rgba(0,101,141,0.1)'; };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#e0e3e5'; e.target.style.boxShadow = 'none'; };

  const btnPrimary: React.CSSProperties = {
    width: '100%', padding: '14px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #00658d, #00adef)',
    color: '#fff', fontWeight: 700, fontSize: '14px',
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    opacity: isLoading ? 0.6 : 1,
    transition: 'opacity 200ms, transform 100ms',
  };

  // ===== RENDER HELPERS =====

  const renderAlerts = () => (
    <>
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', fontSize: '13px', marginBottom: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', fontSize: '13px', marginBottom: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
          {successMsg}
        </div>
      )}
    </>
  );

  const renderOtpInput = () => (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }} onPaste={handleOtpPaste}>
      {otpValues.map((val, i) => (
        <input
          key={i}
          ref={el => { otpRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={e => handleOtpChange(i, e.target.value)}
          onKeyDown={e => handleOtpKeyDown(i, e)}
          style={{
            width: '52px', height: '60px', textAlign: 'center',
            fontSize: '24px', fontWeight: 800, fontFamily: 'monospace',
            borderRadius: '12px', border: `2px solid ${val ? '#00658d' : '#e0e3e5'}`,
            background: val ? '#f0f7fb' : '#f7fafc',
            color: '#00658d', outline: 'none',
            transition: 'all 200ms',
          }}
          onFocus={e => { e.target.style.borderColor = '#00adef'; e.target.style.boxShadow = '0 0 0 3px rgba(0,173,239,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = val ? '#00658d' : '#e0e3e5'; e.target.style.boxShadow = 'none'; }}
        />
      ))}
    </div>
  );

  const renderInputField = (label: string, name: string, type: string, placeholder: string, icon: string, required = true) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3e4850', marginBottom: '6px', display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#8a949d' }}>{icon}</span>
        <input
          type={type === 'password' ? (showPasswordFields[name] ? 'text' : 'password') : type}
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          minLength={type === 'password' ? 6 : undefined}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {type === 'password' && (
          <button type="button" onClick={() => setShowPasswordFields(prev => ({ ...prev, [name]: !prev[name] }))} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a949d' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{showPasswordFields[name] ? 'visibility_off' : 'visibility'}</span>
          </button>
        )}
      </div>
    </div>
  );

  // ===== VIEW RENDERS =====

  const renderFormContent = () => {
    switch (view) {
      case 'login':
        return (
          <>
            <button onClick={() => navigate(redirect === '/checkout' ? '/cart' : '/')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 500, color: '#6e7881', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              Quay lại {redirect === '/checkout' ? 'giỏ hàng' : 'trang chủ'}
            </button>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 800, color: '#181c1e', marginBottom: '8px' }}>Chào mừng trở lại</h1>
            <p style={{ fontSize: '14px', color: '#6e7881', marginBottom: '28px' }}>Đăng nhập bằng email để tiếp tục.</p>

            <form onSubmit={handleLogin}>
              {renderAlerts()}
              {renderInputField('ĐỊA CHỈ EMAIL', 'email', 'email', 'example@curator.vn', 'mail')}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3e4850' }}>MẬT KHẨU</label>
                  <button type="button" onClick={() => switchToView('forgot-password')} style={{ fontSize: '12px', fontWeight: 600, color: '#00658d', background: 'none', border: 'none', cursor: 'pointer' }}>Quên mật khẩu?</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#8a949d' }}>lock</span>
                  <input type={showPasswordFields['password'] ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required minLength={6} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <button type="button" onClick={() => setShowPasswordFields(prev => ({ ...prev, password: !prev.password }))} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a949d' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{showPasswordFields['password'] ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#3e4850', marginBottom: '20px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#00658d' }} />
                Ghi nhớ đăng nhập cho lần sau
              </label>
              <button type="submit" disabled={isLoading} style={btnPrimary}>
                {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6e7881' }}>
              Chưa có tài khoản?{' '}
              <button onClick={() => switchToView('register')} style={{ fontWeight: 600, color: '#ff7d36', background: 'none', border: 'none', cursor: 'pointer' }}>Đăng ký ngay</button>
            </p>
          </>
        );

      case 'register':
        return (
          <>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 800, color: '#181c1e', marginBottom: '8px' }}>Tạo tài khoản</h1>
            <p style={{ fontSize: '14px', color: '#6e7881', marginBottom: '28px' }}>Đăng ký tài khoản mới bằng email.</p>

            <form onSubmit={handleRegister}>
              {renderAlerts()}
              {renderInputField('TÊN ĐĂNG NHẬP', 'username', 'text', 'Tên đăng nhập', 'person')}
              {renderInputField('ĐỊA CHỈ EMAIL', 'email', 'email', 'example@curator.vn', 'mail')}
              {renderInputField('MẬT KHẨU', 'password', 'password', '••••••••', 'lock')}
              {renderInputField('XÁC NHẬN MẬT KHẨU', 'confirmPassword', 'password', '••••••••', 'lock')}
              <button type="submit" disabled={isLoading} style={btnPrimary}>
                {isLoading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
                {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6e7881' }}>
              Đã có tài khoản?{' '}
              <button onClick={() => switchToView('login')} style={{ fontWeight: 600, color: '#ff7d36', background: 'none', border: 'none', cursor: 'pointer' }}>Đăng nhập</button>
            </p>
          </>
        );

      case 'verify-otp':
      case 'forgot-otp':
        return (
          <>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #00658d, #00adef)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(0,101,141,0.25)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#fff' }}>
                  {view === 'verify-otp' ? 'verified_user' : 'lock_reset'}
                </span>
              </div>
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: '#181c1e', marginBottom: '8px', textAlign: 'center' }}>
              {view === 'verify-otp' ? 'Xác thực tài khoản' : 'Nhập mã xác thực'}
            </h1>
            <p style={{ fontSize: '14px', color: '#6e7881', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
              Chúng tôi đã gửi mã xác thực 6 số tới<br />
              <strong style={{ color: '#181c1e' }}>{otpEmail}</strong>
            </p>

            {renderAlerts()}
            {renderOtpInput()}

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otpValues.join('').length !== 6}
              style={{
                ...btnPrimary,
                opacity: (isLoading || otpValues.join('').length !== 6) ? 0.5 : 1,
                marginBottom: '16px',
              }}
            >
              {isLoading ? 'Đang xác thực...' : 'Xác Nhận'}
              {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>}
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {countdown > 0 ? (
                <p style={{ fontSize: '13px', color: '#8a949d' }}>
                  Gửi lại mã sau <strong style={{ color: '#00658d' }}>{countdown}s</strong>
                </p>
              ) : (
                <button onClick={handleResendOtp} disabled={isLoading} style={{ fontSize: '13px', fontWeight: 600, color: '#00658d', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Gửi lại mã xác thực
                </button>
              )}
            </div>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6e7881' }}>
              <button onClick={() => switchToView('login')} style={{ fontWeight: 600, color: '#ff7d36', background: 'none', border: 'none', cursor: 'pointer' }}>
                ← Quay lại đăng nhập
              </button>
            </p>
          </>
        );

      case 'forgot-password':
        return (
          <>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #ff7d36, #ffaa5b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(255,125,54,0.25)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#fff' }}>lock_reset</span>
              </div>
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: '#181c1e', marginBottom: '8px', textAlign: 'center' }}>Quên mật khẩu?</h1>
            <p style={{ fontSize: '14px', color: '#6e7881', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
              Nhập email đã đăng ký để nhận mã xác thực.
            </p>

            <form onSubmit={handleForgotPassword}>
              {renderAlerts()}
              {renderInputField('ĐỊA CHỈ EMAIL', 'email', 'email', 'example@curator.vn', 'mail')}
              <button type="submit" disabled={isLoading} style={{ ...btnPrimary, marginBottom: '16px' }}>
                {isLoading ? 'Đang gửi...' : 'Gửi Mã Xác Thực'}
                {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6e7881' }}>
              <button onClick={() => switchToView('login')} style={{ fontWeight: 600, color: '#ff7d36', background: 'none', border: 'none', cursor: 'pointer' }}>
                ← Quay lại đăng nhập
              </button>
            </p>
          </>
        );

      case 'reset-password':
        return (
          <>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(22,163,74,0.25)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#fff' }}>password</span>
              </div>
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: '#181c1e', marginBottom: '8px', textAlign: 'center' }}>Đặt mật khẩu mới</h1>
            <p style={{ fontSize: '14px', color: '#6e7881', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
              Nhập mật khẩu mới cho tài khoản <strong style={{ color: '#181c1e' }}>{otpEmail}</strong>
            </p>

            <form onSubmit={handleResetPassword}>
              {renderAlerts()}
              {renderInputField('MẬT KHẨU MỚI', 'newPassword', 'password', '••••••••', 'lock')}
              {renderInputField('XÁC NHẬN MẬT KHẨU MỚI', 'confirmNewPassword', 'password', '••••••••', 'lock')}
              <button type="submit" disabled={isLoading} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                {isLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6e7881' }}>
              <button onClick={() => switchToView('login')} style={{ fontWeight: 600, color: '#ff7d36', background: 'none', border: 'none', cursor: 'pointer' }}>
                ← Quay lại đăng nhập
              </button>
            </p>
          </>
        );
    }
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
          {renderFormContent()}

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
