import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { X } from 'lucide-react';

interface ViewedItem {
  _id?: string;
  id?: string;
  name: string;
  image: string;
  price: number;
}

const getItemId = (item: ViewedItem) => item._id || item.id || '';

const STORAGE_KEY = 'hobbyshop_viewed';

// Call this from ProductDetailPage to track viewed items
export function trackViewedProduct(product: ViewedItem) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let items: ViewedItem[] = saved ? JSON.parse(saved) : [];
    const pid = getItemId(product);
    // Remove if already exists (move to front)
    items = items.filter(item => getItemId(item) !== pid);
    // Add to front, keep max 10
    items.unshift({ _id: product._id, id: product.id, name: product.name, image: product.image, price: product.price });
    if (items.length > 10) items = items.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

export default function ViewedItems() {
  const [viewedItems, setViewedItems] = useState<ViewedItem[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setViewedItems(JSON.parse(saved));
      }
    } catch { /* ignore */ }
  }, []);

  const clearHistory = () => {
    setViewedItems([]);
    setIsVisible(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!isVisible || viewedItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm uppercase tracking-wide">
            Sản phẩm đã xem gần đây
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={clearHistory}
              className="text-xs text-gray-600 hover:text-[#FF9900] underline"
            >
              Xóa lịch sử
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {viewedItems.map((item) => (
            <Link
              key={getItemId(item)}
              to={`/product/${getItemId(item)}`}
              className="flex-shrink-0 w-32 group"
            >
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-xs font-semibold line-clamp-2 mb-1 group-hover:text-[#FF9900]">
                {item.name}
              </p>
              <p className="text-xs font-bold text-[#FF9900]">
                {item.price.toLocaleString()}đ
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}