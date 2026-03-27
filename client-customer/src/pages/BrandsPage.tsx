import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { API_URL } from '../config';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface PageProps {
  cartCount: number;
  user?: any;
}

interface Brand {
  _id: string;
  name: string;
  image?: string;
  description?: string;
}

export default function BrandsPage({ cartCount, user }: PageProps) {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    document.title = 'Thương hiệu | FigureCurator';
    fetch(`${API_URL}/api/customer/brands`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setBrands(data); })
      .catch(console.error);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: "'Inter', sans-serif" }}>
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8a949d', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#8a949d', textDecoration: 'none' }}>Trang chủ</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span style={{ color: '#3e4850' }}>Thương hiệu</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00658d', marginBottom: '12px' }}>THƯƠNG HIỆU</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181c1e', marginBottom: '12px' }}>
            Đối tác & Thương hiệu
          </h1>
          <p style={{ fontSize: '14px', color: '#6e7881', maxWidth: '500px', margin: '0 auto' }}>
            Chúng tôi hợp tác trực tiếp với các nhà sản xuất uy tín hàng đầu để mang đến sản phẩm chính hãng.
          </p>
        </div>

        {brands.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {brands.map(brand => (
              <div key={brand._id} style={{
                padding: '28px 20px', borderRadius: '16px', background: '#fff',
                border: '1px solid #e8ecef', textAlign: 'center',
                transition: 'box-shadow 200ms, transform 200ms', cursor: 'pointer',
              }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
              >
                {brand.image ? (
                  <img src={brand.image} alt={brand.name} style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 12px', borderRadius: '12px' }} />
                ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(0,101,141,0.08)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#00658d' }}>storefront</span>
                  </div>
                )}
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#181c1e' }}>{brand.name}</h3>
                {brand.description && (
                  <p style={{ fontSize: '12px', color: '#8a949d', marginTop: '6px', lineHeight: 1.5 }}>{brand.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#8a949d', opacity: 0.3, display: 'block', marginBottom: '8px' }}>storefront</span>
            <p style={{ fontSize: '14px', color: '#8a949d' }}>Đang tải thương hiệu...</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
