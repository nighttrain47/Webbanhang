import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { X } from 'lucide-react';

interface ViewedItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function ViewedItems() {
  const [viewedItems, setViewedItems] = useState<ViewedItem[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Mock data - trong thực tế sẽ lấy từ localStorage
  useEffect(() => {
    const mockViewed: ViewedItem[] = [
      {
        id: '1',
        name: 'Hoshimi Miyabi',
        image: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=200',
        price: 41800
      },
      {
        id: '2',
        name: 'Asuna SAO',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200',
        price: 35000
      },
      {
        id: '3',
        name: 'Rem Re:Zero',
        image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=200',
        price: 28000
      }
    ];
    setViewedItems(mockViewed);
  }, []);

  const clearHistory = () => {
    setViewedItems([]);
    setIsVisible(false);
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
              key={item.id}
              to={`/product/${item.id}`}
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