# 🚀 Hướng dẫn Triển khai — HobbyShop Deployment

> **Điều hướng nhanh:**
> [README](../README.md) · [Cấu trúc thư mục](./DIRECTORY_STRUCTURE.md) · [Kiến trúc](./ARCHITECTURE.md) · [Công nghệ](./TECH_STACK.md) · [API](./API_REFERENCE.md) · [Vấn đề & Giải pháp](./PROBLEM_SOLVING.md)

---

## Kiến trúc Cloud

```
┌─────────────────────────────────────────────────────────────┐
│  Người dùng truy cập qua HTTPS                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│  Vercel CDN     │       │  Vercel CDN     │
│  Customer Site  │       │  Admin Panel    │
│  hobby-shop-    │       │  hobby-shop-    │
│  client.vercel  │       │  admin.vercel   │
└────────┬────────┘       └────────┬────────┘
         │                         │
         └─────────────┬───────────┘
                       │ API Calls (HTTPS)
                       ▼
              ┌─────────────────┐
              │  Render         │
              │  Backend API    │
              │  Node.js/Express│
              │  hobbyshop-api  │
              │  .onrender.com  │
              └────────┬────────┘
                       │ Mongoose
                       ▼
              ┌─────────────────┐
              │  MongoDB Atlas  │
              │  Cloud Database │
              │  cluster0.xxx   │
              │  .mongodb.net   │
              └─────────────────┘

              ┌─────────────────┐
              │  UptimeRobot    │ ──→ Ping /api/health mỗi 5 phút
              │  (Free Monitor) │     để tránh Render cold start
              └─────────────────┘
```

---

## Tổng quan Links Production

| Dịch vụ | URL | Platform | Chi phí |
| :--- | :--- | :--- | :--- |
| Customer Website | <https://hobbyshop-customer.vercel.app> | Vercel | Free |
| Admin Panel | <https://hobbyshop-admin.vercel.app> | Vercel | Free |
| Backend API | <https://hobbyshop-api.onrender.com> | Render | Free |
| Database | MongoDB Atlas | Atlas | Free (512MB) |
| Uptime Monitor | UptimeRobot | UptimeRobot | Free |

**Tổng chi phí vận hành: 0đ/tháng** ✅

---

## Bước 1 — Chuẩn bị MongoDB Atlas

### 1.1 Tạo tài khoản & Cluster
1. Truy cập [cloud.mongodb.com](https://cloud.mongodb.com)
2. Tạo tài khoản miễn phí
3. Chọn **Create a New Project** → đặt tên `HobbyShop`
4. Tạo Cluster: **M0 Sandbox (Free)** → chọn region gần nhất (Singapore)

### 1.2 Cấu hình Network Access
1. Vào **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - ⚠️ Cần thiết để Render connect được

### 1.3 Tạo Database User
1. Vào **Database Access** → **Add New Database User**
2. Authentication Method: **Password**
3. Username: `hobbyshop-admin` (hoặc tùy)
4. Password: tạo mật khẩu mạnh (lưu lại!)
5. Database User Privileges: **Read and write to any database**

### 1.4 Lấy Connection String
1. Vào Cluster → **Connect** → **Connect your application**
2. Driver: **Node.js**, Version: **5.5 or later**
3. Copy connection string dạng:
```
mongodb+srv://hobbyshop-admin:<password>@cluster0.xxxxx.mongodb.net/hobbyshop?retryWrites=true&w=majority
```

---

## Bước 2 — Deploy Backend lên Render

### 2.1 Tạo tài khoản Render
1. Truy cập [render.com](https://render.com)
2. Sign up bằng GitHub account

### 2.2 Tạo Web Service
1. Dashboard → **New** → **Web Service**
2. Connect GitHub repository: chọn repo HobbyShop
3. Cấu hình:

| Setting | Giá trị |
| :--- | :--- |
| Name | `hobbyshop-api` |
| Region | Singapore (SEA) |
| Branch | `main` |
| Root Directory | `server` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Instance Type | `Free` |

### 2.3 Cấu hình Environment Variables
Vào **Environment** tab, thêm các biến:

```
PORT=5000
MONGODB_URI=mongodb+srv://hobbyshop-admin:<password>@cluster0.xxxxx.mongodb.net/hobbyshop
CLIENT_URL=https://hobbyshop-customer.vercel.app
ADMIN_URL=https://hobbyshop-admin.vercel.app
JWT_SECRET=<sinh chuỗi random 64 ký tự>
SESSION_SECRET=<sinh chuỗi random 32 ký tự>
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=<Gmail App Password>
```

> **Tạo JWT_SECRET ngẫu nhiên:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 2.4 Deploy
1. Click **Create Web Service**
2. Đợi build & deploy (~3-5 phút)
3. Kiểm tra tại: `https://hobbyshop-api.onrender.com/api/health`

---

## Bước 3 — Deploy Frontend lên Vercel

### 3.1 Customer Website

1. Truy cập [vercel.com](https://vercel.com) → Sign up bằng GitHub
2. **New Project** → Import repo HobbyShop
3. Cấu hình:

| Setting | Giá trị |
| :--- | :--- |
| Project Name | `hobbyshop-customer` |
| Framework Preset | `Vite` |
| Root Directory | `client-customer` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. **Environment Variables:**
```
VITE_API_URL=https://hobbyshop-api.onrender.com
```

5. Click **Deploy**

### 3.2 Admin Panel

Tương tự, tạo project mới:

| Setting | Giá trị |
| :--- | :--- |
| Project Name | `hobbyshop-admin` |
| Framework Preset | `Vite` |
| Root Directory | `client-admin` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Environment Variables:**
```
VITE_API_URL=https://hobbyshop-api.onrender.com
```

---

## Bước 4 — Cập nhật CORS trên Render

Sau khi có URL Vercel, quay lại Render và cập nhật:

```
CLIENT_URL=https://hobbyshop-customer.vercel.app
ADMIN_URL=https://hobbyshop-admin.vercel.app
```

Render sẽ tự động redeploy khi thay đổi env vars.

---

## Bước 5 — Thiết lập UptimeRobot (Anti Cold Start)

1. Đăng ký tại [uptimerobot.com](https://uptimerobot.com)
2. **Add New Monitor:**

| Setting | Giá trị |
| :--- | :--- |
| Monitor Type | `HTTP(s)` |
| Friendly Name | `HobbyShop API` |
| URL | `https://hobbyshop-api.onrender.com/api/health` |
| Monitoring Interval | `5 minutes` |

3. Save → UptimeRobot sẽ ping server mỗi 5 phút để ngăn cold start.

---

## Bước 6 — Kiểm tra Sau Deploy

### Checklist

```bash
# 1. Health check backend
curl https://hobbyshop-api.onrender.com/api/health
# ✅ Expected: {"status":"ok","timestamp":"..."}

# 2. Test CORS
curl -H "Origin: https://hobbyshop-customer.vercel.app" \
     -I https://hobbyshop-api.onrender.com/api/customer/products/new
# ✅ Expected: Access-Control-Allow-Origin: https://hobbyshop-customer.vercel.app

# 3. Test Customer APIs
curl https://hobbyshop-api.onrender.com/api/customer/products/new
# ✅ Expected: JSON array of products

# 4. Test Admin login
curl -X POST https://hobbyshop-api.onrender.com/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"123"}'
# ✅ Expected: {"token":"eyJ..."}
```

### URLs cần verify
- [ ] `https://hobbyshop-customer.vercel.app` — Customer site load được
- [ ] `https://hobbyshop-admin.vercel.app` — Admin panel load được
- [ ] `https://hobbyshop-api.onrender.com/api/health` — Backend healthy
- [ ] Login admin panel được
- [ ] Customer site hiện sản phẩm

---

## Auto-Deploy khi Push Code

Cả Vercel và Render đều hỗ trợ **auto-deploy khi push lên branch `main`**:

```
Git push → GitHub
    ↓
Vercel detects change in client-customer/ → rebuilds Customer Site
Vercel detects change in client-admin/    → rebuilds Admin Panel
Render detects change in server/          → restarts Backend
```

> ⚠️ Render cần thêm cấu hình: **Settings → Auto-Deploy → Yes**

---

## Cấu hình Gmail App Password cho Email

1. Google Account → **Security** → **2-Step Verification** (bật)
2. **App passwords** → **Generate**
3. App: `Mail`, Device: `Other` → đặt tên `HobbyShop`
4. Copy 16-digit password → dùng cho `EMAIL_PASS` trên Render

---

## Troubleshooting

### Backend không kết nối được MongoDB
```bash
# Kiểm tra MongoDB URI format
# Đảm bảo IP 0.0.0.0/0 đã được whitelist trong Atlas → Network Access
# Đảm bảo password không có ký tự đặc biệt (@ # %) — nên URL-encode nếu có
```

### Frontend hiện lỗi "CORS error"
```bash
# Kiểm tra CLIENT_URL / ADMIN_URL trên Render có đúng domain Vercel không
# Domain Vercel có thể là: https://hobbyshop-customer-xxx.vercel.app (unique suffix)
# Phải lấy đúng URL từ Vercel dashboard
```

### Render bị cold start dù có UptimeRobot
```
UptimeRobot free plan có thể không đủ dày. 
Giải pháp: Dùng 2 UptimeRobot monitors ping cùng endpoint với interval lệch nhau.
Hoặc: Upgrade Render lên Starter plan (~$7/tháng) để loại bỏ cold start.
```

---

*Điều hướng: [⬆️ Về README](../README.md) · [⬅️ Vấn đề & Giải pháp](./PROBLEM_SOLVING.md) · [➡️ API Reference](./API_REFERENCE.md)*
