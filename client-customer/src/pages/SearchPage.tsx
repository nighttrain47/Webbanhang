import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useSearchParams, Link } from 'react-router';
import { Search, SlidersHorizontal, ChevronLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../App';

interface SearchPageProps {
  addToCart: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  user?: any;
}

export default function SearchPage({ addToCart, wishlist, toggleWishlist, cartCount, user }: SearchPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
    if (query.trim()) {
      fetchResults(query, 1);
    } else {
      setProducts([]);
      setTotal(0);
    }
  }, [query]);

  const fetchResults = async (keyword: string, p: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customer/products/search/${encodeURIComponent(keyword)}?page=${p}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchResults(query, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cartCount} user={user} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#FF6B00]">Trang chủ</Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span className="text-gray-900 font-medium">Tìm kiếm</span>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-5 py-4 pr-14 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-lg"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-2.5 rounded-lg hover:bg-[#E55D00] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Results */}
        {query.trim() && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {isLoading ? 'Đang tìm kiếm...' : (
                <>
                  Kết quả cho "<span className="text-[#FF6B00]">{query}</span>"
                  <span className="text-gray-500 text-lg font-normal ml-2">({total} sản phẩm)</span>
                </>
              )}
            </h1>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isInWishlist={wishlist.includes(product._id || (product.id as string))}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      page === p
                        ? 'bg-[#FF6B00] text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : query.trim() ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nhập từ khóa để tìm kiếm</h3>
            <p className="text-gray-500">Tìm figure, CD, goods và nhiều hơn nữa</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
