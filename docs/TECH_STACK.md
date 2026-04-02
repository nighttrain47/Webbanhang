# 🔧 Công nghệ Sử dụng — HobbyShop Tech Stack

> **Điều hướng nhanh:**
> [README](../README.md) · [Cấu trúc thư mục](./DIRECTORY_STRUCTURE.md) · [Kiến trúc](./ARCHITECTURE.md) · [API](./API_REFERENCE.md) · [Triển khai](./DEPLOYMENT.md) · [Vấn đề & Giải pháp](./PROBLEM_SOLVING.md)

---

## Tổng quan Stack

HobbyShop xây dựng trên **MERN Stack** (MongoDB · Express · React · Node.js) hiện đại, kết hợp TypeScript và các công cụ tối ưu cho tốc độ phát triển và hiệu suất production.

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (React + Vite + TypeScript + TailwindCSS) │
├─────────────────────────────────────────────────────┤
│  BACKEND (Node.js + Express 5)                      │
├─────────────────────────────────────────────────────┤
│  DATABASE (MongoDB + Mongoose ODM)                  │
├─────────────────────────────────────────────────────┤
│  DEPLOYMENT (Vercel + Render + MongoDB Atlas)       │
└─────────────────────────────────────────────────────┘
```

---

## 🌐 Frontend

### React 18
**Lý do chọn:** React là thư viện UI phổ biến nhất, hệ sinh thái lớn, nhiều tài liệu.

**Cơ chế hoạt động trong dự án:**
- **Virtual DOM:** Chỉ re-render đúng component bị thay đổi (ví dụ: cập nhật giỏ hàng không reload trang).
- **React Hooks:** Quản lý state cục bộ với `useState`, side effects với `useEffect`.
- **Context API:** `CartContext` chia sẻ trạng thái giỏ hàng toàn cục mà không cần Redux.
- **React Router DOM:** Điều hướng SPA (Single Page Application) không reload trang.

```tsx
// Ví dụ: CartContext chia sẻ state giỏ hàng
const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  // ...
  return <CartContext.Provider value={{ items, addItem, removeItem }}>
    {children}
  </CartContext.Provider>;
};
```

---

### Vite 5
**Lý do chọn:** Thay thế Create React App (CRA) / Webpack — nhanh hơn cực nhiều.

| Tiêu chí | Create React App | Vite |
| :--- | :--- | :--- |
| Thời gian khởi động | ~15-30 giây | **< 1 giây** |
| Hot Module Replacement | Chậm | **Tức thì** |
| Build production | ~40 giây | **~8 giây** |
| Cơ chế | Bundle trước | ES Modules gốc |

**Cấu hình proxy trong Vite:**
```typescript
// vite.config.ts — proxy API để tránh CORS khi dev local
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

---

### TypeScript 5
**Lý do chọn:** Ngăn lỗi runtime bằng kiểm tra kiểu tĩnh ngay trong IDE.

**Ứng dụng thực tế trong dự án:**
```typescript
// Định nghĩa kiểu cho Product — tránh truy cập field sai tên
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: { _id: string; name: string };
  stock: number;
  isHot?: boolean;
  releaseDate?: string;  // optional cho pre-order
}

// TypeScript sẽ báo lỗi ngay nếu dùng product.titre thay vì product.name
```

**Lợi ích:** Với dự án có 13 pages + 20+ components, TypeScript giúp refactor an toàn và giảm bug 60-70%.

---

### TailwindCSS
**Lý do chọn:** Utility-first CSS — dựng UI nhanh, responsive dễ dàng, không bị xung đột CSS.

**So sánh với CSS thuần:**
```html
<!-- CSS thuần: phải tạo class riêng -->
<div class="product-card">...</div>

<!-- TailwindCSS: class trực tiếp trong HTML -->
<div class="bg-white rounded-xl shadow-md hover:shadow-xl
            transition-all duration-200 p-4 grid grid-cols-2
            lg:grid-cols-4 gap-4">
```

**Responsive trong dự án:**
- Mobile-first: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-4`
- Dark mode: `dark:bg-gray-900 dark:text-white`

---

### UI Libraries
| Thư viện | Mục đích |
| :--- | :--- |
| **Radix UI** | Các component UI accessible: Dialog, Dropdown, Tooltip — không cần tự viết a11y |
| **Lucide React** | Icon library nhẹ, tree-shakeable (chỉ bundle icon dùng thực tế) |
| **Recharts** | Biểu đồ doanh thu trong Admin Dashboard (D3.js-based, React-friendly) |

---

## 🖧 Backend

### Node.js 18
**Lý do chọn:** JavaScript ở phía server — cùng ngôn ngữ với Frontend, tái sử dụng logic.

**Đặc điểm kỹ thuật quan trọng:**
- **Event Loop / Non-blocking I/O:** Node.js xử lý nhiều request đồng thời mà không cần tạo thread mới cho mỗi request.
- **Phù hợp với E-commerce:** Nhiều request đọc dữ liệu đồng thời (browse sản phẩm) không gây nghẽn cổ chai.

---

### Express 5
**Lý do chọn:** Minimal web framework, dễ cấu hình, middleware linh hoạt.

**Cấu trúc routing trong dự án:**
```javascript
// server/index.js
const adminRouter = require('./api/admin');
const customerRouter = require('./api/customer');
const shopRouter = require('./api/shop');

app.use('/api/admin', jwtAuth, adminRouter);    // Protected
app.use('/api/customer', customerRouter);        // Public (một số endpoints cần auth)
app.use('/shop', shopRouter);                    // EJS SSR
```

**Middleware tự viết:**
```javascript
// utils/jwtAuth.js — Middleware xác thực JWT
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};
```

---

### EJS (Embedded JavaScript)
**Lý do chọn:** Server-side rendering cho `/shop` — fallback không cần JavaScript ở client, tốt cho SEO.

Đây là tính năng bổ sung bên cạnh React SPA, phục vụ nhu cầu SSR đơn giản.

---

## 🍃 Database

### MongoDB + Mongoose
**Lý do chọn NoSQL cho E-commerce:**

| Yêu cầu | SQL | MongoDB |
| :--- | :--- | :--- |
| Schema linh hoạt (sản phẩm có/không có `releaseDate`) | ❌ Phải ALTER TABLE | ✅ Tự nhiên |
| Nested data (items trong order) | ❌ JOIN phức tạp | ✅ Embedded documents |
| Scale ngang khi traffic tăng | ❌ Khó | ✅ Sharding built-in |
| Query phức tạp (hạng thành viên) | ✅ SQL mạnh | ✅ Aggregation Pipeline |

**Aggregation Pipeline — tính hạng thành viên:**
```javascript
// CustomerDAO.js — Tính tổng chi tiêu của customer
const result = await Order.aggregate([
  { $match: { customer: customerId, status: 'delivered' } },
  { $group: { _id: null, totalSpent: { $sum: '$totalAmount' } } }
]);

const totalSpent = result[0]?.totalSpent || 0;
const tier = totalSpent >= 5000000 ? 'gold'
           : totalSpent >= 1000000 ? 'silver'
           : 'bronze';
```

---

### Bảo mật Mật khẩu (bcryptjs)
```javascript
// Đăng ký: hash mật khẩu trước khi lưu
const hashedPassword = await bcrypt.hash(password, 12);

// Đăng nhập: so sánh mật khẩu
const isMatch = await bcrypt.compare(inputPassword, storedHash);
```

---

## 📧 Email Service (Nodemailer)

**Lý do chọn:** Library phổ biến nhất cho Node.js, hỗ trợ nhiều dịch vụ SMTP.

**Hai loại email trong hệ thống:**
1. **Email xác minh OTP:** Gửi khi đăng ký tài khoản mới
2. **Email hóa đơn:** Gửi sau khi đặt hàng thành công (HTML template đẹp)

```javascript
// utils/EmailUtil.js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
```

---

## ☁️ Deployment Stack

| Platform | Dịch vụ | Lý do chọn |
| :--- | :--- | :--- |
| **Vercel** | Host Frontend (React) | Free tier mạnh, CDN toàn cầu, auto-deploy khi push Git |
| **Render** | Host Backend (Node.js) | Free tier có persistent service, hỗ trợ Node.js native |
| **MongoDB Atlas** | Database Cloud | Free 512MB, auto-backup, connection string đơn giản |
| **UptimeRobot** | Monitor + Wake | Ping Render mỗi 5 phút để tránh server ngủ đông (free tier) |

> 📖 Chi tiết cấu hình deploy tại [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## So sánh Lựa chọn Công nghệ

### Tại sao không dùng Next.js?
- HobbyShop đã có sẵn backend Node.js riêng → không cần Next.js API routes
- Team quen với Vite + React riêng biệt hơn
- Linh hoạt hơn trong cấu hình routing

### Tại sao không dùng Redux?
- Ứng dụng không đủ phức tạp để cần Redux
- React Context API + `useState` đủ dùng cho CartContext và AuthContext
- Ít boilerplate hơn, code đơn giản hơn

### Tại sao không dùng GraphQL?
- REST API đủ đơn giản và phù hợp với team
- Ít learning curve hơn
- Express + REST đủ linh hoạt cho use case hiện tại

---

*Điều hướng: [⬆️ Về README](../README.md) · [⬅️ Kiến trúc](./ARCHITECTURE.md) · [➡️ Vấn đề & Giải pháp](./PROBLEM_SOLVING.md)*
