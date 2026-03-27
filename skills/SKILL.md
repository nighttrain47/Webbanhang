# HOBBYSHOP - UI/UX DESIGN SYSTEM & CODING STANDARDS

## 1. Project Context

- **Name:** HobbyShop
- **Type:** E-commerce website selling anime figures, models, and merch.
- **Vibe:** Modern, dark-theme, sleek, and premium.
- **Role of AI:** Act as a Senior Frontend Developer & UI/UX Expert. Always check code against these rules before generating output.

## 2. Design Tokens (Quy chuẩn Thiết kế)

### Colors (Màu sắc)

- **Primary Color (Brand):** `#ff6600` (Cam - dùng cho nút bấm chính, badge, hover text, CTA).
- **Primary Hover:** `#e65c00` (Cam đậm hơn một chút khi hover).
- **Background Dark:** `#1a1e2b` (Xanh navy rất tối - dùng cho Header, Footer, Hero section).
- **Background Light:** `#ffffff` (Trắng - dùng cho body, product grid).
- **Text Main (Light Bg):** `#333333` (Xám đậm).
- **Text Muted:** `#777777` (Xám nhạt - dùng cho mô tả phụ, placeholder).
- **Text on Dark:** `#ffffff` (Trắng).

### Typography (Font chữ)

- **Font Family:** Sử dụng các font sans-serif hiện đại (Inter, Roboto, hoặc hệ thống mặc định của trình duyệt).
- **Headings (h1, h2, h3):** Font-weight: `bold` (700).
- **Body Text:** Font-weight: `normal` (400), size: `14px` hoặc `16px`.

### Spacing & Grid (Khoảng cách)

- Sử dụng hệ thống spacing bội số của 4 (4px, 8px, 12px, 16px, 24px, 32px...).
- **Container max-width:** Thường là `1200px` hoặc `1440px` với padding hai bên `20px` trên mobile.
- **Gap:** Sử dụng `gap: 16px` hoặc `24px` cho các flex/grid container.

## 3. Component Guidelines (Quy chuẩn Thành phần)

### Buttons (Nút bấm)

- **Primary Button (CTA):** Background `#ff6600`, text màu trắng, không viền. `border-radius: 4px` (hoặc `25px` nếu là dạng pill-shape như form đăng ký).
- Có hiệu ứng `transition: all 0.3s ease;` khi hover (đổi màu nền hoặc transform nhẹ).
- KHÔNG BAO GIỜ để text dính sát vào viền nút. Phải có padding hợp lý (vd: `padding: 10px 24px;`).

### Product Cards (Thẻ sản phẩm)

- **Images:** Mọi ảnh thẻ sản phẩm PHẢI có `aspect-ratio: 1/1` (vuông) và `object-fit: cover` để tránh méo ảnh. Phải có ảnh fallback (placeholder) nếu link ảnh bị lỗi.
- **Hover State:** Thẻ sản phẩm nên có hiệu ứng `box-shadow` nhẹ khi hover. Nút "Thêm vào giỏ" nên hiển thị mượt mà khi hover.

### Forms & Inputs

- **Inputs:** `border: 1px solid #ddd`, `border-radius: 4px`, `padding: 10px 16px`. `outline: none`. Khi focus đổi màu viền sang `#ff6600`.

### Icons & Badges

- **Icons:** Ưu tiên dùng SVG (Inline hoặc qua thư viện). Đồng nhất kích thước (ví dụ 24x24px).
- **Badges (Số lượng giỏ hàng):** Phải dùng `position: absolute` để gắn vào góc trên bên phải của icon cha. Nền `#ff6600`, chữ trắng, bo tròn `50%`.

## 4. UI/UX & Accessibility Rules (Bắt buộc)

- **Không bao giờ đè phần tử:** Luôn kiểm tra z-index và flow của layout để đảm bảo text không đè lên icon, nút không lọt ra ngoài box.
- **Responsive:** Mọi component tạo ra phải hoạt động tốt trên Mobile (max-width: 768px). Dùng Flexbox/CSS Grid.
- **Semantic HTML:** Sử dụng đúng thẻ (`<button>` cho hành động, `<a>` cho chuyển trang, `<nav>` cho điều hướng). Không dùng `<div>` bừa bãi khi có thẻ semantic phù hợp.
