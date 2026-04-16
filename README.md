# 🛍️ HobbyShop — Anime & Figure E-Commerce Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Customer_Site-4F46E5?style=for-the-badge)](https://hobbyshop-customer.vercel.app)
[![Admin Panel](https://img.shields.io/badge/🛠️_Live_Demo-Admin_Panel-DC2626?style=for-the-badge)](https://hobbyshop-admin.vercel.app)
[![API Backend](https://img.shields.io/badge/☁️_Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://hobbyshop-api.onrender.com/api/health)

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Hệ thống thương mại điện tử toàn diện dành cho cộng đồng đam mê mô hình và đồ chơi sưu tầm anime.**

[🌐 Customer Site](https://hobbyshop-customer.vercel.app) · [🛠️ Admin Panel](https://hobbyshop-admin.vercel.app) · [☁️ Backend API](https://hobbyshop-api.onrender.com/api/health)

</div>

---

## 📖 Giới thiệu

**HobbyShop** là một nền tảng mua sắm trực tuyến được xây dựng trên **MERN Stack** kết hợp **TypeScript** và **Vite**, hướng tới cộng đồng đam mê figure và mô hình anime. Dự án bao gồm 3 phần độc lập hoạt động cùng nhau:

| Phần | Mô tả |
| :--- | :--- |
| 🛒 **Customer Website** | Trang mua sắm cho khách hàng: duyệt sản phẩm, giỏ hàng, pre-order, hạng thành viên |
| 🖥️ **Admin Panel** | Bảng quản trị: sản phẩm, đơn hàng, người dùng, bài viết, phân tích doanh thu |
| 🖧 **Backend API** | REST API trung tâm, xử lý nghiệp vụ, xác thực JWT, email OTP |

---

## 🗺️ Tổng quan Demo

> ⚠️ **Lưu ý:** Backend được host trên **Render (Free tier)** — server có thể cần 30-60 giây để "thức dậy" sau thời gian không hoạt động.

| Dịch vụ | URL | Platform |
| :--- | :--- | :--- |
| 🌐 Customer Website | <https://hobbyshop-customer.vercel.app> | Vercel |
| 🛠️ Admin Panel | <https://hobbyshop-admin.vercel.app> | Vercel |
| ☁️ Backend API | <https://hobbyshop-api.onrender.com> | Render |
| 💓 Health Check | <https://hobbyshop-api.onrender.com/api/health> | Render |

---

## 📚 Tài liệu Dự án

Tài liệu được chia thành các file chuyên biệt, liên kết với nhau:

| File | Nội dung |
| :--- | :--- |
| 🏠 [README.md](./README.md) | Tổng quan dự án, hướng dẫn cài đặt nhanh và điều hướng tài liệu |
| 🗂️ [docs/DIRECTORY_STRUCTURE.md](./docs/DIRECTORY_STRUCTURE.md) | Giải thích chi tiết từng thư mục và file trong dự án |
| 🏗️ [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Kiến trúc hệ thống và các luồng giao tiếp (có sơ đồ) |
| 🔧 [docs/TECH_STACK.md](./docs/TECH_STACK.md) | Công nghệ sử dụng và lý do lựa chọn |
| 🧩 [docs/PROBLEM_SOLVING.md](./docs/PROBLEM_SOLVING.md) | Các vấn đề gặp phải và cách giải quyết |
| 🚀 [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Hướng dẫn triển khai lên Cloud (Vercel + Render + Atlas) |
| 📡 [docs/API_REFERENCE.md](./docs/API_REFERENCE.md) | Tài liệu REST API đầy đủ |
| 📑 [docs/REFERENCES.md](./docs/REFERENCES.md) | Danh mục tài liệu tham khảo dùng cho báo cáo đồ án |

---

## 📁 Cấu trúc Dự án

```
HobbyShop/
├── server/                    # 🖧 Backend (Express + MongoDB)
│   ├── api/                   #   REST API routes
│   │   ├── admin.js           #   Admin endpoints (CRUD + auth)
│   │   ├── customer.js        #   Customer endpoints (shop, orders)
│   │   └── shop.js            #   EJS server-side rendering routes
│   ├── models/                #   Mongoose Models & DAOs
│   │   ├── ProductDAO.js
│   │   ├── OrderDAO.js
│   │   ├── CustomerDAO.js
│   │   └── ...
│   ├── utils/                 #   Utilities
│   │   ├── db.js              #   MongoDB connection
│   │   ├── jwtAuth.js         #   JWT middleware
│   │   └── EmailUtil.js       #   Nodemailer email service
│   ├── views/                 #   EJS templates (SSR)
│   └── index.js               #   Entry point
├── client-customer/           # 🌐 Customer Website (React + Vite)
│   └── src/
│       ├── pages/             #   13 pages (Home, Cart, Product...)
│       ├── components/        #   UI components
│       └── services/          #   API service calls
├── client-admin/              # 🛠️ Admin Panel (React + Vite)
│   └── src/
│       └── components/admin/  #   12 admin screens
├── docs/                      # 📚 Tài liệu chi tiết
└── package.json               # Root monorepo scripts
```

> 📖 Xem chi tiết từng file tại [docs/DIRECTORY_STRUCTURE.md](./docs/DIRECTORY_STRUCTURE.md)

---

## ⚙️ Yêu cầu Hệ thống

| Công cụ | Phiên bản |
| :--- | :--- |
| **Node.js** | >= 18.x |
| **npm** | >= 9.x |
| **MongoDB** | Atlas Cloud hoặc Local |

---

## 🚀 Hướng dẫn Cài đặt & Chạy Local

### Bước 1 — Clone & Cài đặt

```bash
git clone https://github.com/nighttrain47/Webbanhang.git
cd Webbanhang

# Cài đặt toàn bộ dependencies một lệnh duy nhất
npm run install:all
```

> Nếu bạn đặt lại tên thư mục local thành `HobbyShop`, chỉ cần `cd` vào đúng thư mục dự án trước khi chạy lệnh.

<details>
<summary>Hoặc cài đặt thủ công từng phần</summary>

```bash
cd server && npm install
cd ../client-customer && npm install --legacy-peer-deps
cd ../client-admin && npm install --legacy-peer-deps
```

</details>

---

### Bước 2 — Cấu hình Biến Môi trường

Tạo file `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hobbyshop
MONGODB_TLS_INSECURE=false
ALLOW_INSECURE_TLS=false
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key
BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=verified_sender_email@example.com
```

Tạo thêm file `client-customer/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Tạo thêm file `client-admin/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> Xem file mẫu backend tại [`server/.env.example`](./server/.env.example)

> Nếu không cấu hình `BREVO_API_KEY` và `EMAIL_USER`, các luồng gửi OTP/email trạng thái đơn hàng sẽ không hoạt động.

Khởi tạo admin đầu tiên trong database (bắt buộc):

```bash
cd server
npm run create:admin -- --username=<admin_username> --password=<admin_password> --name="Super Admin" --role=superadmin
```

Gợi ý bảo mật (PowerShell) để tránh lưu password trong lịch sử lệnh:

```powershell
cd server
$env:ADMIN_USERNAME = "<admin_username>"
$env:ADMIN_PASSWORD = "<admin_password>"
npm run create:admin -- --name="Super Admin" --role=superadmin
Remove-Item Env:ADMIN_USERNAME
Remove-Item Env:ADMIN_PASSWORD
```

---

### Bước 3 — Chạy Development

Mở **3 terminal** và chạy lần lượt:

```bash
# Terminal 1 — Backend (Port 5000)
npm run dev:server

# Terminal 2 — Customer Website (Port 3000)
npm run dev:customer

# Terminal 3 — Admin Panel (Port 3001)
npm run dev:admin
```

### Bước 4 — Build Production

```bash
npm run build:customer
npm run build:admin
```

### Các script root hữu ích

| Script | Mô tả |
| :--- | :--- |
| `npm run install:all` | Cài dependencies cho `server`, `client-customer`, `client-admin` |
| `npm run dev:server` | Chạy backend tại port 5000 |
| `npm run dev:customer` | Chạy customer app tại port 3000 |
| `npm run dev:admin` | Chạy admin app tại port 3001 |
| `npm run build:customer` | Build customer app ra thư mục `client-customer/build` |
| `npm run build:admin` | Build admin app ra thư mục `client-admin/build` |

### Tạo tài khoản Admin trong Database

Dự án hỗ trợ nhiều tài khoản admin lưu trong MongoDB.

```bash
cd server
npm run create:admin -- --username=<admin1_username> --password=<admin1_password> --name="Admin One" --role=superadmin
npm run create:admin -- --username=<admin2_username> --password=<admin2_password> --name="Admin Two" --role=admin
```

> Mỗi lần chạy lệnh sẽ tạo thêm 1 admin mới (username phải duy nhất).

> 📖 Hướng dẫn deploy lên Cloud tại [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## ✅ Kiểm tra nhanh sau khi chạy

1. Mở `http://localhost:5000/api/health` để xác nhận backend hoạt động.
2. Mở `http://localhost:3000` và kiểm tra trang chủ customer có tải dữ liệu sản phẩm.
3. Mở `http://localhost:3001` và thử đăng nhập admin.
4. Nếu API bị lỗi CORS, kiểm tra lại `CLIENT_URL` và `ADMIN_URL` trong `server/.env`.
5. Nếu các chức năng OTP/email lỗi, kiểm tra `BREVO_API_KEY` và `EMAIL_USER`.

---

## 🌐 URLs Local

| Ứng dụng | URL | Mô tả |
| :--- | :--- | :--- |
| **Backend API** | <http://localhost:5000> | REST API chính |
| **EJS Shop** | <http://localhost:5000/shop> | Server-side rendering |
| **Customer Website** | <http://localhost:3000> | Trang mua sắm (React SPA) |
| **Admin Panel** | <http://localhost:3001> | Bảng quản trị (React SPA) |
| **Health Check** | <http://localhost:5000/api/health> | Kiểm tra server |

---

## 📡 API Nhanh

> 📖 Tài liệu API đầy đủ tại [docs/API_REFERENCE.md](./docs/API_REFERENCE.md)

<details>
<summary>🔒 Admin APIs — <code>/api/admin/*</code> (yêu cầu JWT)</summary>

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| POST | `/api/admin/login` | Đăng nhập |
| GET | `/api/admin/products` | Danh sách sản phẩm |
| POST | `/api/admin/products` | Thêm sản phẩm |
| PUT | `/api/admin/products/:id` | Sửa sản phẩm |
| DELETE | `/api/admin/products/:id` | Xóa sản phẩm |
| GET | `/api/admin/orders` | Danh sách đơn hàng |
| PUT | `/api/admin/orders/:id/status` | Cập nhật trạng thái đơn |
| GET | `/api/admin/customers` | Danh sách khách hàng |
| GET | `/api/admin/categories` | Danh mục |
| GET | `/api/admin/reviews` | Đánh giá |


</details>

<details>
<summary>👤 Customer APIs — <code>/api/customer/*</code></summary>

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/customer/products/new` | Sản phẩm mới |
| GET | `/api/customer/products/hot` | Sản phẩm hot |
| GET | `/api/customer/products/search/:keyword` | Tìm kiếm |
| GET | `/api/customer/products/:id` | Chi tiết sản phẩm |
| POST | `/api/customer/signup` | Đăng ký tài khoản |
| POST | `/api/customer/login` | Đăng nhập |


</details>

---

## 🛠️ Công nghệ

| Layer | Công nghệ |
| :--- | :--- |
| **Backend** | Node.js 18, Express 5, MongoDB, Mongoose |
| **Frontend** | React 18, Vite 5, TypeScript |
| **UI** | Radix UI, Lucide React, Recharts, TailwindCSS |
| **Auth** | JWT, bcryptjs, express-session |
| **Email** | Brevo (SMTP) + Nodemailer |
| **Deployment** | Vercel, Render, MongoDB Atlas |

> 📖 Giải thích chi tiết tại [docs/TECH_STACK.md](./docs/TECH_STACK.md)

---

## 👤 Tác giả

**KTB** — 2026

---

<div align="center">
<sub>Built with ❤️ for the anime & figure collector community</sub>
</div>
