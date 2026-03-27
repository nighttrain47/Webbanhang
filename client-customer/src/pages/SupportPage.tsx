import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface PageProps {
  cartCount: number;
  user?: any;
}

const FAQ_DATA = [
  {
    q: 'Làm sao để đặt hàng trên FigureCurator?',
    a: 'Bạn chỉ cần chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. Hệ thống sẽ hướng dẫn bạn từng bước để hoàn tất đơn hàng.'
  },
  {
    q: 'Sản phẩm Pre-order là gì?',
    a: 'Pre-order là sản phẩm đặt trước. Bạn thanh toán trước để đảm bảo nhận được sản phẩm khi ra mắt. Thời gian giao hàng dự kiến sẽ được ghi rõ trên trang sản phẩm.'
  },
  {
    q: 'Chính sách đổi trả như thế nào?',
    a: 'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm bị lỗi hoặc không đúng mô tả. Vui lòng giữ nguyên hộp và phụ kiện đi kèm.'
  },
  {
    q: 'Thời gian giao hàng mất bao lâu?',
    a: 'Đơn hàng trong nước: 2-5 ngày làm việc. Sản phẩm pre-order sẽ được giao theo lịch dự kiến trên trang sản phẩm.'
  },
  {
    q: 'Có hỗ trợ thanh toán trả góp không?',
    a: 'Hiện tại chúng tôi chưa hỗ trợ trả góp. Bạn có thể thanh toán bằng chuyển khoản ngân hàng hoặc COD (thanh toán khi nhận hàng).'
  },
  {
    q: 'Sản phẩm trên FigureCurator có chính hãng không?',
    a: 'Tất cả sản phẩm đều là hàng chính hãng 100%, được nhập trực tiếp từ nhà phân phối tại Nhật Bản. Chúng tôi cam kết không bán hàng bootleg.'
  },
];

export default function SupportPage({ cartCount, user }: PageProps) {
  useEffect(() => { document.title = 'Hỗ trợ khách hàng | FigureCurator'; }, []);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a949d', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#8a949d', textDecoration: 'none' }}>Trang chủ</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#3e4850' }}>Hỗ trợ khách hàng</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00658d', marginBottom: '12px' }}>HỖ TRỢ KHÁCH HÀNG</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181c1e', marginBottom: '12px' }}>
            Câu hỏi thường gặp
          </h1>
          <p style={{ fontSize: '14px', color: '#6e7881', maxWidth: '500px', margin: '0 auto' }}>
            Tìm câu trả lời nhanh cho các thắc mắc phổ biến nhất.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '48px' }}>
          {FAQ_DATA.map((faq, i) => (
            <div key={i} style={{ marginBottom: '8px', borderRadius: '12px', background: '#fff', border: '1px solid #e8ecef', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%', padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#181c1e' }}>{faq.q}</span>
                <span className="material-symbols-outlined" style={{
                  fontSize: '20px', color: '#8a949d', transition: 'transform 200ms',
                  transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>expand_more</span>
              </button>
              {openIndex === i && (
                <div style={{ padding: '0 20px 16px', fontSize: '13px', color: '#6e7881', lineHeight: 1.8 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div style={{ textAlign: 'center', padding: '32px', borderRadius: '16px', background: '#fff', border: '1px solid #e8ecef', maxWidth: '500px', margin: '0 auto' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#00658d', marginBottom: '12px', display: 'block' }}>headset_mic</span>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#181c1e', marginBottom: '8px' }}>Vẫn cần hỗ trợ?</h3>
          <p style={{ fontSize: '13px', color: '#6e7881', marginBottom: '16px' }}>Liên hệ trực tiếp với đội ngũ chăm sóc khách hàng qua các kênh bên dưới.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/contact" style={{
              padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #00658d, #00adef)',
              color: '#fff', fontWeight: 600, fontSize: '13px', textDecoration: 'none',
            }}>Liên hệ</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
