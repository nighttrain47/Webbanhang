# 📡 API Reference — HobbyShop REST API

> **Điều hướng nhanh:**
> [README](../README.md) · [Cấu trúc thư mục](./DIRECTORY_STRUCTURE.md) · [Kiến trúc](./ARCHITECTURE.md) · [Công nghệ](./TECH_STACK.md) · [Triển khai](./DEPLOYMENT.md) · [Vấn đề & Giải pháp](./PROBLEM_SOLVING.md)

---

## Base URLs

| Môi trường | URL |
| :--- | :--- |
| **Production** | `https://hobbyshop-api.onrender.com` |
| **Local Development** | `http://localhost:5000` |

---

## Xác thực (Authentication)

Các endpoint Admin yêu cầu **JWT Bearer Token** trong header:

```http
Authorization: Bearer <token>
```

Token được cấp khi đăng nhập thành công qua `POST /api/admin/login`.

---

## 🔒 Admin APIs — `/api/admin/*`

> Tất cả endpoints này đều **yêu cầu JWT token** (trừ `/login`).

### Auth

#### `POST /api/admin/login`
Đăng nhập admin.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "username": "admin"
  }
}
```

---

### Sản phẩm (Products)

#### `GET /api/admin/products`
Danh sách sản phẩm có phân trang.

**Query Params:**
| Param | Type | Mô tả |
| :--- | :--- | :--- |
| `page` | number | Trang hiện tại (default: 1) |
| `limit` | number | Số item mỗi trang (default: 10) |
| `search` | string | Tìm theo tên sản phẩm |
| `category` | string | Lọc theo category ID |

**Response:**
```json
{
  "products": [...],
  "total": 120,
  "page": 1,
  "totalPages": 12
}
```

#### `POST /api/admin/products`
Thêm sản phẩm mới.

**Request Body:**
```json
{
  "name": "Figure Goku Super Saiyan",
  "description": "...",
  "price": 850000,
  "category": "category_id",
  "brand": "brand_id",
  "images": ["url1", "url2"],
  "stock": 15,
  "releaseDate": "2024-06-01",
  "isHot": false,
  "isNew": true
}
```

#### `PUT /api/admin/products/:id`
Cập nhật thông tin sản phẩm.

#### `DELETE /api/admin/products/:id`
Xóa sản phẩm.

---

### Danh mục (Categories)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/admin/categories` | Danh sách danh mục |
| POST | `/api/admin/categories` | Tạo danh mục mới |
| PUT | `/api/admin/categories/:id` | Cập nhật danh mục |
| DELETE | `/api/admin/categories/:id` | Xóa danh mục |

**Category structure:**
```json
{
  "name": "Action Figure",
  "slug": "action-figure",
  "description": "...",
  "image": "url"
}
```

---

### Thương hiệu (Brands)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/admin/brands` | Danh sách thương hiệu |
| POST | `/api/admin/brands` | Tạo thương hiệu |
| PUT | `/api/admin/brands/:id` | Cập nhật thương hiệu |
| DELETE | `/api/admin/brands/:id` | Xóa thương hiệu |

---

### Đơn hàng (Orders)

#### `GET /api/admin/orders`
**Query Params:** `page`, `limit`, `status`, `search`

**Response:**
```json
{
  "orders": [
    {
      "_id": "...",
      "customer": { "fullName": "Nguyen Van A", "email": "..." },
      "items": [...],
      "paymentMethod": "COD",
      "totalAmount": 1700000,
      "status": "pending",
      "createdAt": "2026-04-01T..."
    }
  ],
  "total": 45,
  "page": 1
}
```

#### `PUT /api/admin/orders/:id/status`
Cập nhật trạng thái đơn hàng.

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Các giá trị hợp lệ:** `pending` | `confirmed` | `shipping` | `delivered` | `cancelled`

---

### Khách hàng (Customers)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/admin/customers` | Danh sách khách hàng (page, search) |
| GET | `/api/admin/customers/:id` | Chi tiết một khách hàng |

---

### Đánh giá (Reviews)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/admin/reviews` | Danh sách đánh giá |
| DELETE | `/api/admin/reviews/:id` | Xóa đánh giá |

---

### Bài viết (Articles)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/admin/articles` | Danh sách bài viết |
| POST | `/api/admin/articles` | Tạo bài viết |
| PUT | `/api/admin/articles/:id` | Cập nhật bài viết |
| DELETE | `/api/admin/articles/:id` | Xóa bài viết |

---

## 👤 Customer APIs — `/api/customer/*`

> Các endpoint không có ký hiệu 🔒 là public, không cần xác thực.

### Danh mục & Sản phẩm

#### `GET /api/customer/categories`
Danh sách tất cả danh mục.

**Response:**
```json
[
  { "_id": "...", "name": "Action Figure", "slug": "action-figure", "image": "url" }
]
```

#### `GET /api/customer/products/new`
Sản phẩm mới nhất (10 sản phẩm gần đây nhất).

#### `GET /api/customer/products/hot`
Sản phẩm hot (`isHot: true`).

#### `GET /api/customer/products/preorder`
Sản phẩm pre-order (có `releaseDate` trong tương lai).

#### `GET /api/customer/products/category/:categoryId`
Sản phẩm theo danh mục.

**Query Params:**
| Param | Mô tả |
| :--- | :--- |
| `page` | Trang hiện tại |
| `sort` | Sắp xếp: `price_asc`, `price_desc`, `newest` |
| `minPrice` | Giá từ |
| `maxPrice` | Giá đến |

#### `GET /api/customer/products/search/:keyword`
Tìm kiếm sản phẩm theo từ khóa (tìm trong tên, mô tả).

#### `GET /api/customer/products/:id`
Chi tiết sản phẩm.

**Response:**
```json
{
  "_id": "...",
  "name": "Figure Goku Super Saiyan",
  "price": 850000,
  "images": ["url1", "url2"],
  "description": "...",
  "category": { "_id": "...", "name": "Action Figure" },
  "brand": { "_id": "...", "name": "Bandai" },
  "stock": 15,
  "isHot": true,
  "averageRating": 4.5,
  "reviewCount": 23
}
```

---

### Đánh giá sản phẩm

#### `GET /api/customer/products/:id/reviews`
Lấy danh sách đánh giá của sản phẩm.

#### `POST /api/customer/products/:id/reviews` 🔒
Gửi đánh giá (yêu cầu đăng nhập).

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Sản phẩm rất đẹp, đóng gói cẩn thận!"
}
```

---

### Xác thực Khách hàng

#### `POST /api/customer/signup`
Đăng ký tài khoản mới.

**Request Body:**
```json
{
  "fullName": "Nguyen Van A",
  "email": "user@example.com",
  "password": "mypassword123",
  "phone": "0901234567"
}
```

**Response:** `201 Created` + thông báo kiểm tra email.

#### `GET /api/customer/active`
Kích hoạt tài khoản qua email.

**Query Params:** `?id=<customer_id>&token=<otp_token>`

#### `POST /api/customer/login`
Đăng nhập.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**Response:**
```json
{
  "token": "eyJ...",
  "customer": {
    "_id": "...",
    "fullName": "Nguyen Van A",
    "email": "user@example.com",
    "membershipTier": "bronze"
  }
}
```

---

### Đơn hàng Khách hàng

#### `POST /api/customer/orders` 🔒
Tạo đơn hàng mới.

**Request Body:**
```json
{
  "items": [
    { "productId": "...", "quantity": 2, "price": 850000 }
  ],
  "shippingAddress": {
    "fullName": "Nguyen Van A",
    "phone": "0901234567",
    "address": "123 Đường ABC",
    "city": "TP. Hồ Chí Minh"
  },
  "paymentMethod": "COD",
  "totalAmount": 1700000
}
```

#### `GET /api/customer/orders` 🔒
Lịch sử đơn hàng của khách hàng đang đăng nhập.

---

### Bài viết / Blog

#### `GET /api/customer/articles`
Danh sách bài viết (phân trang).

#### `GET /api/customer/articles/:slug`
Chi tiết bài viết theo slug URL.

---

### Thông tin Khách hàng

#### `GET /api/customer/profile` 🔒
Thông tin hồ sơ + hạng thành viên.

**Response:**
```json
{
  "customer": {
    "_id": "...",
    "fullName": "Nguyen Van A",
    "email": "user@example.com",
    "phone": "0901234567"
  },
  "membership": {
    "tier": "silver",
    "totalSpent": 2500000,
    "discountRate": 0.05,
    "nextTier": "gold",
    "remainingForNextTier": 2500000
  }
}
```

#### `PUT /api/customer/profile` 🔒
Cập nhật thông tin cá nhân.

---

## 🖼️ EJS Routes — `/shop/*`

Server-side rendering, trả về HTML trực tiếp.

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/shop` | Trang danh sách sản phẩm |
| GET | `/shop/product/:id` | Trang chi tiết sản phẩm |
| GET | `/shop/cart` | Xem giỏ hàng (session-based) |
| POST | `/shop/cart/add` | Thêm sản phẩm vào giỏ |
| POST | `/shop/cart/remove/:id` | Xóa sản phẩm khỏi giỏ |

---

## ✅ Utility Endpoints

#### `GET /api/health`
Kiểm tra server hoạt động.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-01T12:00:00.000Z",
  "uptime": 3600
}
```

---

## HTTP Status Codes

| Code | Ý nghĩa |
| :--- | :--- |
| `200` | OK — Thành công |
| `201` | Created — Tạo mới thành công |
| `400` | Bad Request — Dữ liệu gửi lên không hợp lệ |
| `401` | Unauthorized — Chưa đăng nhập / Token hết hạn |
| `403` | Forbidden — Không có quyền |
| `404` | Not Found — Không tìm thấy resource |
| `500` | Internal Server Error — Lỗi server |

---

## Error Response Format

```json
{
  "message": "Mô tả lỗi bằng tiếng Việt",
  "error": "Technical error details (chỉ hiện ở dev mode)"
}
```

---

*Điều hướng: [⬆️ Về README](../README.md) · [⬅️ Triển khai](./DEPLOYMENT.md) · [⬅️ Kiến trúc](./ARCHITECTURE.md)*
