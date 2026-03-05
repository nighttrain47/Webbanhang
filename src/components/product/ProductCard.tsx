import { Link } from 'react-router';
import { Product } from '../../App';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
      <Link to={`/product/${product.id}`} className="block relative group">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {product.status && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {product.status}
          </span>
        )}
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.series}</p>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-semibold line-clamp-2 hover:text-[#FF9900] transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3">{product.manufacturer}</p>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-[#FF9900]">
            {product.price.toLocaleString()}đ
          </p>
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`p-2 rounded-full transition-colors ${
              isInWishlist
                ? 'bg-red-50 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isInWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full mt-3 bg-[#FF9900] text-white py-2 rounded-lg hover:bg-[#E68A00] transition-colors font-semibold text-sm"
        >
          {product.status === 'Pre-order Open' ? 'Đặt trước' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
}