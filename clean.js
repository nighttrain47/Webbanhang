const fs = require('fs');
const path = require('path');
const dir = 'd:/IT/Workspace/HobbyShop/client-admin/src/components/admin';

fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).forEach(f => {
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  const regex = /<p className="text-sm text-gray-[456]00 mt-1">[^<]*<\/p>\r?\n?/g;
  if (regex.test(c)) {
    fs.writeFileSync(p, c.replace(regex, ''));
    console.log('Removed subtitle in', f);
  }
});
