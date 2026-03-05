import { useState } from 'react';
import { ChevronDown, ChevronUp, Ruler, Package, AlertCircle } from 'lucide-react';

interface ProductSpecsProps {
  product: {
    name: string;
    series: string;
    manufacturer: string;
    price: number;
    specs?: {
      material: string;
      size: string;
      sculptor: string;
      releaseDate: string;
    };
  };
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const dataGridInfo = [
    { label: 'Ngày phát hành', value: product.specs?.releaseDate || 'Tháng 2-2027' },
    { label: 'Giá niêm yết', value: `${product.price.toLocaleString()}đ` },
    { label: 'Mã sản phẩm', value: 'FIGURE-197897' },
    { label: 'Mã JAN', value: '6942630809001' },
    { label: 'Thương hiệu', value: product.manufacturer },
    { label: 'Series', value: product.series },
    { label: 'Nhân vật', value: product.name.split(' - ')[0] || product.name },
  ];

  const setContents = [
    'Mô hình chính',
    'Đế trưng bày',
    'Phụ kiện tóc (Bonus)',
    'Hướng dẫn sử dụng'
  ];

  return (
    <div className="space-y-6">
      {/* Khối 1: Data Grid - About this item */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
          <h3 className="font-bold text-sm uppercase tracking-wide">Thông tin sản phẩm</h3>
        </div>
        
        <div className="divide-y divide-gray-300">
          {dataGridInfo.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 text-sm border-r border-gray-300 last:border-r-0"
            >
              <div className="px-4 py-2.5 bg-gray-50 font-medium text-gray-700 border-r border-gray-300">
                {item.label}
              </div>
              <div className="px-4 py-2.5 text-gray-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Purchase Limit Warning */}
        <div className="bg-orange-50 border-t-2 border-orange-400 px-4 py-3">
          <p className="text-sm font-bold text-orange-700">
            ⚠️ Giới hạn mua: 1 sản phẩm/tài khoản
          </p>
        </div>
      </div>

      {/* Khối 2: Specifications & Set Contents */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Specifications */}
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
          <h3 className="font-bold text-sm uppercase tracking-wide">Thông số kỹ thuật</h3>
        </div>
        
        <div className="px-4 py-4 border-b border-gray-300">
          <div className="flex items-center gap-6 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Tỷ lệ:</span>
              <span className="font-semibold text-gray-900">1/7</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Kích thước:</span>
              <span className="font-semibold text-gray-900">
                {product.specs?.size || 'Cao khoảng 29.1cm'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Chất liệu:</span>
              <span className="font-semibold text-gray-900">
                {product.specs?.material || 'PVC & ABS'}
              </span>
            </div>
          </div>
          
          {product.specs?.sculptor && (
            <div className="mt-3 text-sm">
              <span className="text-gray-700">Nghệ sĩ điêu khắc:</span>
              <span className="font-semibold text-gray-900 ml-2">
                {product.specs.sculptor}
              </span>
            </div>
          )}
        </div>

        {/* Set Contents */}
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
          <h3 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <Package className="w-4 h-4" />
            Nội dung bộ sản phẩm
          </h3>
        </div>
        
        <div className="px-4 py-4 border-b border-gray-300">
          <ul className="space-y-2 text-sm">
            {setContents.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#FF9900] font-bold">•</span>
                <span className="text-gray-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <div className="bg-gray-50 px-4 py-3">
          <p className="text-xs text-gray-600">
            © miHoYo. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Khối 3: Important Notes - Accordion */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <button
          onClick={() => setIsNotesExpanded(!isNotesExpanded)}
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#FF9900]" />
            <h3 className="font-bold text-sm uppercase tracking-wide">
              Lưu ý quan trọng / Điều khoản đặt trước
            </h3>
          </div>
          {isNotesExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {isNotesExpanded && (
          <div className="px-4 py-4 bg-white border-t border-gray-300">
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-2">📦 Thông tin đặt trước</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Đây là sản phẩm đặt hàng trước. Sản xuất bắt đầu sau khi kết thúc đợt đặt hàng.</li>
                  <li>Ngày phát hành có thể thay đổi. Chúng tôi sẽ thông báo nếu có chậm trễ.</li>
                  <li>Được phép hủy đặt trước cho đến khi đợt đặt hàng kết thúc.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">🎁 Quà tặng đợt đầu tiên</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Quà tặng giới hạn chỉ có cho đợt sản xuất đầu tiên.</li>
                  <li>Ưu tiên theo nguyên tắc đặt trước có trước.</li>
                  <li>Quà tặng hết hàng không thể nhập lại.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">⚠️ Lưu ý sản phẩm</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Hình ảnh chỉ mang tính chất tham khảo. Sản phẩm thực tế có thể hơi khác biệt.</li>
                  <li>Màu sắc có thể khác nhau tùy theo cài đặt màn hình.</li>
                  <li>Sản phẩm này không phải đồ chơi. Không phù hợp cho trẻ dưới 15 tuổi.</li>
                  <li>Prototype được trưng bày. Sản phẩm cuối cùng có thể thay đổi.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">💳 Thanh toán & Vận chuyển</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Thanh toán sẽ được tính khi sản phẩm sẵn sàng giao.</li>
                  <li>Chi phí vận chuyển được tính dựa trên trọng lượng gói hàng thực tế.</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 p-3 rounded mt-4">
                <p className="font-semibold text-yellow-800 mb-1">
                  ⚠️ Nhắc nhở quan trọng
                </p>
                <p className="text-xs text-yellow-700">
                  Khi đặt trước, bạn đồng ý mua sản phẩm khi có hàng. 
                  Không hoàn tất thanh toán có thể dẫn đến hạn chế tài khoản.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}