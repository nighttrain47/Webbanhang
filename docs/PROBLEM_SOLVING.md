# 🧩 Vấn đề Gặp phải & Cách Giải quyết

> **Điều hướng nhanh:**
> [README](../README.md) · [Cấu trúc thư mục](./DIRECTORY_STRUCTURE.md) · [Kiến trúc](./ARCHITECTURE.md) · [Công nghệ](./TECH_STACK.md) · [API](./API_REFERENCE.md) · [Triển khai](./DEPLOYMENT.md)

---

Tài liệu này ghi lại các vấn đề kỹ thuật thực tế gặp phải trong quá trình phát triển HobbyShop và cách chúng được giải quyết. Đây là nguồn tham khảo hữu ích để tránh lặp lại lỗi và hiểu lý do đằng sau các quyết định thiết kế.

---

## 🔴 Vấn đề 1: CORS khi Frontend gọi Backend

### Triệu chứng
```
Access to fetch at 'http://localhost:5000/api/customer/products'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

### Nguyên nhân
Browser chặn request từ origin khác (port 3000 ≠ port 5000) theo chính sách Same-Origin Policy.

### Giải pháp

**Phía Backend** — Cấu hình CORS với domain whitelist:
```javascript
// server/index.js
const cors = require('cors');
app.use(cors({
  origin: [
    process.env.CLIENT_URL,    // http://localhost:3000 (dev)
    process.env.ADMIN_URL,     // http://localhost:3001 (dev)
    'https://hobby-shop-client.vercel.app',   // production
    'https://hobby-shop-admin.vercel.app'
  ],
  credentials: true            // Cho phép gửi cookie/session
}));
```

**Phía Frontend (dev)** — Proxy qua Vite để tránh CORS hoàn toàn:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

---

## 🔴 Vấn đề 2: Render Free Tier "Ngủ đông" (Cold Start)

### Triệu chứng
Server Render mất 30-60 giây để phản hồi khi không có traffic trong ~15 phút.

### Nguyên nhân
Render Free tier tự động spin down (tắt) server sau thời gian không hoạt động để tiết kiệm tài nguyên.

### Giải pháp
Dùng **UptimeRobot** (miễn phí) ping endpoint `/api/health` mỗi 5 phút:

```javascript
// server/index.js — Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

Cấu hình UptimeRobot:
- Monitor type: HTTP(s)
- URL: `https://hobbyshop-api.onrender.com/api/health`
- Interval: 5 phút

> ⚠️ Lưu ý: UptimeRobot chỉ prevent cold start, không giải quyết hoàn toàn. Nếu cần production thực sự, cần nâng cấp Render plan.

---

## 🔴 Vấn đề 3: JWT Token Hết hạn Không Thông báo

### Triệu chứng
Người dùng đang dùng web thì đột nhiên bị lỗi 401/403 mà không có thông báo rõ ràng, phải reload trang thủ công.

### Nguyên nhân
Token JWT có thời hạn 7 ngày nhưng không có cơ chế refresh tự động hoặc thông báo người dùng.

### Giải pháp

**Interceptor tập trung xử lý 401:**
```typescript
// services/api.ts
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 401) {
    // Token hết hạn → logout và redirect
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  return response;
};
```

---

## 🔴 Vấn đề 4: Dependency Conflict khi `npm install`

### Triệu chứng
```
npm error ERESOLVE unable to resolve dependency tree
npm error  peer react@">=16.0.0 <18.0.0" from radix-ui@...
```

### Nguyên nhân
Một số package Radix UI và các UI libraries cũ yêu cầu React < 18, nhưng dự án dùng React 18.

### Giải pháp
```bash
# Dùng --legacy-peer-deps để bỏ qua strict peer dependency check
npm install --legacy-peer-deps
```

Đã được tích hợp vào root script:
```json
// package.json
"install:all": "cd server && npm install && cd ../client-customer && npm install --legacy-peer-deps && cd ../client-admin && npm install --legacy-peer-deps"
```

---

## 🔴 Vấn đề 5: Hạng Thành viên Tính Sai

### Triệu chứng
Khách hàng có đơn hàng đã giao nhưng hạng thành viên vẫn hiển thị Bronze, không cập nhật lên Silver/Gold.

### Nguyên nhân
Logic tính hạng ban đầu đếm cả đơn hàng ở trạng thái `pending` và `cancelled`, không chỉ `delivered`.

### Giải pháp
Chỉ tính tổng chi tiêu từ đơn hàng có status `delivered`:

```javascript
// CustomerDAO.js
const calculateMembership = async (customerId) => {
  const result = await Order.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(customerId),
        status: 'delivered'  // ← Chỉ tính đơn đã giao xong
      }
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: '$totalAmount' }
      }
    }
  ]);

  const totalSpent = result[0]?.totalSpent || 0;
  return {
    tier: totalSpent >= 5000000 ? 'gold'
        : totalSpent >= 1000000 ? 'silver'
        : 'bronze',
    totalSpent,
    discountRate: totalSpent >= 5000000 ? 0.08
                : totalSpent >= 1000000 ? 0.05
                : 0.02
  };
};
```

---

## 🔴 Vấn đề 6: Countdown Timer Pre-order Bị Lỗi Với Nhiều Định dạng Ngày

### Triệu chứng
Countdown timer trên trang chủ không hoạt động hoặc hiển thị "NaN days" với một số sản phẩm pre-order.

### Nguyên nhân
Trường `releaseDate` trong database lưu với nhiều định dạng khác nhau:
- `"2024-06-01"` (ISO string)
- `"01/06/2024"` (DD/MM/YYYY)
- `ISODate("2024-06-01T00:00:00Z")` (MongoDB Date object)

`new Date(dateString)` không parse được tất cả định dạng trên cross-browser.

### Giải pháp
Viết hàm parse linh hoạt:
```typescript
const parseReleaseDate = (dateInput: unknown): Date | null => {
  if (!dateInput) return null;

  // Đã là Date object (từ MongoDB)
  if (dateInput instanceof Date) return dateInput;

  const str = String(dateInput);

  // Format: DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [day, month, year] = str.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // Format: YYYY-MM-DD hoặc ISO string
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date;
};
```

---

## 🔴 Vấn đề 7: Trạng thái Đơn hàng Không Hiện trong MyAccount

### Triệu chứng
Trang MyAccount hiển thị lịch sử đơn hàng nhưng cột "Trạng thái" trống hoặc hiển thị `undefined`.

### Nguyên nhân
API trả về field `status` nhưng frontend mapping sang key tên khác (`orderStatus`) do refactor không đồng bộ giữa backend và frontend.

### Giải pháp
Đồng bộ hóa interface TypeScript với response thực tế từ API:

```typescript
// Kiểm tra response thực tế
interface Order {
  _id: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  // ← Dùng đúng key 'status', không phải 'orderStatus'
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

// UI mapping
const statusLabel: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
};
```

---

## 🔴 Vấn đề 8: Phương thức Thanh toán Không Lưu vào Database

### Triệu chứng
Admin xem đơn hàng thì trường "Phương thức thanh toán" luôn trống dù khách hàng đã chọn COD/Chuyển khoản.

### Nguyên nhân
Checkout component gửi `paymentMethod` trong request body nhưng `OrderDAO.js` schema không có field này, Mongoose tự động bỏ qua.

### Giải pháp
Thêm field vào Mongoose Schema:

```javascript
// models/OrderDAO.js
const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [orderItemSchema],
  shippingAddress: { /* ... */ },
  paymentMethod: {           // ← Thêm field này
    type: String,
    enum: ['COD', 'bank_transfer', 'momo'],
    default: 'COD'
  },
  totalAmount: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 🔴 Vấn đề 9: Mobile Layout Bị Vỡ Trên Màn hình Nhỏ

### Triệu chứng
Footer bị tràn ngang, product grid không wrap, form checkout không fit màn hình mobile.

### Nguyên nhân
Sử dụng fixed width (`width: 800px`) thay vì responsive units, và một số `flex` container thiếu `flex-wrap`.

### Giải pháp
Áp dụng mobile-first với TailwindCSS:

```html
<!-- Product Grid: 1 cột mobile → 2 cột tablet → 4 cột desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<!-- Footer: stack dọc mobile → ngang desktop -->
<footer class="flex flex-col md:flex-row gap-8">

<!-- Form: full width mobile -->
<form class="w-full max-w-2xl mx-auto px-4">
```

---

## 🟡 Vấn đề 10: Server Restart Mất Session Cart (EJS Shop)

### Triệu chứng
Người dùng đang duyệt `/shop` (EJS) thì giỏ hàng biến mất sau khi server restart.

### Nguyên nhân
Session được lưu in-memory mặc định — bị xóa khi restart.

### Giải pháp
Sử dụng `connect-mongo` để persist session vào MongoDB:

```javascript
// server/index.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }  // 1 ngày
}));
```

---

## Tổng kết — Lessons Learned

| # | Vấn đề | Bài học |
| :--- | :--- | :--- |
| 1 | CORS | Luôn whitelist origins cụ thể, không dùng `*` ở production |
| 2 | Cold start | Free tier có limitation — cần giải pháp wake-up hoặc nâng cấp |
| 3 | JWT expire | Xây dựng interceptor tập trung từ đầu |
| 4 | Peer deps | Dùng `--legacy-peer-deps` cho projects với mixed library versions |
| 5 | Business logic | Luôn filter đúng điều kiện (status = delivered) |
| 6 | Date parsing | Chuẩn hóa format ngày trong DB ngay từ đầu |
| 7 | API contract | Dùng TypeScript interfaces để đồng bộ Frontend ↔ Backend |
| 8 | Schema | Thêm field vào Schema trước khi code feature |
| 9 | Mobile | Mobile-first từ đầu — tránh sửa lại sau |
| 10 | Session | Luôn dùng persistent store cho session |

---

*Điều hướng: [⬆️ Về README](../README.md) · [⬅️ Công nghệ](./TECH_STACK.md) · [➡️ Triển khai](./DEPLOYMENT.md)*
