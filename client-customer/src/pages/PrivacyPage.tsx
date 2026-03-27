import { useEffect } from 'react';
import { Link } from 'react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface PageProps {
  cartCount: number;
  user?: any;
}

const SECTIONS = [
  {
    title: '1. Thông tin chúng tôi thu thập',
    content: `Khi bạn sử dụng FigureCurator, chúng tôi có thể thu thập các thông tin sau:
• Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ giao hàng.
• Thông tin tài khoản: Tên đăng nhập, mật khẩu (được mã hóa).
• Thông tin đơn hàng: Lịch sử mua hàng, sản phẩm yêu thích.
• Thông tin kỹ thuật: Địa chỉ IP, loại trình duyệt, thiết bị sử dụng.`
  },
  {
    title: '2. Mục đích sử dụng',
    content: `Chúng tôi sử dụng thông tin của bạn để:
• Xử lý và giao đơn hàng.
• Cung cấp dịch vụ chăm sóc khách hàng.
• Gửi thông báo về đơn hàng, khuyến mãi (nếu bạn đồng ý).
• Cải thiện trải nghiệm website và dịch vụ.
• Ngăn chặn gian lận và bảo mật hệ thống.`
  },
  {
    title: '3. Bảo mật thông tin',
    content: `Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật tiêu chuẩn ngành. Mật khẩu được mã hóa, thông tin thanh toán được xử lý qua các cổng thanh toán bảo mật. Tuy nhiên, không có phương thức truyền tải nào qua Internet là hoàn toàn an toàn 100%.`
  },
  {
    title: '4. Chia sẻ thông tin',
    content: `Chúng tôi KHÔNG bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ với:
• Đơn vị vận chuyển: Để giao hàng.
• Cổng thanh toán: Để xử lý giao dịch.
• Cơ quan chức năng: Khi có yêu cầu pháp lý.`
  },
  {
    title: '5. Cookie',
    content: `Website sử dụng cookie để cải thiện trải nghiệm duyệt web của bạn. Cookie giúp ghi nhớ các tùy chọn, giỏ hàng và phiên đăng nhập. Bạn có thể tắt cookie qua cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số tính năng.`
  },
  {
    title: '6. Quyền của bạn',
    content: `Bạn có quyền:
• Truy cập và xem thông tin cá nhân đã cung cấp.
• Yêu cầu chỉnh sửa hoặc xóa thông tin.
• Từ chối nhận email marketing.
• Yêu cầu xuất dữ liệu cá nhân.
Để thực hiện các quyền trên, vui lòng liên hệ qua trang Liên hệ.`
  },
  {
    title: '7. Liên hệ',
    content: `Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ:
• Email: support@figurecurator.vn
• Hotline: 1900 xxxx xx`
  },
];

export default function PrivacyPage({ cartCount, user }: PageProps) {
  useEffect(() => { document.title = 'Chính sách bảo mật | FigureCurator'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a949d', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#8a949d', textDecoration: 'none' }}>Trang chủ</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#3e4850' }}>Chính sách bảo mật</span>
        </div>

        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00658d', marginBottom: '12px' }}>PHÁP LÝ</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181c1e', marginBottom: '8px' }}>
            Chính sách bảo mật
          </h1>
          <p style={{ fontSize: '13px', color: '#8a949d', marginBottom: '40px' }}>Cập nhật lần cuối: 26/03/2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {SECTIONS.map(s => (
              <div key={s.title}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '17px', fontWeight: 700, color: '#181c1e', marginBottom: '10px' }}>{s.title}</h2>
                <p style={{ fontSize: '14px', color: '#3e4850', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
