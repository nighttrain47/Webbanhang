# 🎯 HƯỚNG DẪN ADMIN DASHBOARD - ANIME STORE

## 📋 Tổng quan

Admin Dashboard là hệ thống quản trị hoàn chỉnh cho cửa hàng Anime Store, được thiết kế theo phong cách **Japanese E-commerce** với màu cam #FF9900, clean minimalist UI, và hoàn toàn bằng tiếng Việt.

---

## 🚀 Truy cập Admin Dashboard

### URL:
```
http://localhost:5173/admin-login
```

### Thông tin đăng nhập Demo:
- **Username:** `admin`
- **Password:** `admin123`

---

## 📱 Cấu trúc Admin Dashboard

### 1. **Dashboard Tổng quan** (`/admin-dashboard`)
**Chức năng:**
- Hiển thị thống kê tổng quan theo thời gian thực
- 4 KPI cards: Doanh thu hôm nay, Đơn hàng mới, Khách hàng mới, Sản phẩm bán chạy
- Biểu đồ doanh thu 7 ngày
- Danh sách đơn hàng gần đây
- Top 5 sản phẩm bán chạy nhất

**Metrics:**
- ✅ Doanh thu hôm nay: 15,240,000đ (+12.5%)
- ✅ Đơn hàng mới: 24 (+8.2%)
- ✅ Khách hàng mới: 12 (-3.1%)
- ✅ Sản phẩm bán chạy: 156 (+15.3%)

---

### 2. **Quản lý Sản phẩm** (Product Management)
**Chức năng:**
- ✅ **CREATE:** Thêm sản phẩm mới với đầy đủ thông tin
- ✅ **READ:** Xem danh sách sản phẩm với filter & search
- ✅ **UPDATE:** Chỉnh sửa thông tin sản phẩm
- ✅ **DELETE:** Xóa sản phẩm (có confirm)

**Tính năng:**
- Search: Tìm theo tên sản phẩm, SKU
- Filter: Lọc theo danh mục, trạng thái
- Stats: Tổng sản phẩm, Đang bán, Hết hàng, Tổng tồn kho
- Table view với thông tin đầy đủ
- Modal form cho thêm/sửa sản phẩm
- Upload ảnh sản phẩm

**Trường thông tin sản phẩm:**
- Tên sản phẩm *
- SKU *
- Danh mục (Figures/CDs/Goods)
- Giá (VNĐ) *
- Số lượng tồn kho *
- Trạng thái (Đang bán/Tạm ngưng/Hết hàng)
- Mô tả
- Hình ảnh

---

### 3. **Quản lý Đơn hàng** (Order Management)
**Chức năng:**
- Xem danh sách đơn hàng với filter theo trạng thái
- Chi tiết đơn hàng expandable
- Cập nhật trạng thái đơn hàng
- Tracking vận chuyển

**Trạng thái đơn hàng:**
- 🟡 **Chờ xác nhận** (Pending)
- 🔵 **Đang xử lý** (Processing)
- 🟣 **Đang vận chuyển** (Shipping)
- 🟢 **Đã giao** (Delivered)
- 🔴 **Đã hủy** (Cancelled)

**Thông tin đơn hàng:**
- Mã đơn hàng
- Thông tin khách hàng (Tên, Email, SĐT, Địa chỉ)
- Danh sách sản phẩm
- Tạm tính, Phí vận chuyển, Tổng cộng
- Phương thức thanh toán
- Mã vận đơn (Tracking number)

**Actions:**
- Xác nhận đơn (Pending → Processing)
- Chuyển sang vận chuyển (Processing → Shipping)
- Đánh dấu đã giao (Shipping → Delivered)
- Hủy đơn (Pending → Cancelled)

---

### 4. **Quản lý Khách hàng** (Customer Management)
**Chức năng:**
- Xem danh sách khách hàng
- Filter theo hạng thành viên
- Search theo tên, email, ID
- Xem chi tiết thông tin khách hàng
- Lịch sử mua hàng

**Stats:**
- Tổng khách hàng
- Khách hàng mới (tháng)
- Tổng đơn hàng
- Tổng doanh thu

**Hạng thành viên:**
- 🥉 **Bronze:** 0 - 9,999 điểm
- 🥈 **Silver:** 10,000 - 29,999 điểm
- 🥇 **Gold:** 30,000 - 99,999 điểm
- 💎 **Platinum:** 100,000+ điểm

**Thông tin khách hàng:**
- ID khách hàng
- Tên, Email, Số điện thoại
- Địa chỉ
- Hạng thành viên
- Tổng đơn hàng
- Tổng chi tiêu
- Điểm tích lũy
- Ngày tham gia

**Chi tiết khách hàng (Modal):**
- Thông tin cá nhân đầy đủ
- Thống kê (Tổng đơn, Tổng chi tiêu, Điểm)
- Đơn hàng gần đây
- Actions: Gửi email, Xem tất cả đơn hàng

---

### 5. **Báo cáo & Thống kê** (Reports & Analytics)
**Chức năng:**
- Biểu đồ doanh thu theo ngày
- Phân tích theo danh mục
- Top sản phẩm bán chạy
- Metrics chi tiết

**Filters:**
- Khoảng thời gian: 7 ngày, 30 ngày, 3 tháng, 6 tháng, 1 năm
- Loại báo cáo: Doanh thu, Đơn hàng, Sản phẩm, Khách hàng
- So sánh với kỳ trước hoặc cùng kỳ năm trước

**KPIs:**
- Tổng doanh thu (7 ngày): 20,470,000đ (+12.5%)
- Đơn hàng (7 ngày): 99 (+8.2%)
- Giá trị đơn trung bình: 206,768đ (+3.5%)
- Sản phẩm đã bán: 289 (+15.3%)

**Biểu đồ:**
- 📊 Revenue Chart: Doanh thu theo ngày với hover tooltip
- 📈 Category Breakdown: Phân bổ theo danh mục (%)
- 🏆 Top Products Table: 5 sản phẩm bán chạy nhất với growth rate

**Additional Metrics:**
- Tỷ lệ hoàn thành đơn: 94.5%
- Khách hàng quay lại: 68%
- Thời gian xử lý trung bình: 2.3 giờ

**Export:**
- Button "Xuất báo cáo" để tải về file Excel/PDF

---

### 6. **Cài đặt** (Settings)
**Chức năng:**
- Cài đặt thông tin cửa hàng
- Cài đặt thanh toán
- Cấu hình hệ thống

**Thông tin cửa hàng:**
- Tên cửa hàng
- Email liên hệ
- Số điện thoại
- Địa chỉ

**Phương thức thanh toán:**
- ✅ COD (Thanh toán khi nhận hàng)
- ✅ Chuyển khoản ngân hàng
- ☐ Ví điện tử (MoMo, ZaloPay)

---

## 🎨 Thiết kế UI/UX

### Color Scheme:
- **Primary:** #FF9900 (Orange)
- **Secondary:** #E68A00 (Darker Orange)
- **Success:** Green
- **Warning:** Yellow
- **Danger:** Red
- **Info:** Blue

### Typography:
- Font: Sans-serif (system font stack)
- Clean, minimalist design
- Japanese E-commerce style

### Responsive:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)
- Mobile sidebar với overlay

---

## 📊 Mock Data

### Products: 5 sản phẩm
- Miku Hatsune 1/7 Scale Figure
- Rem: Crystal Dress Ver.
- Attack on Titan OST Collection
- Nendoroid Nezuko
- Demon Slayer Art Book

### Orders: 4 đơn hàng
- Các trạng thái khác nhau
- Địa chỉ Việt Nam
- Tracking numbers VN

### Customers: 5 khách hàng
- 4 hạng thành viên khác nhau
- Lịch sử mua hàng
- Điểm tích lũy

---

## 🔧 Technical Stack

### Components Structure:
```
/components/admin/
├── AdminDashboard.tsx       (Main container)
├── AdminSidebar.tsx         (Navigation)
├── AdminLogin.tsx           (Login page)
├── DashboardOverview.tsx    (Dashboard home)
├── ProductManagement.tsx    (CRUD products)
├── OrderManagement.tsx      (Manage orders)
├── CustomerManagement.tsx   (Manage customers)
└── ReportsAnalytics.tsx     (Reports & charts)
```

### State Management:
- React useState hooks
- Local component state
- No external state library needed

### Routing:
- React Router v6
- Routes:
  - `/admin-login` - Admin login page
  - `/admin-dashboard` - Main dashboard

---

## 🚦 Workflow

### 1. Login Flow:
```
/admin-login → Enter credentials → /admin-dashboard
```

### 2. Product Management Flow:
```
Products → Click "Thêm sản phẩm" → Fill form → Save → List updated
Products → Click Edit icon → Update form → Save → List updated
Products → Click Delete icon → Confirm → Deleted
```

### 3. Order Management Flow:
```
Orders → Filter by status → Click order → View details → Update status
Pending → "Xác nhận đơn" → Processing
Processing → "Chuyển sang vận chuyển" → Shipping
Shipping → "Đánh dấu đã giao" → Delivered
```

### 4. Reports Flow:
```
Reports → Select date range → View charts → Export report
```

---

## ✅ Features Checklist

### Dashboard:
- [x] Real-time stats
- [x] Revenue chart
- [x] Recent orders
- [x] Top products

### Products:
- [x] CRUD operations
- [x] Search & filters
- [x] Image upload UI
- [x] Stock management
- [x] Status management

### Orders:
- [x] List view
- [x] Detail view
- [x] Status updates
- [x] Customer info
- [x] Tracking numbers

### Customers:
- [x] List view
- [x] Detail modal
- [x] Tier system
- [x] Purchase history
- [x] Points tracking

### Reports:
- [x] Revenue charts
- [x] Category breakdown
- [x] Top products
- [x] Date range filters
- [x] Export button
- [x] KPI metrics

### Settings:
- [x] Store info
- [x] Payment methods
- [x] System config

---

## 🎯 Next Steps (Future Enhancements)

### Phase 2:
- [ ] Real-time notifications
- [ ] Advanced analytics (conversion rate, cart abandonment)
- [ ] Inventory alerts
- [ ] Bulk operations
- [ ] Image gallery management
- [ ] Email templates
- [ ] SMS notifications
- [ ] Multi-admin roles & permissions

### Phase 3:
- [ ] API integration
- [ ] Database connectivity
- [ ] Authentication system
- [ ] File upload to cloud storage
- [ ] Advanced reporting (PDF/Excel export)
- [ ] Multi-language support for admin

---

## 📝 Notes

- **100% Mock Data:** Tất cả dữ liệu đều là mock, không kết nối database thật
- **100% Tiếng Việt:** Toàn bộ giao diện admin bằng tiếng Việt
- **100% VNĐ:** Tất cả giá tiền đều là VNĐ
- **Responsive Design:** Hoạt động tốt trên mọi thiết bị
- **No Backend Required:** Pure frontend implementation

---

## 🆘 Troubleshooting

### Không thể đăng nhập?
- Kiểm tra username: `admin`
- Kiểm tra password: `admin123`

### Sidebar không hiển thị trên mobile?
- Click vào icon Menu (☰) ở góc trên bên trái

### Dữ liệu không cập nhật?
- Dữ liệu được lưu trong state, sẽ reset khi refresh trang
- Đây là mock data, không persist

---

## 📞 Support

Nếu cần hỗ trợ hoặc có câu hỏi, vui lòng liên hệ:
- Email: admin@animestore.vn
- Hotline: +84 28 1234 5678

---

**Happy Managing! 🎉**
