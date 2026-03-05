# ✅ CHECKLIST - TẢI VỀ VÀ SETUP PROJECT

## 📋 Trước khi bắt đầu

- [ ] Đã cài đặt Node.js (>= v18)
- [ ] Đã cài đặt npm (>= v9)
- [ ] Đã có code editor (VS Code khuyến nghị)
- [ ] Đã đọc file `HUONG_DAN_TAI_VE.md`

---

## 🎯 OPTION 1: Tải trực tiếp (Nhanh nhất)

- [ ] Tìm nút "Export" hoặc "Download" trong Figma Make
- [ ] Tải file `.zip` về máy
- [ ] Giải nén vào thư mục mong muốn
- [ ] Mở Terminal/CMD trong thư mục đó
- [ ] Chạy: `npm install`
- [ ] Chạy: `npm run dev`
- [ ] Mở trình duyệt tại `http://localhost:5173`
- [ ] ✅ **XONG!**

---

## 🛠️ OPTION 2: Tạo project thủ công

### Bước 1: Tạo project mới
- [ ] Chạy: `npm create vite@latest anime-shop -- --template react-ts`
- [ ] `cd anime-shop`
- [ ] Chạy: `npm install`

### Bước 2: Cài đặt thư viện
- [ ] `npm install react-router@7`
- [ ] `npm install lucide-react`
- [ ] `npm install motion`
- [ ] `npm install recharts`
- [ ] `npm install react-slick slick-carousel`
- [ ] `npm install sonner@2.0.3`

### Bước 3: Tạo cấu trúc thư mục
- [ ] `mkdir -p src/components/admin`
- [ ] `mkdir -p src/components/layout`
- [ ] `mkdir -p src/components/product`
- [ ] `mkdir -p src/components/ui`
- [ ] `mkdir -p src/components/figma`
- [ ] `mkdir -p src/pages`
- [ ] `mkdir -p src/services`
- [ ] `mkdir -p src/data`
- [ ] `mkdir -p src/styles`

### Bước 4: Copy file chính
- [ ] `App.tsx` → `src/App.tsx`
- [ ] `styles/globals.css` → `src/styles/globals.css`
- [ ] Tạo `src/main.tsx` (xem hướng dẫn trong `HUONG_DAN_TAI_VE.md`)

### Bước 5: Copy Pages
- [ ] `pages/HomePage.tsx` → `src/pages/HomePage.tsx`
- [ ] `pages/ProductDetailPage.tsx` → `src/pages/ProductDetailPage.tsx`
- [ ] `pages/CartPage.tsx` → `src/pages/CartPage.tsx`

### Bước 6: Copy Components - Layout
- [ ] `components/layout/Header.tsx` → `src/components/layout/Header.tsx`
- [ ] `components/layout/Sidebar.tsx` → `src/components/layout/Sidebar.tsx`
- [ ] `components/layout/MobileSidebar.tsx` → `src/components/layout/MobileSidebar.tsx`
- [ ] `components/layout/Footer.tsx` → `src/components/layout/Footer.tsx`

### Bước 7: Copy Components - Admin
- [ ] `components/admin/AdminDashboard.tsx` → `src/components/admin/AdminDashboard.tsx`
- [ ] `components/admin/AdminSidebar.tsx` → `src/components/admin/AdminSidebar.tsx`
- [ ] `components/admin/AdminLogin.tsx` → `src/components/admin/AdminLogin.tsx`
- [ ] `components/admin/DashboardOverview.tsx` → `src/components/admin/DashboardOverview.tsx`
- [ ] `components/admin/ProductManagement.tsx` → `src/components/admin/ProductManagement.tsx` ⭐
- [ ] `components/admin/OrderManagement.tsx` → `src/components/admin/OrderManagement.tsx`
- [ ] `components/admin/CustomerManagement.tsx` → `src/components/admin/CustomerManagement.tsx`
- [ ] `components/admin/ReportsAnalytics.tsx` → `src/components/admin/ReportsAnalytics.tsx`

### Bước 8: Copy Components - Product
- [ ] `components/product/ProductCard.tsx` → `src/components/product/ProductCard.tsx`
- [ ] `components/product/ProductSpecs.tsx` → `src/components/product/ProductSpecs.tsx`
- [ ] `components/product/ViewedItems.tsx` → `src/components/product/ViewedItems.tsx`

### Bước 9: Copy Components - Figma
- [ ] `components/figma/ImageWithFallback.tsx` → `src/components/figma/ImageWithFallback.tsx`

### Bước 10: Copy Components - Other
- [ ] `components/Login.tsx` → `src/components/Login.tsx`
- [ ] `components/MyAccount.tsx` → `src/components/MyAccount.tsx`
- [ ] `components/Checkout.tsx` → `src/components/Checkout.tsx`
- [ ] `components/OrderConfirmation.tsx` → `src/components/OrderConfirmation.tsx`

### Bước 11: Copy Components - UI (shadcn/ui)
- [ ] Copy TẤT CẢ file trong `components/ui/` → `src/components/ui/`
  - accordion.tsx
  - alert.tsx
  - badge.tsx
  - button.tsx
  - card.tsx
  - checkbox.tsx
  - dialog.tsx
  - input.tsx
  - label.tsx
  - select.tsx
  - separator.tsx
  - table.tsx
  - tabs.tsx
  - textarea.tsx
  - ... (và tất cả file khác)

### Bước 12: Copy Services & Data
- [ ] `services/amiamiService.ts` → `src/services/amiamiService.ts`
- [ ] `data/mockData.ts` → `src/data/mockData.ts`

### Bước 13: Chạy project
- [ ] `npm run dev`
- [ ] Mở `http://localhost:5173`
- [ ] Kiểm tra homepage hiển thị OK
- [ ] ✅ **HOÀN TẤT!**

---

## 🧪 Kiểm tra tính năng

### Customer Store
- [ ] Homepage hiển thị đúng
- [ ] Hero slider hoạt động
- [ ] Product grid hiển thị sản phẩm
- [ ] Click vào sản phẩm → Product detail page
- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Xem giỏ hàng
- [ ] Point system hoạt động
- [ ] Checkout flow hoàn chỉnh
- [ ] Login/Register modal
- [ ] My Account page
- [ ] Footer hiển thị đầy đủ 4 cột
- [ ] Mobile responsive

### Admin Dashboard
- [ ] Truy cập `/admin`
- [ ] Đăng nhập: `admin` / `admin123`
- [ ] Dashboard overview hiển thị stats
- [ ] Quản lý sản phẩm
  - [ ] Xem danh sách sản phẩm
  - [ ] Filter theo category
  - [ ] Search sản phẩm
  - [ ] Click "Thêm sản phẩm"
  - [ ] Thấy box Auto-fetch từ AmiAmi
  - [ ] Click "Xem danh sách URL mẫu"
  - [ ] Chọn 1 URL mẫu
  - [ ] Click "Lấy thông tin"
  - [ ] Form tự động điền
  - [ ] Submit thêm sản phẩm thành công
- [ ] Quản lý đơn hàng
- [ ] Quản lý khách hàng
- [ ] Báo cáo & thống kê
- [ ] Nút "Quay lại cửa hàng" hoạt động
- [ ] Sidebar navigation hoạt động

---

## 🎯 TEST TÍNH NĂNG AUTO-FETCH AMIAMI

### Các URL mẫu để test:
- [ ] `https://www.amiami.com/eng/detail?gcode=FIGURE-197861` (Hatsune Miku)
- [ ] `https://www.amiami.com/eng/detail?gcode=FIGURE-169420` (Rem Crystal Dress)
- [ ] `https://www.amiami.com/eng/detail?gcode=FIGURE-145678` (Nendoroid Nezuko)
- [ ] `https://www.amiami.com/eng/detail?gcode=FIGURE-123456` (Asuka Evangelion)
- [ ] `https://www.amiami.com/eng/detail?gcode=GOODS-789012` (Spy x Family Acrylic)
- [ ] `https://www.amiami.com/eng/detail?gcode=CD-456789` (Attack on Titan OST)

### Kiểm tra kết quả:
- [ ] Form điền đầy đủ: Tên, Series, Manufacturer, SKU
- [ ] Category tự động chọn đúng
- [ ] Giá hiển thị (VNĐ)
- [ ] Specs tự động điền: Material, Size, Sculptor, Release Date
- [ ] Tags tự động tạo
- [ ] Image URL có hình ảnh
- [ ] Có thể submit và tạo sản phẩm mới

---

## 🐛 Troubleshooting

Nếu gặp lỗi, kiểm tra:

- [ ] Node.js version đúng (`node --version`)
- [ ] npm đã cài đặt hết dependencies (`npm install`)
- [ ] Import paths đúng (chú ý `./` và `../`)
- [ ] File `src/main.tsx` có import CSS
- [ ] Port 5173 không bị chiếm
- [ ] Console không có lỗi đỏ
- [ ] Network tab không có 404 errors

### Lỗi thường gặp:
- [ ] Module not found → Chạy `npm install`
- [ ] CSS không load → Check import trong `main.tsx`
- [ ] React Router error → Cài `npm install react-router@7`
- [ ] Build error → Kiểm tra TypeScript syntax

---

## 📚 Documentation đã đọc

- [ ] `HUONG_DAN_TAI_VE.md` - Hướng dẫn tải về
- [ ] `DOWNLOAD_GUIDE.md` - Chi tiết kỹ thuật
- [ ] `QUICK_START_GUIDE.md` - Hướng dẫn nhanh
- [ ] `ADMIN_GUIDE.md` - Hướng dẫn Admin
- [ ] `PROJECT_STRUCTURE.md` - Cấu trúc project

---

## 🎉 HOÀN TẤT!

- [ ] ✅ Project chạy thành công trên localhost
- [ ] ✅ Tất cả tính năng hoạt động bình thường
- [ ] ✅ Auto-fetch AmiAmi test thành công
- [ ] ✅ Admin Dashboard đầy đủ tính năng
- [ ] ✅ Customer Store responsive
- [ ] ✅ Không còn lỗi trong console
- [ ] ✅ Sẵn sàng để phát triển tiếp!

---

**🎊 CONGRATULATIONS! 🎊**

Bạn đã setup thành công website Anime Shop với đầy đủ tính năng!

Next steps:
- Customize design theo ý thích
- Thêm sản phẩm thực tế
- Tích hợp backend API
- Deploy lên hosting
- Share với bạn bè! 🚀
