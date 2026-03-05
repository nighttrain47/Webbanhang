@echo off
REM Script tự động tạo project Anime Shop trên Windows
REM Chạy: create-project.bat

echo ================================================
echo    ANIME SHOP - Project Setup for Windows
echo ================================================
echo.

set PROJECT_NAME=anime-shop

echo [1/8] Tao thu muc project...
mkdir %PROJECT_NAME%
cd %PROJECT_NAME%

echo [2/8] Tao cau truc thu muc...
mkdir src\components\admin
mkdir src\components\layout
mkdir src\components\product
mkdir src\components\figma
mkdir src\components\ui
mkdir src\pages
mkdir src\services
mkdir src\data
mkdir src\styles
mkdir public

echo [3/8] Tao package.json...
(
echo {
echo   "name": "anime-shop",
echo   "private": true,
echo   "version": "1.0.0",
echo   "type": "module",
echo   "scripts": {
echo     "dev": "vite",
echo     "build": "tsc && vite build",
echo     "preview": "vite preview"
echo   },
echo   "dependencies": {
echo     "react": "^18.3.1",
echo     "react-dom": "^18.3.1",
echo     "react-router": "^7.13.0",
echo     "lucide-react": "^0.454.0",
echo     "motion": "^11.15.0",
echo     "recharts": "^2.15.0",
echo     "react-slick": "^0.30.2",
echo     "slick-carousel": "^1.8.1",
echo     "sonner": "^2.0.3"
echo   },
echo   "devDependencies": {
echo     "@types/react": "^18.3.12",
echo     "@types/react-dom": "^18.3.1",
echo     "@types/react-slick": "^0.23.13",
echo     "@vitejs/plugin-react": "^4.3.4",
echo     "autoprefixer": "^10.4.20",
echo     "postcss": "^8.4.49",
echo     "tailwindcss": "^4.0.0",
echo     "typescript": "^5.6.2",
echo     "vite": "^6.0.1"
echo   }
echo }
) > package.json

echo [4/8] Tao tsconfig.json...
(
echo {
echo   "compilerOptions": {
echo     "target": "ES2020",
echo     "useDefineForClassFields": true,
echo     "lib": ["ES2020", "DOM", "DOM.Iterable"],
echo     "module": "ESNext",
echo     "skipLibCheck": true,
echo     "moduleResolution": "bundler",
echo     "allowImportingTsExtensions": true,
echo     "isolatedModules": true,
echo     "moduleDetection": "force",
echo     "noEmit": true,
echo     "jsx": "react-jsx",
echo     "strict": true,
echo     "noUnusedLocals": true,
echo     "noUnusedParameters": true,
echo     "noFallthroughCasesInSwitch": true
echo   },
echo   "include": ["src"]
echo }
) > tsconfig.json

echo [5/8] Tao vite.config.ts...
(
echo import { defineConfig } from 'vite'
echo import react from '@vitejs/plugin-react'
echo.
echo export default defineConfig^(^{
echo   plugins: [react^(^)],
echo }^)
) > vite.config.ts

echo [6/8] Tao index.html...
(
echo ^<!doctype html^>
echo ^<html lang="vi"^>
echo   ^<head^>
echo     ^<meta charset="UTF-8" /^>
echo     ^<link rel="icon" type="image/svg+xml" href="/vite.svg" /^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0" /^>
echo     ^<title^>Anime Shop - Mo hinh Figure ^& Goods Nhat Ban^</title^>
echo   ^</head^>
echo   ^<body^>
echo     ^<div id="root"^>^</div^>
echo     ^<script type="module" src="/src/main.tsx"^>^</script^>
echo   ^</body^>
echo ^</html^>
) > index.html

echo [7/8] Tao .gitignore...
(
echo node_modules
echo dist
echo dist-ssr
echo *.local
echo .DS_Store
) > .gitignore

echo [8/8] Tao README.md...
(
echo # Anime Shop - Japanese E-commerce Store
echo.
echo Website thuong mai dien tu chuyen ban mo hinh Anime, CDs va Goods Nhat Ban.
echo.
echo ## Cai dat
echo.
echo npm install
echo npm run dev
echo.
echo ## Dang nhap Admin
echo.
echo - URL: http://localhost:5173/admin
echo - Username: admin
echo - Password: admin123
) > README.md

echo.
echo ================================================
echo    DA TAO XONG CAU TRUC PROJECT!
echo ================================================
echo.
echo CAC BUOC TIEP THEO:
echo.
echo 1. Copy tat ca file tu Figma Make vao thu muc tuong ung
echo 2. Cai dat dependencies: npm install
echo 3. Chay project: npm run dev
echo 4. Mo trinh duyet: http://localhost:5173
echo.
echo XEM CHI TIET: Doc file DOWNLOAD_GUIDE.md
echo.
echo Chuc ban thanh cong!
echo ================================================
pause
