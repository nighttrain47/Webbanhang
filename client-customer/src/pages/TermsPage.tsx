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
    title: '1. Điều khoản chung',
    content: `Khi truy cập và sử dụng website FigureCurator, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng website.`
  },
  {
    title: '2. Tài khoản người dùng',
    content: `Bạn có trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu, đồng thời chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản của bạn. Bạn đồng ý thông báo ngay cho chúng tôi nếu phát hiện bất kỳ việc sử dụng trái phép nào.`
  },
  {
    title: '3. Đặt hàng & thanh toán',
    content: `Khi bạn đặt hàng, đó là một lời đề nghị mua sản phẩm. Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong các trường hợp: thông tin không chính xác, sản phẩm hết hàng, hoặc lỗi về giá. Giá hiển thị là giá cuối cùng bao gồm thuế (nếu có). Phí vận chuyển được tính riêng khi thanh toán.`
  },
  {
    title: '4. Giao hàng',
    content: `Thời gian giao hàng dự kiến từ 2-5 ngày làm việc tùy khu vực. Đối với sản phẩm pre-order, thời gian giao hàng sẽ được ghi rõ trên trang sản phẩm. Chúng tôi không chịu trách nhiệm cho sự chậm trễ do đơn vị vận chuyển hoặc các sự kiện bất khả kháng.`
  },
  {
    title: '5. Đổi trả & hoàn tiền',
    content: `Sản phẩm được đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu còn nguyên seal, bao bì và phụ kiện đi kèm. Sản phẩm lỗi do nhà sản xuất sẽ được đổi mới hoàn toàn. Không hỗ trợ đổi trả cho sản phẩm pre-order sau khi hết hạn hủy đơn.`
  },
  {
    title: '6. Sở hữu trí tuệ',
    content: `Tất cả nội dung trên website bao gồm hình ảnh, logo, văn bản, thiết kế đều thuộc quyền sở hữu của FigureCurator hoặc đối tác được cấp phép. Nghiêm cấm sao chép, phân phối hoặc sử dụng bất kỳ nội dung nào mà không có sự đồng ý bằng văn bản.`
  },
  {
    title: '7. Giới hạn trách nhiệm',
    content: `FigureCurator cung cấp dịch vụ trên cơ sở "nguyên trạng". Chúng tôi không đảm bảo website sẽ hoạt động liên tục không bị gián đoạn. Trách nhiệm bồi thường tối đa của chúng tôi không vượt quá giá trị đơn hàng liên quan.`
  },
];

export default function TermsPage({ cartCount, user }: PageProps) {
  useEffect(() => { document.title = 'Điều khoản dịch vụ | FigureCurator'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a949d', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#8a949d', textDecoration: 'none' }}>Trang chủ</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#3e4850' }}>Điều khoản dịch vụ</span>
        </div>

        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00658d', marginBottom: '12px' }}>PHÁP LÝ</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181c1e', marginBottom: '8px' }}>
            Điều khoản dịch vụ
          </h1>
          <p style={{ fontSize: '13px', color: '#8a949d', marginBottom: '40px' }}>Cập nhật lần cuối: 26/03/2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {SECTIONS.map(s => (
              <div key={s.title}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '17px', fontWeight: 700, color: '#181c1e', marginBottom: '10px' }}>{s.title}</h2>
                <p style={{ fontSize: '14px', color: '#3e4850', lineHeight: 1.9 }}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
