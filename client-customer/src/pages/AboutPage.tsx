import { useEffect } from 'react';
import { Link } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface PageProps {
  cartCount: number;
  user?: any;
}

export default function AboutPage({ cartCount, user }: PageProps) {
  useEffect(() => { document.title = 'Về chúng tôi | FigureCurator'; }, []);

  const values = [
    { icon: 'verified', title: 'Chính hãng 100%', desc: 'Cam kết chỉ cung cấp sản phẩm chính hãng từ các nhà sản xuất uy tín hàng đầu Nhật Bản.' },
    { icon: 'local_shipping', title: 'Giao hàng toàn quốc', desc: 'Đóng gói cẩn thận, bảo hiểm toàn bộ, giao hàng nhanh chóng trên toàn quốc.' },
    { icon: 'support_agent', title: 'Hỗ trợ tận tâm', desc: 'Đội ngũ tư vấn chuyên nghiệp, sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.' },
    { icon: 'workspace_premium', title: 'Trải nghiệm cao cấp', desc: 'Mỗi sản phẩm được tuyển chọn kỹ lưỡng, mang đến trải nghiệm sưu tầm đỉnh cao.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a949d', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#8a949d', textDecoration: 'none' }}>Trang chủ</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#3e4850' }}>Về chúng tôi</span>
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00658d', marginBottom: '12px' }}>VỀ FIGURECURATOR</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '36px', fontWeight: 800, color: '#181c1e', lineHeight: 1.2, marginBottom: '16px' }}>
            Nền tảng mô hình<br />cao cấp hàng đầu Việt Nam
          </h1>
          <p style={{ fontSize: '15px', color: '#6e7881', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            FigureCurator ra đời với sứ mệnh mang đến cho cộng đồng yêu thích anime và mô hình Nhật Bản
            những sản phẩm chính hãng với chất lượng dịch vụ cao cấp nhất.
          </p>
        </div>

        {/* Values Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '56px' }}>
          {values.map(v => (
            <div key={v.title} style={{
              padding: '28px 24px', borderRadius: '16px', background: '#fff',
              border: '1px solid #e8ecef', textAlign: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#00658d', marginBottom: '16px', display: 'block' }}>{v.icon}</span>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', fontWeight: 700, color: '#181c1e', marginBottom: '8px' }}>{v.title}</h3>
              <p style={{ fontSize: '13px', color: '#6e7881', lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: '#181c1e', marginBottom: '20px', textAlign: 'center' }}>
            Câu chuyện của chúng tôi
          </h2>
          <div style={{ fontSize: '14px', color: '#3e4850', lineHeight: 1.9 }}>
            <p style={{ marginBottom: '16px' }}>
              Được thành lập bởi những người đam mê văn hóa Nhật Bản, FigureCurator không chỉ đơn thuần là một cửa hàng —
              chúng tôi là những curator (người giám tuyển) thực thụ, cẩn thận tuyển chọn từng sản phẩm đưa đến tay khách hàng.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Từ Scale Figure, Nendoroid, Figma cho đến Gundam Model Kit, mỗi sản phẩm tại FigureCurator đều được nhập
              trực tiếp từ các nhà phân phối chính hãng tại Nhật Bản, đảm bảo chất lượng và tính xác thực tuyệt đối.
            </p>
            <p>
              Chúng tôi tin rằng mỗi figure không chỉ là một vật phẩm sưu tầm, mà còn là một tác phẩm nghệ thuật
              truyền tải câu chuyện, cảm xúc và niềm đam mê của người sở hữu.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
          {[
            { num: '5,000+', label: 'Sản phẩm' },
            { num: '10,000+', label: 'Khách hàng' },
            { num: '99.8%', label: 'Hài lòng' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '24px', borderRadius: '12px', background: '#fff', border: '1px solid #e8ecef' }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 800, color: '#00658d' }}>{s.num}</p>
              <p style={{ fontSize: '13px', color: '#6e7881', marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
