import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid #e8ecef', fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: '48px 24px 24px' }}>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: '18px',
                color: '#00658d',
              }}>
                FigureCurator
              </span>
            </Link>
            <p style={{ fontSize: '13px', color: '#6e7881', lineHeight: 1.7, marginTop: '12px', maxWidth: '260px' }}>
              Nền tảng cung cấp mô hình nhân vật cao cấp hàng đầu Việt Nam. Mỗi sản phẩm là một câu chuyện nghệ thuật.
            </p>
          </div>

          {/* Khám Phá */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3e4850', marginBottom: '16px' }}>
              KHÁM PHÁ
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/about" style={{ fontSize: '13px', color: '#6e7881', textDecoration: 'none' }}>Về chúng tôi</Link>
              <Link to="/category/new-arrivals" style={{ fontSize: '13px', color: '#6e7881', textDecoration: 'none' }}>Sản phẩm mới</Link>
              <Link to="/category/sale" style={{ fontSize: '13px', color: '#6e7881', textDecoration: 'none' }}>Khuyến mãi</Link>
              <Link to="/brands" style={{ fontSize: '13px', color: '#6e7881', textDecoration: 'none' }}>Thương hiệu</Link>
            </div>
          </div>

          {/* Hỗ Trợ */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3e4850', marginBottom: '16px' }}>
              HỖ TRỢ
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/contact" style={{ fontSize: '13px', color: '#6e7881', textDecoration: 'none' }}>Liên hệ</Link>
              <Link to="/support" style={{ fontSize: '13px', color: '#6e7881', textDecoration: 'none' }}>Hỗ trợ khách hàng</Link>
              <Link to="/terms" style={{ fontSize: '13px', color: '#6e7881', textDecoration: 'none' }}>Điều khoản dịch vụ</Link>
              <Link to="/privacy" style={{ fontSize: '13px', color: '#6e7881', textDecoration: 'none' }}>Chính sách bảo mật</Link>
            </div>
          </div>

          {/* Bản Tin */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3e4850', marginBottom: '16px' }}>
              BẢN TIN
            </h3>
            <p style={{ fontSize: '13px', color: '#6e7881', marginBottom: '12px', lineHeight: 1.6 }}>
              Nhận thông báo về các sản phẩm giới hạn mới nhất.
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e0e3e5',
                  fontSize: '12px',
                  outline: 'none',
                  background: '#f7fafc',
                  minWidth: 0,
                }}
              />
              <button style={{
                width: '38px',
                minWidth: '38px',
                height: '38px',
                borderRadius: '8px',
                background: '#00658d',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid #e8ecef',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#8a949d',
        }}>
          © 2024 FigureCurator. Bản quyền thuộc về Digital Curator.
        </div>
      </div>
    </footer>
  );
}