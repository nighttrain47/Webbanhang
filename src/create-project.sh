#!/bin/bash

# Script tự động tạo project Anime Shop trên máy local
# Chạy: bash create-project.sh

echo "🚀 Bắt đầu tạo project Anime Shop..."
echo ""

# Tạo thư mục project
PROJECT_NAME="anime-shop"
echo "📁 Tạo thư mục project: $PROJECT_NAME"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Tạo cấu trúc thư mục
echo "📂 Tạo cấu trúc thư mục..."
mkdir -p src/components/admin
mkdir -p src/components/layout
mkdir -p src/components/product
mkdir -p src/components/figma
mkdir -p src/components/ui
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/data
mkdir -p src/styles
mkdir -p public

# Tạo package.json
echo "📦 Tạo package.json..."
cat > package.json << 'EOF'
{
  "name": "anime-shop",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.13.0",
    "lucide-react": "^0.454.0",
    "motion": "^11.15.0",
    "recharts": "^2.15.0",
    "react-slick": "^0.30.2",
    "slick-carousel": "^1.8.1",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/react-slick": "^0.23.13",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.2",
    "vite": "^6.0.1"
  }
}
EOF

# Tạo tsconfig.json
echo "⚙️  Tạo tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
EOF

# Tạo vite.config.ts
echo "⚙️  Tạo vite.config.ts..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF

# Tạo index.html
echo "📄 Tạo index.html..."
cat > index.html << 'EOF'
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
EOF

# Tạo .gitignore
echo "🚫 Tạo .gitignore..."
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF

# Tạo README.md
echo "📝 Tạo README.md..."
cat > README.md << 'EOF'
# 🎌 Anime Shop - Japanese E-commerce Store

Website thương mại điện tử chuyên bán mô hình Anime, CDs và Goods Nhật Bản.

## ✨ Tính năng

### Customer Store
- 🏠 Homepage với Hero Slider & Product Grid
- 📦 Product Detail Page với Bundle Deals
- 🛒 Shopping Cart với Point System
- 💳 Checkout Flow hoàn chỉnh
- 👤 My Account Dashboard
- 📱 Responsive Design

### Admin Dashboard
- 📊 Dashboard Overview với thống kê real-time
- 🎯 Product Management
  - ⭐ Auto-fetch từ AmiAmi (paste link → auto-fill form)
  - CRUD operations đầy đủ
  - Category & Stock management
- 📋 Order Management
- 👥 Customer Management
- 📈 Reports & Analytics

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

## 🔑 Thông tin đăng nhập

**Admin Dashboard:**
- URL: http://localhost:5173/admin
- Username: `admin`
- Password: `admin123`

## 🎨 Thiết kế

- Accent Color: `#FF9900` (Cam)
- Style: Japanese E-commerce
- Language: Tiếng Việt
- Currency: VNĐ

## 📂 Cấu trúc

```
src/
├── components/     # React components
├── pages/         # Page components
├── services/      # API services
├── data/          # Mock data
└── styles/        # CSS styles
```

## 📚 Tài liệu

Xem thêm:
- `DOWNLOAD_GUIDE.md` - Hướng dẫn tải và setup
- `ADMIN_GUIDE.md` - Hướng dẫn sử dụng Admin
- `QUICK_START_GUIDE.md` - Hướng dẫn nhanh

---

**Developed with ❤️ using React + Vite + TypeScript + Tailwind CSS**
EOF

echo ""
echo "✅ Đã tạo xong cấu trúc project!"
echo ""
echo "📋 CÁC BƯỚC TIẾP THEO:"
echo ""
echo "1. Copy tất cả file từ Figma Make vào thư mục tương ứng:"
echo "   - App.tsx → src/App.tsx"
echo "   - components/* → src/components/*"
echo "   - pages/* → src/pages/*"
echo "   - services/* → src/services/*"
echo "   - data/* → src/data/*"
echo "   - styles/* → src/styles/*"
echo ""
echo "2. Tạo file src/main.tsx với nội dung:"
echo "   (Xem trong DOWNLOAD_GUIDE.md)"
echo ""
echo "3. Cài đặt dependencies:"
echo "   cd $PROJECT_NAME"
echo "   npm install"
echo ""
echo "4. Chạy project:"
echo "   npm run dev"
echo ""
echo "🎉 Hoàn tất! Mở http://localhost:5173 để xem kết quả!"
