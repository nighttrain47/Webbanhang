import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Search, Trash2, MessageSquare, X, Star } from 'lucide-react';

interface Review {
  _id: string;
  productId: { _id: string, name: string, image: string } | null;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Giả sử API trả về { reviews: [...] }
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.')) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`http://localhost:5000/api/admin/reviews/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setReviews(reviews.filter(r => r._id !== id));
        } else {
          alert('Có lỗi xảy ra khi xóa');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.productId && r.productId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star 
        key={idx} 
        size={14} 
        className={idx < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Đánh giá</h1>
          <p className="text-gray-500 mt-1">Quản lý các nhận xét và đánh giá của khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người đánh giá, tên sp hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Đánh giá</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nội dung</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Chưa có đánh giá nào</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {review.userName}
                    </td>
                    <td className="px-6 py-4">
                      {review.productId ? (
                        <div className="flex items-center gap-3">
                          {review.productId.image && (
                            <img src={review.productId.image} alt={review.productId.name} className="w-8 h-8 object-cover rounded shadow-sm" />
                          )}
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[200px] block" title={review.productId.name}>
                            {review.productId.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Sản phẩm đã xóa</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-sm">
                      <p className="truncate" title={review.comment}>{review.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDelete(review._id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        title="Xóa đánh giá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
