import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import ProductCard from '../components/product/ProductCard';
import { mockProducts } from '../data/mockData';
import { Product } from '../App';

interface HomePageProps {
  addToCart: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  user?: any;
}

export default function HomePage({ addToCart, wishlist, toggleWishlist, cartCount, user }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1753505359049-d96e607102e9?w=1200',
      title: 'Bộ sưu tập Xuân 2027 - Đặt trước',
      subtitle: 'Hàng mới về từ WonFes 2027'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1768178131793-583bad05d224?w=1200',
      title: 'Bộ sưu tập Nendoroid độc quyền',
      subtitle: 'Phiên bản giới hạn đang có sẵn'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1762378821352-d15ee88ed061?w=1200',
      title: 'Bộ sưu tập nhạc Anime',
      subtitle: 'OST chính thức & bài hát nhân vật'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} user={user} />

      {/* Two Column Layout */}
      <div className="flex">
        {/* Left Sidebar - 20-25% width */}
        <div className="hidden lg:block w-1/4 max-w-xs">
          <Sidebar />
        </div>

        {/* Right Content - 75-80% width */}
        <div className="flex-1 w-full lg:w-3/4">
          {/* Hero Slider */}
          <section className="relative h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="min-w-full h-full relative"
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="text-white max-w-2xl px-4">
                      <h2 className="text-3xl lg:text-5xl font-bold mb-4">{banner.title}</h2>
                      <p className="text-lg lg:text-xl mb-8">{banner.subtitle}</p>
                      <Link
                        to="#"
                        className="inline-block bg-[#FF9900] text-white px-6 lg:px-8 py-2 lg:py-3 rounded-lg hover:bg-[#E68A00] transition-colors font-semibold text-sm lg:text-base"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-2 lg:p-3 rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-2 lg:p-3 rounded-full transition-all"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all ${
                    currentSlide === index ? 'bg-[#FF9900] w-6 lg:w-8' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </section>

          {/* Featured Sections */}
          <div className="px-4 lg:px-6">
            {/* Quick Stats Banner */}
            <section className="py-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-[#FF9900] mb-1">2,840</p>
                  <p className="text-xs text-gray-600">Tổng Figures</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-green-600 mb-1">156</p>
                  <p className="text-xs text-gray-600">Mới tuần này</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-blue-600 mb-1">89</p>
                  <p className="text-xs text-gray-600">Đang mở Pre-order</p>
                </div>
              </div>
            </section>

            {/* Product Grid - Latest Products */}
            <section className="py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Hàng mới về</h2>
                <Link to="#" className="text-[#FF9900] hover:underline font-semibold text-sm">
                  Xem tất cả →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mockProducts.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.includes(product.id)}
                  />
                ))}
              </div>
            </section>

            {/* Featured Banner */}
            <section className="py-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Cảnh báo phiên bản giới hạn! 🎯</h3>
                <p className="mb-4">Figure độc quyền WonFes 2027 đã có sẵn</p>
                <Link
                  to="#"
                  className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Mua phiên bản giới hạn
                </Link>
              </div>
            </section>

            {/* Product Grid - Pre-orders */}
            <section className="py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold">Đặt trước ngay</h2>
                  <p className="text-sm text-gray-600 mt-1">Đảm bảo sản phẩm yêu thích trước khi phát hành</p>
                </div>
                <Link to="#" className="text-[#FF9900] hover:underline font-semibold text-sm">
                  Tất cả Pre-orders →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mockProducts.filter(p => p.status === 'Pre-order Open').map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.includes(product.id)}
                  />
                ))}
              </div>
            </section>

            {/* Newsletter Banner */}
            <section className="py-8 pb-12">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Không bỏ lỡ bất kỳ sản phẩm nào! 📬</h3>
                <p className="mb-6">Đăng ký để nhận thông báo pre-order và ưu đãi độc quyền</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="bg-white text-[#FF9900] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    Đăng ký
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}