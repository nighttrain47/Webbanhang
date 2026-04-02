# 🏗️ Kiến trúc Hệ thống HobbyShop

> **Điều hướng nhanh:**
> [README](../README.md) · [Cấu trúc thư mục](./DIRECTORY_STRUCTURE.md) · [Công nghệ](./TECH_STACK.md) · [API](./API_REFERENCE.md) · [Triển khai](./DEPLOYMENT.md) · [Vấn đề & Giải pháp](./PROBLEM_SOLVING.md)

---

## 1. Tổng quan Kiến trúc

HobbyShop áp dụng mô hình **Client-Server** với kiến trúc **API-first**. Backend là một REST API độc lập, phục vụ đồng thời cho nhiều client khác nhau.

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENTS                          │
│                                                         │
│  ┌──────────────────┐     ┌──────────────────┐          │
│  │  Customer Website│     │   Admin Panel    │          │
│  │  React SPA       │     │   React SPA      │          │
│  │  Port :3000      │     │   Port :3001     │          │
│  └────────┬─────────┘     └────────┬─────────┘          │
└───────────┼──────────────────────┼─────────────────────┘
            │  HTTP/JSON REST API  │
            └──────────┬───────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                     BACKEND SERVER                      │
│                                                         │
│  Express.js (Node.js) — Port :5000                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  /api/admin │  │/api/customer │  │   /shop (EJS) │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
│         └────────────────┼──────────────────┘           │
│                          ▼                              │
│              JWT Middleware / Session                   │
│                          │                              │
│              Business Logic (DAOs)                      │
│                          │                              │
│              Mongoose ODM                               │
└──────────────────────────┼──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                    │
│                                                         │
│  Collections:  products │ orders │ customers            │
│               categories │ brands │ articles │ reviews  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Sơ đồ Kiến trúc (Mermaid)

```mermaid
graph TD
    subgraph Frontend["🖥️ Frontend (Vercel CDN)"]
        CC["🌐 Client Customer\nReact SPA\nPort 3000"]
        CA["🛠️ Client Admin\nReact SPA\nPort 3001"]
    end

    subgraph Backend["🖧 Backend (Render)"]
        EX["Express.js Server"]
        MW["JWT / Session Middleware"]
        API_A["/api/admin/*"]
        API_C["/api/customer/*"]
        SSR["/shop/* (EJS SSR)"]
        DAO["Mongoose DAOs"]
    end

    subgraph DB["🍃 Database (MongoDB Atlas)"]
        COL["Collections:\nproducts · orders · customers\ncategories · brands · articles · reviews"]
    end

    CC -->|REST API| EX
    CA -->|REST API| EX
    EX --> MW
    MW --> API_A
    MW --> API_C
    MW --> SSR
    API_A --> DAO
    API_C --> DAO
    SSR --> DAO
    DAO --> COL

    style CC fill:#4285F4,color:#fff
    style CA fill:#EA4335,color:#fff
    style EX fill:#34A853,color:#fff
    style COL fill:#FBBC05,color:#000
```

---

## 3. Luồng Xác thực (Authentication Flow)

Hệ thống sử dụng **JWT (JSON Web Token)** cho admin và **Session + JWT** cho customer.

```mermaid
sequenceDiagram
    participant U as Người dùng
    participant C as Frontend (React)
    participant S as Backend (Express)
    participant DB as MongoDB
    participant Email as Nodemailer

    Note over U,Email: Đăng ký tài khoản mới
    U->>C: Nhập email + mật khẩu
    C->>S: POST /api/customer/signup
    S->>DB: Lưu user (password bcrypt hash)
    S->>DB: Tạo OTP token (TTL 5 phút)
    S->>Email: Gửi email xác minh OTP
    Email-->>U: Email với mã OTP

    Note over U,Email: Xác minh tài khoản
    U->>C: Nhập mã OTP
    C->>S: GET /api/customer/active?id=&token=
    S->>DB: Validate OTP, kích hoạt tài khoản
    S-->>C: ✅ Tài khoản đã active

    Note over U,Email: Đăng nhập
    U->>C: Nhập email + mật khẩu
    C->>S: POST /api/customer/login
    S->>DB: Kiểm tra credentials
    S-->>C: JWT Token (expires 7d)
    C->>C: Lưu token vào localStorage

    Note over U,Email: Request có bảo vệ
    C->>S: GET /api/customer/orders\n(Authorization: Bearer <token>)
    S->>S: jwtAuth middleware validate token
    S->>DB: Query data
    S-->>C: Response data
```

---

## 4. Luồng Mua sắm & Thanh toán (Checkout Flow)

```mermaid
flowchart TD
    A["🛒 Thêm vào giỏ hàng\n(CartContext - localStorage)"] --> B["📋 Trang Giỏ hàng\n(Xem, chỉnh số lượng, xóa)"]
    B --> C{"Đã đăng nhập?"}
    C -->|Chưa| D["🔑 Trang Đăng nhập"]
    D --> E["📦 Trang Checkout"]
    C -->|Rồi| E
    E --> F["Thu thập thông tin"]
    F --> G["📍 Địa chỉ giao hàng\n(tên, SĐT, địa chỉ)"]
    F --> H["💳 Phương thức thanh toán\n(COD / Chuyển khoản)"]
    G --> I["POST /api/customer/orders"]
    H --> I
    I --> J["💾 Lưu Order vào MongoDB"]
    J --> K["✉️ Gửi email hóa đơn"]
    J --> L["🔄 Reset giỏ hàng"]
    K --> M["✅ Trang xác nhận đơn hàng"]
    L --> M

    style A fill:#4285F4,color:#fff
    style J fill:#34A853,color:#fff
    style M fill:#FBBC05,color:#000
```

---

## 5. Luồng Hạng Thành viên (Membership Tier)

```mermaid
flowchart LR
    A["Khách hàng đặt hàng"] --> B["Đơn hàng 'delivered'"]
    B --> C["Tính tổng chi tiêu\n(Aggregation Pipeline)"]
    C --> D{Tổng chi tiêu?}
    D -->|"< 1,000,000đ"| E["🥉 Bronze\nDiscount: 2%"]
    D -->|"1M – 5M"| F["🥈 Silver\nDiscount: 5%"]
    D -->|"> 5,000,000đ"| G["🥇 Gold\nDiscount: 8%"]

    style E fill:#CD7F32,color:#fff
    style F fill:#C0C0C0,color:#000
    style G fill:#FFD700,color:#000
```

---

## 6. Cấu trúc Database Collections

### `products`
```json
{
  "_id": "ObjectId",
  "name": "Figure Goku Super Saiyan",
  "description": "...",
  "price": 850000,
  "category": "ObjectId → categories",
  "brand": "ObjectId → brands",
  "images": ["url1", "url2"],
  "stock": 15,
  "releaseDate": "2024-06-01",   // cho pre-order
  "isHot": true,
  "isNew": true,
  "status": "active"
}
```

### `orders`
```json
{
  "_id": "ObjectId",
  "customer": "ObjectId → customers",
  "items": [
    { "product": "ObjectId", "name": "...", "price": 850000, "quantity": 2 }
  ],
  "shippingAddress": {
    "fullName": "Nguyen Van A",
    "phone": "0901234567",
    "address": "123 Đường ABC, TP.HCM"
  },
  "paymentMethod": "COD",
  "totalAmount": 1700000,
  "status": "pending",           // pending|confirmed|shipping|delivered|cancelled
  "createdAt": "2026-04-01T..."
}
```

### `customers`
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "password": "$2b$...",         // bcrypt hash
  "fullName": "Nguyen Van A",
  "phone": "0901234567",
  "isActive": true,
  "otpToken": "...",
  "otpExpires": "Date",
  "membershipTier": "silver",    // bronze|silver|gold (tính động)
  "createdAt": "Date"
}
```

---

## 7. Giao tiếp Frontend ↔ Backend

### Config API URL
Mỗi client có file `src/config.ts`:
```typescript
// client-customer/src/config.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default API_URL;
```

### CORS Setup (server)
```javascript
// server/index.js
app.use(cors({
  origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
  credentials: true
}));
```

### JWT Header
```typescript
// Frontend gửi kèm JWT trong mọi request cần auth
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
}
```

---

*Điều hướng: [⬆️ Về README](../README.md) · [➡️ Công nghệ sử dụng](./TECH_STACK.md)*
