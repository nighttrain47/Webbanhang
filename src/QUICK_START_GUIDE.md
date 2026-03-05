# 🚀 Hướng dẫn sử dụng AnimeShop

## 📋 Mục lục
1. [Cách đăng nhập](#cách-đăng-nhập)
2. [Cách đăng ký tài khoản mới](#cách-đăng-ký-tài-khoản-mới)
3. [Tính năng chính](#tính-năng-chính)
4. [Demo Accounts](#demo-accounts)

---

## 🔐 Cách đăng nhập

### Phương pháp 1: Từ Header
1. Click vào icon **User** (👤) ở góc phải trên cùng
2. Bạn sẽ được chuyển đến trang Login

### Phương pháp 2: Từ URL
- Truy cập trực tiếp: `/login`

### Bước đăng nhập:

1. **Trên trang Login**, bạn sẽ thấy 2 tab:
   - **Login** (Đăng nhập)
   - **Sign Up** (Đăng ký)

2. **Ở tab Login**, nhập thông tin:
   ```
   Email: Bất kỳ email nào (VD: user@example.com)
   Password: Bất kỳ password nào (VD: 123456)
   ```

3. Click nút **"Login"**

4. ✅ Bạn sẽ được đăng nhập với tài khoản mock:
   ```
   Name: Otaku User
   Email: [email bạn vừa nhập]
   Points: 15,000 điểm
   Member Since: 2024-01-15
   ```

5. Sau khi đăng nhập thành công, bạn sẽ được chuyển về **Homepage**

---

## 📝 Cách đăng ký tài khoản mới

1. Trên trang Login, click tab **"Sign Up"**

2. Nhập thông tin:
   ```
   Full Name: Tên của bạn (VD: Nguyễn Văn A)
   Email: Email bất kỳ (VD: newuser@example.com)
   Password: Mật khẩu bất kỳ (VD: 123456)
   Confirm Password: Nhập lại mật khẩu
   ```

3. Click nút **"Create Account"**

4. 🎁 Bạn sẽ nhận được:
   - **Welcome Bonus**: 1,000 điểm
   - Tài khoản mới với tên bạn đã nhập

---

## ✨ Tính năng chính

### Sau khi đăng nhập, bạn có thể:

#### 1️⃣ **Xem thông tin tài khoản**
- Click vào icon User (👤) → Sẽ chuyển đến **My Account**
- Xem:
  - Thông tin cá nhân
  - Số điểm tích lũy
  - Membership tier (Bronze/Silver/Gold/Platinum)
  - Lịch sử đơn hàng

#### 2️⃣ **Mua sắm**
- Browse sản phẩm trên Homepage
- Click vào sản phẩm để xem chi tiết
- Thêm vào giỏ hàng
- Checkout (Thanh toán)

#### 3️⃣ **Tích điểm**
- Mỗi đơn hàng được tích **1% giá trị** thành điểm
- VD: Mua ¥100,000 → Nhận 1,000 điểm

#### 4️⃣ **Wishlist**
- Click vào icon ❤️ trên ProductCard để thêm vào wishlist
- Xem wishlist trong trang My Account

---

## 🎮 Demo Accounts

### Mock User Info (Sau khi đăng nhập):
```javascript
{
  id: '1',
  name: 'Otaku User' (hoặc tên bạn nhập khi đăng ký),
  email: '[email bạn nhập]',
  points: 15000,
  memberSince: '2024-01-15'
}
```

### Membership Tiers:
- **Bronze**: 0 - 9,999 điểm
- **Silver**: 10,000 - 29,999 điểm
- **Gold**: 30,000 - 99,999 điểm
- **Platinum**: 100,000+ điểm

### Mock user mặc định có **15,000 điểm** → **Silver Tier**

---

## 🛒 Quy trình mua hàng đầy đủ

### Bước 1: Browse sản phẩm
- Xem sản phẩm trên Homepage
- Dùng Sidebar để lọc theo category
- Click "View All" để xem thêm

### Bước 2: Xem chi tiết sản phẩm
- Click vào sản phẩm
- Xem thông tin chi tiết (Specs, Bundle deals)
- Thử tính năng "View in Room AR"

### Bước 3: Thêm vào giỏ hàng
- Click "Add to Cart" hoặc "Pre-order Now"
- Sản phẩm sẽ được thêm vào cart
- Số lượng hiển thị ở icon Cart (🛒)

### Bước 4: Xem giỏ hàng
- Click vào icon Cart (🛒) ở header
- Xem danh sách sản phẩm
- Điều chỉnh số lượng (+/-)
- Xóa sản phẩm nếu cần

### Bước 5: Checkout
- Click "Proceed to Checkout"
- **Bước 1**: Nhập thông tin giao hàng
- **Bước 2**: Chọn phương thức thanh toán
  - Credit Card
  - PayPal
  - Bank Transfer
  - Konbini Payment
  - Pay at Store
- **Bước 3**: Review đơn hàng và xác nhận

### Bước 6: Order Confirmation
- Nhận mã đơn hàng
- Xem tổng điểm tích lũy
- Link đến My Account để theo dõi

---

## 🎯 Các tính năng nổi bật

### ✅ Header
- Search bar (tìm kiếm)
- Cart icon với số lượng
- User icon với status indicator (chấm xanh khi đã login)
- Mobile menu (hamburger) cho màn hình nhỏ

### ✅ Sidebar Navigation (Desktop)
- 5 Main Categories với icons
- 4 Quick Access links
- Promotional banner
- Support info

### ✅ Product Detail Page
- Image gallery với thumbnails
- AR View button
- Specifications (AmiAmi style)
  - Data Grid
  - Specs & Set Contents
  - Important Notes (Accordion)
- Bundle deals (tiết kiệm 10%)
- Recently Viewed Items (sticky footer)

### ✅ Cart & Checkout
- Order summary với points calculation
- Multiple payment methods
- Shipping cost calculation
- Free shipping over ¥200,000

### ✅ My Account
- Profile info
- Points & Membership tier
- Order history
- Wishlist
- Logout button

---

## 💡 Tips & Tricks

### 🔥 Nhận điểm nhanh:
1. Đăng ký mới → +1,000 điểm
2. Mua hàng → +1% giá trị đơn
3. Pre-order → Thường có bonus điểm

### 🎁 Free Shipping:
- Mua từ ¥200,000 trở lên → FREE SHIPPING

### 📱 Mobile Friendly:
- Mở hamburger menu (☰) để xem categories
- Sidebar sẽ hiển thị dạng overlay
- Click ngoài hoặc nút X để đóng

### 🏆 Membership Benefits:
- Bronze: Basic benefits
- Silver: +5% điểm bonus
- Gold: +10% điểm bonus + Early access
- Platinum: +15% điểm bonus + VIP support

---

## ❓ FAQ

**Q: Tôi có cần đăng nhập không?**
A: Không bắt buộc, nhưng đăng nhập để tích điểm và xem order history.

**Q: Password có bắt buộc đúng định dạng không?**
A: Không, đây là mock data nên nhập gì cũng được.

**Q: Tôi có thể logout ở đâu?**
A: Vào My Account → Click nút "Logout" ở cuối trang.

**Q: Dữ liệu có được lưu lại không?**
A: Không, tất cả là mock data. Refresh trang sẽ mất hết.

**Q: Tôi có thể thanh toán thật không?**
A: Không, đây chỉ là demo UI. Không có backend thật.

---

## 🎨 Enjoy shopping! 🛍️

Hãy khám phá toàn bộ tính năng của AnimeShop và trải nghiệm thiết kế phong cách Nhật Bản chuyên nghiệp!

**Happy Shopping! 🎌**
