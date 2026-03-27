const fs = require('fs');
const path = require('path');

const files = [
  'client-customer/src/components/layout/Sidebar.tsx',
  'client-customer/src/components/product/ReviewSection.tsx',
  'client-customer/src/components/Checkout.tsx',
  'client-customer/src/components/Login.tsx',
  'client-customer/src/components/MyAccount.tsx',
  'client-customer/src/pages/ArticleDetailPage.tsx',
  'client-customer/src/pages/BlogPage.tsx',
  'client-customer/src/pages/CategoryPage.tsx',
  'client-customer/src/pages/HomePage.tsx',
  'client-customer/src/pages/ProductDetailPage.tsx',
  'client-customer/src/pages/SearchPage.tsx',
  'client-admin/src/components/admin/ArticleManagement.tsx',
  'client-admin/src/components/admin/CategoryManagement.tsx',
  'client-admin/src/components/admin/ProductManagement.tsx',
  'client-admin/src/components/admin/ReviewManagement.tsx',
];

const base = 'd:/IT/Workspace/HobbyShop';

files.forEach(f => {
  const fp = path.join(base, f);
  let content = fs.readFileSync(fp, 'utf8');

  // Fix: replace 'http://localhost:5000...' or '${API_URL}...' with `${API_URL}...`
  // Pattern 1: still has http://localhost:5000
  content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, (m, rest) => {
    return '`${API_URL}' + rest + '`';
  });
  // Pattern 2: already replaced but with single quotes
  content = content.replace(/'\$\{API_URL\}([^']*)'/g, (m, rest) => {
    return '`${API_URL}' + rest + '`';
  });

  // Add import if not present
  if (!content.includes("import { API_URL }")) {
    const isAdmin = f.includes('client-admin');
    // Calculate relative path
    const srcDir = f.includes('client-admin') ? 'client-admin/src/' : 'client-customer/src/';
    const relFromSrc = f.replace(/.*src\//, '');
    const depth = relFromSrc.split('/').length - 1;
    const rel = '../'.repeat(depth);
    const importLine = `import { API_URL } from '${rel}config';\n`;

    // Insert after the first import block
    const firstImportIdx = content.indexOf('import ');
    if (firstImportIdx !== -1) {
      // Find end of first import statement
      const endOfFirstImport = content.indexOf('\n', firstImportIdx);
      content = content.slice(0, endOfFirstImport + 1) + importLine + content.slice(endOfFirstImport + 1);
    }
  }

  fs.writeFileSync(fp, content, 'utf8');
  console.log('Done:', path.basename(f));
});

console.log('All files processed!');
