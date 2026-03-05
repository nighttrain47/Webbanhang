import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ShoppingCart, Heart, ChevronLeft, Star } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductSpecs from '../components/product/ProductSpecs';
import ViewedItems from '../components/product/ViewedItems';
import { mockProducts, bundleItems } from '../data/mockData';
import { Product } from '../App';

interface ProductDetailPageProps {
  addToCart: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  user?: any;
}

export default function ProductDetailPage({ 
  addToCart, 
  wishlist, 
  toggleWishlist, 
  cartCount,
  user 
}: ProductDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartCount={cartCount} user={user} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/" className="text-[#FF9900] hover:underline">
            Back to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock multiple images
  const images = [product.image, product.image, product.image, product.image];

  const bundleTotal = product.price + bundleItems.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = Math.round(bundleTotal * 0.1);
  const bundleFinalPrice = bundleTotal - bundleDiscount;

  return (
    <div className="min-h-screen bg-white pb-32">
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-[#FF9900]">Home</Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>{product.category}</span>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Product Gallery */}
          <div>
            <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-4 border border-gray-200">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-[#FF9900]' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">{product.series}</p>
            <h1 className="text-3xl font-bold mb-4 leading-tight">{product.name}</h1>
            <p className="text-gray-600 mb-6 font-medium">{product.manufacturer}</p>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg mb-6 border-2 border-[#FF9900]">
              <p className="text-4xl font-bold text-[#FF9900] mb-3">
                {product.price.toLocaleString()}đ
              </p>
              <div className="flex items-center gap-3">
                {product.status && (
                  <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.status}
                  </span>
                )}
                <span className="text-sm text-gray-600">+ Earn {Math.floor(product.price * 0.01)} pts</span>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-[#FF9900] text-white py-4 rounded-lg hover:bg-[#E68A00] transition-colors font-bold flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.status === 'Pre-order Open' ? 'Đặt trước ngay' : 'Thêm vào giỏ'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`px-6 py-4 rounded-lg border-2 transition-colors ${
                  wishlist.includes(product.id)
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    wishlist.includes(product.id) ? 'fill-current' : ''
                  }`}
                />
              </button>
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Miễn phí vận chuyển đơn hàng trên 5.000.000đ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Đảm bảo hàng chính hãng - Sản phẩm có license chính thức</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Thanh toán bảo mật với chính sách bảo vệ người mua</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications Section - NEW DESIGN */}
        <div className="max-w-4xl mx-auto mb-12">
          <ProductSpecs product={product} />
        </div>

        {/* Bundle Deal Section */}
        <section className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8 rounded-lg border-2 border-[#FF9900] mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎁 Special Bundle Deal - Save 10%!
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            {/* Main Product */}
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-lg overflow-hidden mb-2 border-2 border-[#FF9900] shadow-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold mb-1 line-clamp-2 w-32">{product.name}</p>
              <p className="text-sm text-gray-600">{product.price.toLocaleString()}đ</p>
            </div>

            <span className="text-2xl text-[#FF9900] font-bold">+</span>

            {/* Bundle Items */}
            {bundleItems.map((item, index) => (
              <div key={item.id}>
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-lg overflow-hidden mb-2 border border-gray-300 shadow-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold mb-1 line-clamp-2 w-32">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.price.toLocaleString()}đ</p>
                </div>
                {index < bundleItems.length - 1 && (
                  <span className="text-2xl text-[#FF9900] font-bold inline-block ml-6">+</span>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg max-w-md mx-auto border border-gray-200">
            <div className="flex justify-between mb-2 text-gray-600 text-sm">
              <span>Regular Price:</span>
              <span className="line-through">{bundleTotal.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between mb-2 text-green-600 font-semibold text-sm">
              <span>Bundle Discount (10%):</span>
              <span>-{bundleDiscount.toLocaleString()}đ</span>
            </div>
            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Bundle Price:</span>
                <span className="text-3xl font-bold text-[#FF9900]">
                  {bundleFinalPrice.toLocaleString()}đ
                </span>
              </div>
            </div>
            <button className="w-full bg-[#FF9900] text-white py-3 rounded-lg hover:bg-[#E68A00] transition-colors font-bold">
              Add Bundle to Cart
            </button>
          </div>
        </section>
      </div>

      {/* Viewed Items Sticky Footer */}
      <ViewedItems />

      <Footer />
    </div>
  );
}