# 🏗️ Cấu trúc Project - AnimeShop E-commerce

## 📁 Tổ chức thư mục (Client-Customer Architecture)

```
client-customer/
├── /components/              # Các component tái sử dụng
│   ├── /layout/              # Layout components
│   │   ├── Header.tsx        # Header với search, cart, user, mobile menu
│   │   ├── Footer.tsx        # Footer 4 cột (Company, Store, Support, User)
│   │   ├── Sidebar.tsx       # Left sidebar navigation (AmiAmi style) ← NEW!
│   │   └── MobileSidebar.tsx # Mobile sidebar menu ← NEW!
│   │
│   ├── /product/             # Product-related components
│   │   ├── ProductCard.tsx   # Card sản phẩm cho grid
│   │   ├── ProductSpecs.tsx  # Thông tin chi tiết sản phẩm (Phong cách AmiAmi)
│   │   └── ViewedItems.tsx   # Recently viewed items (Sticky footer)
│   │
│   ├── /ui/                  # UI primitives (shadcn/ui)
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   └── ...
│   │
│   ├── Login.tsx             # Form đăng nhập/đăng ký
│   ├── Checkout.tsx          # Trang checkout (3 steps)
│   ├── MyAccount.tsx         # Trang tài khoản người dùng
│   └── OrderConfirmation.tsx # Xác nhận đơn hàng
│
├── /pages/                   # Các trang chính
│   ├── HomePage.tsx          # Trang chủ với 2-column layout ← UPDATED!
│   ├── ProductDetailPage.tsx # Chi tiết sản phẩm (AmiAmi style)
│   └── CartPage.tsx          # Giỏ hàng
│
├── /data/                    # Mock data
│   └── mockData.ts           # Products, bundles, categories
│
├── /styles/                  # Global styles
│   └── globals.css           # Tailwind CSS + custom styles
│
└── App.tsx                   # Routing & State management
```

---

## 🎨 Thiết kế mới - Left Sidebar Navigation (AmiAmi Style)

### ✨ Layout Structure:

#### **2-Column Layout:**
- **Left Sidebar** (20-25% width): Category navigation
- **Right Content** (75-80% width): Banner slider + Product grid

#### **Sidebar Features:**

**1️⃣ Header Section:**
- Tiêu đề: "Search by Category"
- Background xám nhạt (#F5F5F5)
- Border bottom

**2️⃣ Main Categories:**
- **Icon** (Line-art style, 24px) + **Category Name** + **Chevron Right**
- Hiển thị số lượng items
- Hover effect: Background xám nhạt + Text màu cam (#FF9900)
- Categories:
  - Figures (2,840 items)
  - Plastic Models (1,560 items)
  - Goods (3,200 items)
  - Media/CD/DVD (890 items)
  - Brands (450 items)

**3️⃣ Divider:**
- Border 2px màu xám (#E5E7EB)

**4️⃣ Secondary Links (Quick Access):**
- Ranking (với TrendingUp icon)
- New Arrivals (với Clock icon)
- Sale Items (với Tag icon + HOT badge)
- Pre-owned (với RotateCcw icon)

**5️⃣ Promotional Banner:**
- Gradient orange-yellow
- "Member Exclusive - Get 10% OFF"
- CTA button "Sign Up Now"

**6️⃣ Support Info:**
- Free shipping info
- Authenticity guarantee

### 📱 Mobile Responsive:

**Desktop (≥1024px):**
- Sidebar visible, sticky position
- 2-column layout

**Mobile (<1024px):**
- Sidebar hidden by default
- Hamburger menu button in header
- Full-screen overlay sidebar
- Close button (X)

---

## 🎨 Thiết kế mới - Product Detail Page

### ✨ Highlights:

#### 1️⃣ **Khối 1: Data Grid - About This Item**
- Thiết kế bảng 2 cột (Table style) với đường viền rõ ràng
- Hiển thị: Release Date, Price, Shop Code, JAN, Brand, Series, Character
- **Purchase Limit** in đậm màu cam/đỏ

#### 2️⃣ **Khối 2: Specifications & Set Contents**
- Specifications với icons (Ruler, Package)
- Scale, Size, Material hiển thị inline
- Set Contents dạng bullet points
- Copyright notice ở cuối

#### 3️⃣ **Khối 3: Important Notes (Accordion)**
- Mặc định thu gọn
- Click để mở rộng
- Nội dung: Pre-order info, Bonus, Product notes, Payment
- Background xám nhạt để phân biệt

#### 4️⃣ **Khối 4: Viewed Items (Sticky Footer)**
- Hiển thị ở đáy trang
- Recently viewed products
- Button "Clear History"
- Có thể đóng/mở

---

## 🎯 Tính năng chính

### Pages:
- ✅ **HomePage**: 2-column layout, Sidebar navigation, Hero slider, Product grid
- ✅ **ProductDetailPage**: Gallery, AR View, Specs (AmiAmi style), Bundle deals
- ✅ **CartPage**: Cart items, Order summary, Points system
- ✅ **Checkout**: 3-step process (Shipping → Payment → Review)
- ✅ **MyAccount**: Profile, Points, Order history, Membership tiers
- ✅ **Login/Register**: Authentication with bonus points

### Components:
- ✅ **Header**: Search, Cart count, User indicator, Mobile menu
- ✅ **Sidebar**: Vertical navigation (AmiAmi style) ← NEW!
- ✅ **MobileSidebar**: Mobile overlay menu ← NEW!
- ✅ **Footer**: 4 columns (Company, Store, Support, Points)
- ✅ **ProductCard**: Reusable product card
- ✅ **ProductSpecs**: Professional specs display (AmiAmi style)
- ✅ **ViewedItems**: Sticky recently viewed section

---

## 🚀 Tech Stack

- **React** + **TypeScript**
- **React Router** (Routing)
- **Tailwind CSS** (Styling)
- **Lucide Icons** (Icons)
- **Mock Data** (Frontend only - No backend)

---

## 🎨 Design System

### Colors:
- **Primary**: `#FF9900` (Orange)
- **Hover**: `#E68A00` (Darker orange)
- **Background**: White, Gray-50, Gray-100
- **Borders**: Gray-200, Gray-300
- **Sidebar Hover**: Gray-50 (#F5F5F5)

### Typography:
- **Font Family**: Sans-serif (System fonts)
- **Headings**: Bold
- **Body**: Regular weight
- **Sidebar**: 14-15px, medium weight

### Icons:
- **Style**: Line-art, simple stroke
- **Size**: 24px (main categories), 20px (secondary)
- **Color**: Gray-700 default, Orange-600 on hover

### Style:
- **Clean minimalist UI**
- **Dense information design** (Product specs)
- **Vertical Navigation** (AmiAmi style) ← NEW!
- **Table borders** (Product specs)
- **Japanese E-commerce vibe**

---

## 📝 Notes

- Tất cả data đều là **mock data** (Frontend only)
- Không sử dụng backend/database
- Points system chỉ là UI demo
- Payment chỉ là form demo, không kết nối gateway thật
- Sidebar sticky position trên desktop
- Mobile menu với full-screen overlay

---

## 🔄 Latest Changes

**v2.0 - Left Sidebar Navigation (AmiAmi Style):**
- ✅ Chuyển từ horizontal menu sang vertical sidebar
- ✅ Layout 2 cột (Sidebar 25% + Content 75%)
- ✅ Main categories với icons + hover effects
- ✅ Secondary quick access links
- ✅ Promotional banner trong sidebar
- ✅ Mobile responsive với overlay menu
- ✅ Hamburger menu button cho mobile

**Đã thay đổi:**
- `Header.tsx`: Loại bỏ horizontal navigation menu
- `HomePage.tsx`: Thêm 2-column layout với Sidebar
- **NEW**: `Sidebar.tsx` - Vertical navigation
- **NEW**: `MobileSidebar.tsx` - Mobile menu

---

## 🔄 Migration từ cấu trúc cũ

**Đã chuyển:**
- `/components/Header.tsx` → `/components/layout/Header.tsx`
- `/components/Footer.tsx` → `/components/layout/Footer.tsx`
- `/components/Homepage.tsx` → `/pages/HomePage.tsx`
- `/components/ProductDetail.tsx` → `/pages/ProductDetailPage.tsx`
- `/components/ShoppingCart.tsx` → `/pages/CartPage.tsx`

**Mới tạo:**
- `/components/layout/Sidebar.tsx` ← **NEW!**
- `/components/layout/MobileSidebar.tsx` ← **NEW!**
- `/components/product/ProductCard.tsx`
- `/components/product/ProductSpecs.tsx`
- `/components/product/ViewedItems.tsx`