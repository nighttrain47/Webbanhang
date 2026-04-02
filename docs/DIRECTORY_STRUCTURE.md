# 🗂️ Cấu trúc Thư mục Dự án HobbyShop

> **Điều hướng nhanh:**
> [README](../README.md) · [Kiến trúc](./ARCHITECTURE.md) · [Công nghệ](./TECH_STACK.md) · [API](./API_REFERENCE.md) · [Triển khai](./DEPLOYMENT.md) · [Vấn đề & Giải pháp](./PROBLEM_SOLVING.md)

---

## Tổng quan

Dự án HobbyShop là một **monorepo** chứa 3 ứng dụng độc lập cùng chia sẻ một cơ sở dữ liệu:

```
HobbyShop/                         ← Thư mục gốc (monorepo)
├── server/                        ← 🖧 Backend API
├── client-customer/               ← 🌐 Customer Website
├── client-admin/                  ← 🛠️ Admin Panel
├── docs/                          ← 📚 Tài liệu chi tiết
├── DOC_GIAI_THICH_DU_AN.md        ← 📘 Báo cáo kỹ thuật tổng quan
├── README.md                      ← 🏠 Trang chủ GitHub
└── package.json                   ← Root scripts (monorepo runner)
```

---

## 🖧 `server/` — Backend (Node.js + Express)

```
server/
├── index.js                       ← Entry point: khởi tạo Express, kết nối DB, mount routes
├── package.json                   ← Dependencies riêng của server
├── .env                           ← ⚠️ Biến môi trường (KHÔNG commit lên Git)
├── .env.example                   ← Template cấu hình môi trường
│
├── api/                           ← 📡 Định nghĩa API routes
│   ├── admin.js                   ← Endpoints quản trị (/api/admin/*)
│   ├── customer.js                ← Endpoints khách hàng (/api/customer/*)
│   └── shop.js                   ← Routes EJS server-side rendering (/shop/*)
│
├── models/                        ← 🗃️ Mongoose Schemas & DAOs
│   ├── ProductDAO.js              ← Sản phẩm: CRUD, lọc, tìm kiếm, phân trang
│   ├── OrderDAO.js                ← Đơn hàng: tạo, cập nhật trạng thái, lịch sử
│   ├── CustomerDAO.js             ← Khách hàng: đăng ký, xác thực, hạng thành viên
│   ├── CategoryDAO.js             ← Danh mục sản phẩm
│   ├── BrandDAO.js                ← Thương hiệu
│   ├── ArticleDAO.js              ← Bài viết / Blog
│   └── ReviewDAO.js               ← Đánh giá sản phẩm
│
├── utils/                         ← 🔧 Tiện ích dùng chung
│   ├── db.js                      ← Kết nối MongoDB qua Mongoose
│   ├── jwtAuth.js                 ← Middleware xác thực JWT
│   └── EmailUtil.js               ← Gửi email qua Nodemailer (OTP, hóa đơn)
│
└── views/                         ← 🖼️ EJS templates (server-side rendering)
    └── ...                        ← Các file .ejs cho giao diện /shop
```

### Chi tiết file quan trọng

#### `server/index.js`
File khởi tạo toàn bộ server:
- Kết nối MongoDB qua `utils/db.js`
- Cấu hình middleware: CORS, express-session, cookie-parser
- Mount routes: `/api/admin`, `/api/customer`, `/shop`
- Lắng nghe port (mặc định: 5000)

#### `server/models/ProductDAO.js`
- Schema: tên, mô tả, giá, danh mục, brand, hình ảnh, số lượng, ngày ra mắt (pre-order), trạng thái
- Functions: `getAll()`, `getById()`, `search()`, `getByCategory()`, `getNew()`, `getHot()`

#### `server/models/CustomerDAO.js`
- Schema: email, mật khẩu (bcrypt), hạng thành viên, điểm tích lũy, OTP token
- Tính năng đặc biệt: phân hạng thành viên dựa trên tổng chi tiêu (Aggregation Pipeline)

#### `server/models/OrderDAO.js`
- Schema: khách hàng, danh sách sản phẩm, địa chỉ giao hàng, phương thức thanh toán, trạng thái, timestamp
- Trạng thái đơn: `pending` → `confirmed` → `shipping` → `delivered` / `cancelled`

#### `server/utils/EmailUtil.js`
- Gửi email xác minh tài khoản (OTP)
- Gửi email hóa đơn sau khi đặt hàng thành công
- Sử dụng Nodemailer với SMTP (Gmail/SendGrid)

---

## 🌐 `client-customer/` — Customer Website

```
client-customer/
├── package.json
├── vite.config.ts                 ← Vite configuration, proxy API
├── tailwind.config.js             ← TailwindCSS configuration
├── index.html                     ← Entry HTML
└── src/
    ├── main.tsx                   ← Entry point React
    ├── App.tsx                    ← Router setup (react-router-dom)
    ├── config.ts                  ← API base URL config
    ├── index.css                  ← Global styles + TailwindCSS imports
    │
    ├── pages/                     ← 📄 13 trang của website
    │   ├── HomePage.tsx           ←   Trang chủ: banner, sản phẩm mới, hot, pre-order
    │   ├── CategoryPage.tsx       ←   Trang danh mục: lọc, sắp xếp, phân trang
    │   ├── ProductDetailPage.tsx  ←   Chi tiết sản phẩm: ảnh, mô tả, đánh giá
    │   ├── CartPage.tsx           ←   Giỏ hàng: cập nhật số lượng, tính tổng
    │   ├── SearchPage.tsx         ←   Kết quả tìm kiếm
    │   ├── BlogPage.tsx           ←   Danh sách bài viết
    │   ├── ArticleDetailPage.tsx  ←   Chi tiết bài viết
    │   ├── AboutPage.tsx          ←   Giới thiệu cửa hàng
    │   ├── BrandsPage.tsx         ←   Danh sách thương hiệu
    │   ├── ContactPage.tsx        ←   Liên hệ
    │   ├── SupportPage.tsx        ←   Hỗ trợ / FAQ
    │   ├── PrivacyPage.tsx        ←   Chính sách bảo mật
    │   └── TermsPage.tsx          ←   Điều khoản sử dụng
    │
    ├── components/                ← 🧩 Các component tái sử dụng
    │   ├── Login.tsx              ←   Form đăng nhập / đăng ký / quên mật khẩu
    │   ├── Checkout.tsx           ←   Quy trình thanh toán (địa chỉ, phương thức)
    │   ├── MyAccount.tsx          ←   Trang hồ sơ: thông tin, đơn hàng, hạng thành viên
    │   ├── OrderConfirmation.tsx  ←   Trang xác nhận đặt hàng thành công
    │   ├── layout/                ←   Header, Footer, Navigation
    │   ├── product/               ←   ProductCard, ProductGrid, FilterSidebar
    │   └── ui/                   ←   Các component UI cơ bản (Button, Modal, Badge...)
    │
    └── services/                  ← 🔌 API service layer
        └── ...                    ←   Fetch/axios wrappers cho từng domain
```

### Chi tiết component quan trọng

#### `src/App.tsx`
Định nghĩa toàn bộ routing với `react-router-dom`:
- Public routes: trang chủ, sản phẩm, giỏ hàng, blog...
- Protected routes: checkout, tài khoản (yêu cầu đăng nhập)
- Context Providers: CartContext, AuthContext

#### `src/pages/HomePage.tsx`
Trang chủ với các section:
- Hero banner động
- Sản phẩm mới (`/api/customer/products/new`)
- Sản phẩm hot (`/api/customer/products/hot`)
- Section Pre-order với countdown timer thực
- Danh sách thương hiệu

#### `src/components/MyAccount.tsx`
Component phức tạp nhất phía frontend:
- Quản lý tab: Thông tin cá nhân, Lịch sử đơn hàng, Hạng thành viên
- Hiển thị membership tier (Bronze/Silver/Gold) dựa trên tổng chi tiêu
- Chỉnh sửa thông tin, đổi mật khẩu

---

## 🛠️ `client-admin/` — Admin Panel

```
client-admin/
├── package.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx                        ← Router + Layout
    ├── config.ts                      ← API URL config
    ├── index.css                      ← Global styles
    └── components/
        ├── admin/                     ← 🛠️ 12 màn hình quản trị
        │   ├── AdminLogin.tsx         ←   Trang đăng nhập admin
        │   ├── AdminDashboard.tsx     ←   Layout + routing nội bộ
        │   ├── AdminSidebar.tsx       ←   Sidebar navigation
        │   ├── DashboardOverview.tsx  ←   Tổng quan: doanh thu, đơn hàng, người dùng
        │   ├── ProductManagement.tsx  ←   CRUD sản phẩm (file lớn nhất: ~53KB)
        │   ├── OrderManagement.tsx    ←   Quản lý đơn hàng + cập nhật trạng thái
        │   ├── CustomerManagement.tsx ←   Danh sách & chi tiết khách hàng
        │   ├── CategoryManagement.tsx ←   CRUD danh mục
        │   ├── BrandManagement.tsx    ←   CRUD thương hiệu
        │   ├── ArticleManagement.tsx  ←   CRUD bài viết
        │   ├── ReviewManagement.tsx   ←   Quản lý & duyệt đánh giá
        │   └── ReportsAnalytics.tsx   ←   Biểu đồ doanh thu (Recharts)
        └── ui/                        ← UI components dùng chung
```

---

## 📚 `docs/` — Tài liệu

```
docs/
├── DIRECTORY_STRUCTURE.md   ← (file này) Giải thích cấu trúc thư mục
├── ARCHITECTURE.md          ← Kiến trúc hệ thống và luồng giao tiếp
├── TECH_STACK.md            ← Công nghệ và lý do lựa chọn
├── PROBLEM_SOLVING.md       ← Vấn đề gặp phải và cách giải quyết
├── DEPLOYMENT.md            ← Hướng dẫn triển khai Cloud
└── API_REFERENCE.md         ← Tài liệu REST API đầy đủ
```

---

## 📄 Files Quan trọng ở Thư mục Gốc

| File | Vai trò |
| :--- | :--- |
| `package.json` | Root monorepo scripts: `install:all`, `dev:server/customer/admin`, `build:*` |
| `README.md` | Trang chủ GitHub — hướng dẫn cài đặt và overview |
| `DOC_GIAI_THICH_DU_AN.md` | Báo cáo kỹ thuật dự án |
| `.gitignore` | Loại trừ `node_modules`, `.env`, `dist` khỏi Git |
| `server/.env.example` | Template cho biến môi trường |

---

*Điều hướng: [⬆️ Về README](../README.md) · [➡️ Kiến trúc hệ thống](./ARCHITECTURE.md)*
