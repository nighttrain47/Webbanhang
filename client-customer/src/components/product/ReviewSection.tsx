import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Star, MessageSquare } from 'lucide-react';

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  user?: any;
}

export default function ReviewSection({ productId, user }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customer/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải bình luận:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return alert('Vui lòng nhập nội dung đánh giá!');
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const body = {
        userName: user?.name || user?.username || 'Khách hàng ẩn danh',
        rating,
        comment,
        userId: user?.id || null,
      };

      const res = await fetch(`${API_URL}/api/customer/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) {
        setComment('');
        setRating(5);
        fetchReviews(); // Reload new comments
      } else {
        alert(data.message || 'Lỗi khi gửi đánh giá');
      }
    } catch (error) {
      console.error(error);
      alert('Không thể kết nối với server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAverage = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mt-8 shadow-sm">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <MessageSquare className="w-6 h-6 text-[#FF6B00]" />
        Đánh giá & Bình luận
      </h3>

      <div className="flex flex-col md:flex-row gap-8 mb-10 pb-8 border-b">
        {/* Điểm tổng quan */}
        <div className="md:w-1/3 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
          <p className="text-5xl font-bold text-gray-800 mb-2">
            {currentAverage} <span className="text-xl text-gray-500 font-normal">/ 5</span>
          </p>
          <div className="flex text-[#FF6B00] mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-5 h-5 ${star <= Number(currentAverage) ? 'fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-sm text-gray-500">{reviews.length} lượt đánh giá</p>
        </div>

        {/* Form Đánh giá */}
        <div className="md:w-2/3">
          <h4 className="font-semibold mb-3 text-lg">Gửi đánh giá của bạn</h4>
          {!user && (
            <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4">
              Vui lòng đăng nhập để đánh giá bằng tài khoản thực để tích lũy điểm thưởng! (Đánh giá ẩn danh vẫn được chấp nhận)
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">Chất lượng sản phẩm:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="p-1 focus:outline-none transition-colors"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        (hoveredStar !== null ? star <= hoveredStar :    star <= rating)
                          ? 'fill-[#FF6B00] text-[#FF6B00]'
                          : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này (Màu sắc, chi tiết, đóng gói...)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none resize-none"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#FF6B00] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#E55D00] transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
            </button>
          </form>
        </div>
      </div>

      {/* Danh sách bình luận */}
      <div className="space-y-6">
        <h4 className="font-semibold text-lg">Đánh giá mới nhất</h4>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex justify-center items-center text-white font-bold">
                      {r.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{r.userName}</p>
                      <div className="flex text-[#FF6B00] mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${star <= r.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-gray-700 mt-3 text-sm leading-relaxed pl-14">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
