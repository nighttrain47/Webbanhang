# 📦 HƯỚNG DẪN TẢI PROJECT VỀ MÁY

## 🎯 Tổng quan
Website thương mại điện tử bán Anime Figures, CDs và Goods Nhật Bản với Admin Dashboard đầy đủ tính năng.

---

## 🚀 CÁCH 1: TẢI TRỰC TIẾP (NHANH NHẤT)

### Bước 1: Export từ Figma Make
1. Tìm nút **"Export"** hoặc **"Download"** ở góc phải trên
2. Click để tải file `.zip`
3. Giải nén file vào thư mục bạn muốn

### Bước 2: Cài đặt và chạy
```bash
# Di chuyển vào thư mục project
cd anime-shop

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

---

## 💻 CÁCH 2: TẠO PROJECT MỚI (THỦ CÔNG)

### Bước 1: Tạo React + Vite project

```bash
# Tạo project mới
npm create vite@latest anime-shop -- --template react-ts

# Di chuyển vào thư mục
cd anime-shop

# Cài đặt dependencies cơ bản
npm install
```

### Bước 2: Cài đặt thư viện cần thiết

```bash
npm install react-router@7 lucide-react motion recharts react-slick slick-carousel
```

### Bước 3: Tạo cấu trúc thư mục

```bash
# Tạo thư mục components
mkdir -p src/components/admin
mkdir -p src/components/layout
mkdir -p src/components/product
mkdir -p src/components/ui
mkdir -p src/components/figma
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/data
mkdir -p src/styles
```

### Bước 4: Copy các file

#### **4.1. File chính**
- Copy `/App.tsx` → `src/App.tsx`
- Copy `/styles/globals.css` → `src/styles/globals.css`

#### **4.2. Pages**
- Copy `/pages/HomePage.tsx` → `src/pages/HomePage.tsx`
- Copy `/pages/ProductDetailPage.tsx` → `src/pages/ProductDetailPage.tsx`
- Copy `/pages/CartPage.tsx` → `src/pages/CartPage.tsx`

#### **4.3. Components - Admin**
- Copy `/components/admin/AdminDashboard.tsx` → `src/components/admin/AdminDashboard.tsx`
- Copy `/components/admin/AdminSidebar.tsx` → `src/components/admin/AdminSidebar.tsx`
- Copy `/components/admin/AdminLogin.tsx` → `src/components/admin/AdminLogin.tsx`
- Copy `/components/admin/DashboardOverview.tsx` → `src/components/admin/DashboardOverview.tsx`
- Copy `/components/admin/ProductManagement.tsx` → `src/components/admin/ProductManagement.tsx`
- Copy `/components/admin/OrderManagement.tsx` → `src/components/admin/OrderManagement.tsx`
- Copy `/components/admin/CustomerManagement.tsx` → `src/components/admin/CustomerManagement.tsx`
- Copy `/components/admin/ReportsAnalytics.tsx` → `src/components/admin/ReportsAnalytics.tsx`

#### **4.4. Components - Layout**
- Copy `/components/layout/Header.tsx` → `src/components/layout/Header.tsx`
- Copy `/components/layout/Sidebar.tsx` → `src/components/layout/Sidebar.tsx`
- Copy `/components/layout/MobileSidebar.tsx` → `src/components/layout/MobileSidebar.tsx`
- Copy `/components/layout/Footer.tsx` → `src/components/layout/Footer.tsx`

#### **4.5. Components - Product**
- Copy `/components/product/ProductCard.tsx` → `src/components/product/ProductCard.tsx`
- Copy `/components/product/ProductSpecs.tsx` → `src/components/product/ProductSpecs.tsx`
- Copy `/components/product/ViewedItems.tsx` → `src/components/product/ViewedItems.tsx`

#### **4.6. Components - Other**
- Copy `/components/Login.tsx` → `src/components/Login.tsx`
- Copy `/components/MyAccount.tsx` → `src/components/MyAccount.tsx`
- Copy `/components/Checkout.tsx` → `src/components/Checkout.tsx`
- Copy `/components/OrderConfirmation.tsx` → `src/components/OrderConfirmation.tsx`

#### **4.7. Components - Figma**
- Copy `/components/figma/ImageWithFallback.tsx` → `src/components/figma/ImageWithFallback.tsx`

#### **4.8. Components - UI (shadcn/ui)**
Copy tất cả file trong `/components/ui/` → `src/components/ui/`

#### **4.9. Services & Data**
- Copy `/services/amiamiService.ts` → `src/services/amiamiService.ts`
- Copy `/data/mockData.ts` → `src/data/mockData.ts`

### Bước 5: Cập nhật main.tsx

Tạo file `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Bước 6: Cập nhật index.html

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Anime Shop - Mô hình Figure & Goods Nhật Bản</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Bước 7: Chạy project

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

---

## 📂 CẤU TRÚC THỦ MỤC HOÀN CHỈNH

```
anime-shop/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── ProductManagement.tsx (có Auto-fetch AmiAmi)
│   │   │   ├── OrderManagement.tsx
│   │   │   ├── CustomerManagement.tsx
│   │   │   └── ReportsAnalytics.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileSidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductSpecs.tsx
│   │   │   └── ViewedItems.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   ├── ui/ (shadcn/ui components)
│   │   ├── Login.tsx
│   │   ├── MyAccount.tsx
│   │   ├── Checkout.tsx
│   │   └── OrderConfirmation.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── CartPage.tsx
│   ├── services/
│   │   └── amiamiService.ts
│   ├── data/
│   │   └── mockData.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔑 THÔNG TIN ĐĂNG NHẬP

### **Admin Dashboard**
- URL: `http://localhost:5173/admin`
- Username: `admin`
- Password: `admin123`

### **Customer Login**
- Bất kỳ email/password nào (mock authentication)

---

## ✨ TÍNH NĂNG CHÍNH

### **Customer Store**
✅ Homepage với Hero Slider & Product Grid
✅ Product Detail Page với Bundle Deals
✅ Shopping Cart với Point System
✅ Checkout Flow
✅ My Account Dashboard
✅ Responsive Design
✅ Japanese E-commerce UI
✅ Footer 4 cột chi tiết

### **Admin Dashboard**
✅ Dashboard Overview với thống kê
✅ Product Management
   - ⭐ **Auto-fetch từ AmiAmi** (paste link → tự động điền form)
   - CRUD operations
   - Category management
   - Stock tracking
✅ Order Management
✅ Customer Management  
✅ Reports & Analytics
✅ Danh mục đồng bộ với Store

---

## 🎨 THIẾT KẾ

- **Accent Color:** `#FF9900` (Cam)
- **Style:** Japanese E-commerce (GoodSmile inspired)
- **Typography:** Sans-serif system fonts
- **Background:** White minimalist
- **Language:** Tiếng Việt
- **Currency:** VNĐ

---

## 📚 TÀI LIỆU THAM KHẢO

- `QUICK_START_GUIDE.md` - Hướng dẫn nhanh
- `PROJECT_STRUCTURE.md` - Cấu trúc project
- `ADMIN_GUIDE.md` - Hướng dẫn sử dụng Admin
- `Guidelines.md` - Guidelines thiết kế

---

## 🆘 XỬ LÝ LỖI

### Lỗi: Module not found
```bash
npm install
```

### Lỗi: react-router
```bash
npm install react-router@7
```

### Lỗi: CSS không load
Kiểm tra import trong `main.tsx`:
```tsx
import './styles/globals.css'
```

### Port 5173 đã được sử dụng
```bash
# Vite tự động chuyển sang port khác (5174, 5175...)
# Hoặc chỉ định port khác:
npm run dev -- --port 3000
```

---

## 🚀 BUILD PRODUCTION

```bash
# Build
npm run build

# Preview
npm run preview
```

File build sẽ nằm trong thư mục `dist/`

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Node.js version >= 18
2. npm version >= 9
3. Tất cả dependencies đã được cài đặt
4. Import paths đúng (chú ý `../../` trong React Router)

---

**🎉 Chúc bạn thành công!**
