# 🛍️ HobbyShop - Anime E-commerce

Dự án E-commerce bán đồ chơi / figure anime với Node.js, Express, MongoDB và React (Vite).

## 📁 Cấu trúc dự án

```
HobbyShop/
├── server/                 # Backend (Express + MongoDB)
│   ├── api/               # API routes (admin, customer, shop)
│   ├── models/            # MongoDB models & DAOs
│   ├── views/             # EJS templates (server-side rendering)
│   └── utils/             # Utilities (DB connection, JWT auth)
├── client-admin/          # Admin panel (React + Vite + TypeScript)
├── client-customer/       # Customer website (React + Vite + TypeScript)
└── package.json           # Root scripts (monorepo)
```

## ⚙️ Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** (Atlas hoặc local)

---

## 🚀 Hướng dẫn cài đặt & chạy

### Bước 1: Cài đặt tất cả dependencies (nhanh nhất)

Chạy từ thư mục gốc `HobbyShop/`:

```bash
npm run install:all
```

> Lệnh này sẽ tự động cài đặt dependencies cho cả 3 phần: `server`, `client-customer`, `client-admin`.

**Hoặc** cài đặt thủ công từng phần:

```bash
# Server
cd server
npm install

# Client Customer
cd ../client-customer
npm install --legacy-peer-deps

# Client Admin
cd ../client-admin
npm install --legacy-peer-deps
```

### Bước 2: Cấu hình biến môi trường

Tạo file `server/.env` với nội dung:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hobbyshop?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key
```

> Thay `<username>`, `<password>`, `<cluster>` bằng thông tin MongoDB Atlas của bạn.

### Bước 3: Chạy ứng dụng

Mở **3 terminal riêng biệt** và chạy lần lượt:

#### Terminal 1 — Server API (Port 5000)

```bash
# Cách 1: Từ thư mục gốc
npm run dev:server

# Cách 2: Từ thư mục server
cd server
node index.js

# Cách 3: Chạy với auto-reload (khuyên dùng khi dev)
cd server
npm run dev
```

#### Terminal 2 — Customer Website (Port 3000)

```bash
# Cách 1: Từ thư mục gốc
npm run dev:customer

# Cách 2: Từ thư mục client-customer
cd client-customer
npm run dev
```

#### Terminal 3 — Admin Panel (Port 3001)

```bash
# Cách 1: Từ thư mục gốc
npm run dev:admin

# Cách 2: Từ thư mục client-admin
cd client-admin
npm run dev
```

### Bước 4: Build production

```bash
# Build Customer Website
npm run build:customer

# Build Admin Panel
npm run build:admin
```

---

## 🌐 URLs sau khi chạy

| Ứng dụng | URL | Mô tả |
|---|---|---|
| Server API | http://localhost:5000 | Backend REST API |
| EJS Shop | http://localhost:5000/shop | Giao diện shop (server-side rendering) |
| Customer Website | http://localhost:3000 | Trang khách hàng (React SPA) |
| Admin Panel | http://localhost:3001 | Trang quản trị (React SPA) |
| Health Check | http://localhost:5000/api/health | Kiểm tra server hoạt động |

---

## 🔑 Tài khoản Admin mặc định

| Trường | Giá trị |
|---|---|
| Username | `admin` |
| Password | `admin123` |

---

## 📡 API Endpoints

### Admin APIs (`/api/admin/*` — cần JWT token)

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/admin/login` | Đăng nhập admin |
| GET | `/api/admin/products?page=1` | Danh sách sản phẩm |
| POST | `/api/admin/products` | Thêm sản phẩm |
| PUT | `/api/admin/products/:id` | Sửa sản phẩm |
| DELETE | `/api/admin/products/:id` | Xóa sản phẩm |
| GET | `/api/admin/categories` | Danh sách danh mục |
| POST | `/api/admin/categories` | Thêm danh mục |
| PUT | `/api/admin/categories/:id` | Sửa danh mục |
| DELETE | `/api/admin/categories/:id` | Xóa danh mục |
| GET | `/api/admin/customers` | Danh sách khách hàng |
| GET | `/api/admin/orders?page=1` | Danh sách đơn hàng |
| PUT | `/api/admin/orders/:id/status` | Cập nhật trạng thái đơn |
| GET | `/api/admin/reviews?page=1` | Danh sách đánh giá |
| DELETE | `/api/admin/reviews/:id` | Xóa đánh giá |
| GET | `/api/admin/articles?page=1` | Danh sách bài viết |
| POST | `/api/admin/articles` | Thêm bài viết |
| PUT | `/api/admin/articles/:id` | Sửa bài viết |
| DELETE | `/api/admin/articles/:id` | Xóa bài viết |

### Customer APIs (`/api/customer/*`)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/customer/categories` | Danh mục sản phẩm |
| GET | `/api/customer/products/new` | Sản phẩm mới |
| GET | `/api/customer/products/hot` | Sản phẩm hot |
| GET | `/api/customer/products/category/:cid` | Sản phẩm theo danh mục |
| GET | `/api/customer/products/search/:keyword` | Tìm kiếm sản phẩm |
| GET | `/api/customer/products/:id` | Chi tiết sản phẩm |
| GET | `/api/customer/products/:id/reviews` | Đánh giá sản phẩm |
| POST | `/api/customer/products/:id/reviews` | Gửi đánh giá |
| POST | `/api/customer/signup` | Đăng ký tài khoản |
| POST | `/api/customer/login` | Đăng nhập |
| GET | `/api/customer/active?id=&token=` | Kích hoạt tài khoản |
| GET | `/api/customer/articles` | Danh sách bài viết |
| GET | `/api/customer/articles/:slug` | Chi tiết bài viết |

### EJS Routes — Server-side rendering (`/shop/*`)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/shop` | Danh sách sản phẩm |
| GET | `/shop/product/:id` | Chi tiết sản phẩm |
| GET | `/shop/cart` | Xem giỏ hàng |
| POST | `/shop/cart/add` | Thêm vào giỏ |
| POST | `/shop/cart/remove/:id` | Xóa khỏi giỏ |

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Frontend | React 18, Vite, TypeScript |
| UI Components | Radix UI, Lucide React, Recharts |
| Styling | TailwindCSS |
| View Engine | EJS (server-side rendering) |
| Session | express-session + connect-mongo |
| Authentication | JWT (jsonwebtoken + bcryptjs) |

---

## 👤 Tác giả

**KTB** — 2026