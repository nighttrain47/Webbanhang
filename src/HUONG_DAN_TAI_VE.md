# 🎯 HƯỚNG DẪN TẢI PROJECT VỀ MÁY - NHANH GỌN

## 🚀 3 BƯỚC ĐƠN GIẢN

### ✅ **BƯỚC 1: Tìm nút Export/Download**

Ở góc phải trên cùng của Figma Make, tìm nút:
- **"Export"** hoặc
- **"Download"** hoặc  
- **"Download as ZIP"**

👉 Click vào đó → Tải file `.zip` về máy

---

### ✅ **BƯỚC 2: Giải nén và cài đặt**

```bash
# Giải nén file zip vào thư mục bạn muốn
# Mở Terminal/CMD và chạy:

cd anime-shop

# Cài đặt tất cả thư viện cần thiết
npm install
```

---

### ✅ **BƯỚC 3: Chạy project**

```bash
npm run dev
```

🎉 **Xong!** Mở trình duyệt tại: **http://localhost:5173**

---

## 🔑 THÔNG TIN ĐĂNG NHẬP

### **Cửa hàng (Customer)**
- Truy cập: `http://localhost:5173`
- Đăng nhập bằng bất kỳ email/password nào

### **Quản trị (Admin)**
- Truy cập: `http://localhost:5173/admin`
- Username: **`admin`**
- Password: **`admin123`**

---

## ❓ NẾU KHÔNG TÌM THẤY NÚT EXPORT

### **Phương án A: Copy thủ công (khuyến nghị)**

1. **Tạo project mới:**
```bash
npm create vite@latest anime-shop -- --template react-ts
cd anime-shop
```

2. **Cài đặt thư viện:**
```bash
npm install react-router@7 lucide-react motion recharts react-slick slick-carousel
```

3. **Tạo cấu trúc thư mục:**
```bash
mkdir -p src/components/{admin,layout,product,ui,figma}
mkdir -p src/{pages,services,data,styles}
```

4. **Copy file từ Figma Make:**

Mở từng file bên trái Figma Make và copy vào máy:

```
Figma Make                    →  Máy tính của bạn
─────────────────────────────────────────────────────
/App.tsx                      →  src/App.tsx
/components/admin/*           →  src/components/admin/*
/components/layout/*          →  src/components/layout/*
/components/product/*         →  src/components/product/*
/components/ui/*              →  src/components/ui/*
/components/figma/*           →  src/components/figma/*
/pages/*                      →  src/pages/*
/services/amiamiService.ts    →  src/services/amiamiService.ts
/data/mockData.ts             →  src/data/mockData.ts
/styles/globals.css           →  src/styles/globals.css
```

5. **Tạo file src/main.tsx:**
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

6. **Chạy project:**
```bash
npm run dev
```

---

### **Phương án B: Dùng script tự động**

#### **Trên Mac/Linux:**
```bash
bash create-project.sh
# Sau đó copy file thủ công theo hướng dẫn
```

#### **Trên Windows:**
```bash
create-project.bat
# Sau đó copy file thủ công theo hướng dẫn
```

---

## 📋 DANH SÁCH FILE CẦN COPY

### **Ưu tiên cao (Bắt buộc):**
- ✅ `App.tsx`
- ✅ `styles/globals.css`
- ✅ `pages/HomePage.tsx`
- ✅ `pages/ProductDetailPage.tsx`
- ✅ `pages/CartPage.tsx`
- ✅ `components/layout/Header.tsx`
- ✅ `components/layout/Footer.tsx`
- ✅ `components/layout/Sidebar.tsx`
- ✅ `services/amiamiService.ts`

### **Admin Dashboard:**
- ✅ `components/admin/AdminDashboard.tsx`
- ✅ `components/admin/AdminSidebar.tsx`
- ✅ `components/admin/ProductManagement.tsx` ⭐ (có Auto-fetch AmiAmi)
- ✅ `components/admin/DashboardOverview.tsx`
- ✅ `components/admin/OrderManagement.tsx`
- ✅ `components/admin/CustomerManagement.tsx`
- ✅ `components/admin/ReportsAnalytics.tsx`

### **Components khác:**
- ✅ `components/product/*` (3 files)
- ✅ `components/ui/*` (tất cả shadcn/ui components)
- ✅ `components/figma/ImageWithFallback.tsx`
- ✅ `components/Login.tsx`
- ✅ `components/MyAccount.tsx`
- ✅ `components/Checkout.tsx`

### **Data:**
- ✅ `data/mockData.ts`

---

## 🎯 TẤT CẢ TÍNH NĂNG

### **Cửa hàng (Customer):**
- 🏠 Homepage đầy đủ
- 📦 Chi tiết sản phẩm
- 🛒 Giỏ hàng + Point System
- 💳 Checkout
- 👤 Tài khoản cá nhân
- 📱 Responsive design

### **Quản trị (Admin):**
- 📊 Dashboard tổng quan
- 🎯 Quản lý sản phẩm
  - ⭐ **Tính năng đặc biệt: Auto-fetch từ AmiAmi**
  - Paste link AmiAmi → Tự động điền form
  - 6 sản phẩm mẫu để test
- 📋 Quản lý đơn hàng
- 👥 Quản lý khách hàng
- 📈 Báo cáo & thống kê

---

## 🛠️ YÊU CẦU HỆ THỐNG

- ✅ **Node.js:** Phiên bản 18 trở lên
- ✅ **npm:** Phiên bản 9 trở lên
- ✅ **Trình duyệt:** Chrome, Firefox, Safari, Edge (bản mới nhất)
- ✅ **Hệ điều hành:** Windows, Mac, Linux

Kiểm tra phiên bản:
```bash
node --version
npm --version
```

Nếu chưa có Node.js, tải tại: https://nodejs.org

---

## ⚠️ XỬ LÝ LỖI THƯỜNG GẶP

### **Lỗi: "Module not found"**
```bash
npm install
```

### **Lỗi: "Cannot find module 'react-router'"**
```bash
npm install react-router@7
```

### **Lỗi: CSS không hiển thị**
Kiểm tra file `src/main.tsx` có dòng:
```tsx
import './styles/globals.css'
```

### **Lỗi: Port 5173 đã được sử dụng**
```bash
npm run dev -- --port 3000
```

### **Lỗi: Import path sai**
Trong các file component, đường dẫn import phải đúng:
```tsx
// Đúng:
import { Header } from './components/layout/Header'

// Sai:
import { Header } from '../components/layout/Header'
```

---

## 📞 CẦN TRỢ GIÚP?

Đọc thêm các file hướng dẫn chi tiết:

1. **`DOWNLOAD_GUIDE.md`** - Hướng dẫn đầy đủ nhất
2. **`QUICK_START_GUIDE.md`** - Hướng dẫn nhanh
3. **`ADMIN_GUIDE.md`** - Hướng dẫn sử dụng Admin
4. **`PROJECT_STRUCTURE.md`** - Cấu trúc project

---

## 🎨 THIẾT KẾ

- **Màu chủ đạo:** #FF9900 (Cam)
- **Phong cách:** Japanese E-commerce (GoodSmile)
- **Ngôn ngữ:** Tiếng Việt 100%
- **Tiền tệ:** VNĐ
- **UI/UX:** Clean, Minimalist, Responsive

---

## ✨ ĐIỂM NỔI BẬT

### ⭐ **Tính năng Auto-fetch từ AmiAmi**
Ở Admin → Quản lý sản phẩm → Thêm sản phẩm:
1. Paste link AmiAmi (VD: `https://www.amiami.com/eng/detail?gcode=FIGURE-197861`)
2. Click "Lấy thông tin"
3. Form tự động điền TẤT CẢ thông tin!
4. Có 6 URL mẫu để test ngay

### 🎯 **Danh mục đồng bộ hoàn toàn**
Admin và Store đã được đồng bộ 100%:
- Scale Figures
- Nendoroid
- Figma
- Prize Figures
- Gundam
- Goods
- Anime OST
- Character Songs
- Drama CD
- Blu-ray

---

## 🚀 BUILD PRODUCTION

Khi muốn đưa lên hosting:

```bash
# Build
npm run build

# File build sẽ nằm trong thư mục dist/
# Upload thư mục dist/ lên hosting
```

---

## 📦 KẾT QUẢ CUỐI CÙNG

Sau khi hoàn tất, bạn sẽ có:

✅ Website bán hàng đầy đủ tính năng  
✅ Admin Dashboard chuyên nghiệp  
✅ Tính năng Auto-fetch từ AmiAmi độc đáo  
✅ UI/UX chuẩn Japanese E-commerce  
✅ Hoàn toàn bằng tiếng Việt  
✅ Code sạch sẽ, dễ maintain  
✅ Ready to deploy!  

---

**🎉 CHÚC BẠN THÀNH CÔNG!**

Nếu cần hỗ trợ thêm, đọc các file `.md` khác trong project hoặc check documentation của các thư viện đã sử dụng.
