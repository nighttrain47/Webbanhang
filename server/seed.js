require('dotenv').config();
// Workaround for Node.js v24+ OpenSSL compatibility with MongoDB Atlas
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ProductDAO = require('./models/ProductDAO');
const CategoryDAO = require('./models/CategoryDAO');
const CustomerDAO = require('./models/CustomerDAO');
const ArticleDAO = require('./models/ArticleDAO');
const connectDB = require('./utils/db');

async function seed() {
  await connectDB();
  console.log('🌱 Bắt đầu seed database...\n');

  // ============ CATEGORIES ============
  console.log('📁 Tạo danh mục...');
  const categoryData = [
    { name: 'Scale Figure', slug: 'scale-figure', description: 'Figure tỷ lệ 1/4, 1/7, 1/8 từ các nhà sản xuất hàng đầu', image: 'https://images.unsplash.com/photo-1608889175638-9322300c46e8?w=400' },
    { name: 'Nendoroid', slug: 'nendoroid', description: 'Figure chibi dễ thương dòng Nendoroid của Good Smile Company', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400' },
    { name: 'Figma', slug: 'figma', description: 'Figure khớp nối cao cấp có thể tạo dáng linh hoạt', image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400' },
    { name: 'Gundam & Mecha', slug: 'gundam-mecha', description: 'Mô hình Gunpla, Mecha từ Bandai và các hãng khác', image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400' },
    { name: 'CD & Soundtrack', slug: 'cd-soundtrack', description: 'Album nhạc anime, J-Pop, OST chính hãng', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400' },
    { name: 'Manga & Art Book', slug: 'manga-artbook', description: 'Manga bản tiếng Nhật, art book, illustration book', image: 'https://images.unsplash.com/photo-1614107151491-6876eecbff89?w=400' },
    { name: 'Goods & Merchandise', slug: 'goods-merchandise', description: 'Ốp điện thoại, poster, móc khóa, balo, áo anime', image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400' },
    { name: 'Pre-order', slug: 'pre-order', description: 'Sản phẩm đặt trước — đảm bảo bạn không bỏ lỡ!', image: 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400' },
  ];

  // Clear existing
  await mongoose.connection.collection('categories').deleteMany({});
  const categories = [];
  for (const cat of categoryData) {
    const created = await CategoryDAO.insert(cat);
    categories.push(created);
    console.log(`  ✅ ${cat.name}`);
  }

  // ============ PRODUCTS ============
  console.log('\n📦 Tạo sản phẩm...');
  await mongoose.connection.collection('products').deleteMany({});

  const products = [
    // Scale Figures
    {
      name: 'Rem: Crystal Dress Ver. 1/7 Scale',
      series: 'Re:Zero − Starting Life in Another World',
      manufacturer: 'Good Smile Company',
      category: categories[0]._id,
      price: 4500000,
      stock: 15,
      sold: 42,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20210323/11001/79907/large/a0a4eb9f7dd7ea5f51c73b78cf920e5d.jpg',
      sku: 'GSC-REM-CD-17',
      rating: 4.9,
      description: '<p>Figure Rem trong bộ váy pha lê tuyệt đẹp, tỷ lệ 1/7. Được điêu khắc tỉ mỉ với chất liệu PVC cao cấp, sơn màu rực rỡ.</p><p>Kích thước: khoảng 230mm. Đế trong suốt kèm theo.</p>',
      specs: { material: 'PVC, ABS', size: '230mm', sculptor: 'Miyuki (Knead)', releaseDate: '2026-06' },
      tags: ['re:zero', 'rem', 'scale', 'crystal dress', 'waifu']
    },
    {
      name: 'Miku Hatsune: 16th Anniversary Ver. 1/7',
      series: 'Vocaloid',
      manufacturer: 'Good Smile Company',
      category: categories[0]._id,
      price: 3800000,
      stock: 20,
      sold: 67,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20230616/14256/110019/large/f9f5e3eb119be37efed8e01b2e63c068.jpg',
      sku: 'GSC-MIKU-16TH',
      rating: 4.8,
      description: '<p>Hatsune Miku phiên bản kỷ niệm 16 năm, tỷ lệ 1/7. Thiết kế mới mẻ với trang phục futuristic đặc trưng.</p>',
      specs: { material: 'PVC, ABS', size: '240mm', sculptor: 'GSC Team', releaseDate: '2026-03' },
      tags: ['vocaloid', 'miku', 'scale', 'anniversary']
    },
    {
      name: 'Yor Forger: Thorn Princess 1/7',
      series: 'SPY×FAMILY',
      manufacturer: 'Kotobukiya',
      category: categories[0]._id,
      price: 3200000,
      stock: 8,
      sold: 55,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20220927/13115/98696/large/4f66aba7823bc50fe7f23a24cb0bb53e.jpg',
      sku: 'KOTO-YOR-TP',
      rating: 4.7,
      description: '<p>Yor Forger trong trang phục Thorn Princess đầy bí ẩn và quyến rũ. Figure tỷ lệ 1/7 với đế riêng.</p>',
      specs: { material: 'PVC', size: '250mm', sculptor: 'Kotobukiya Team', releaseDate: '2025-12' },
      tags: ['spy family', 'yor', 'scale', 'thorn princess']
    },
    {
      name: 'Zero Two: Para-suit Ver. 1/4',
      series: 'DARLING in the FRANXX',
      manufacturer: 'FREEing',
      category: categories[0]._id,
      price: 8500000,
      stock: 5,
      sold: 23,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20200917/9888/72426/large/09c8a8b52eab2cf00e3eabb70ca2a0b7.jpg',
      sku: 'FREE-02-PS',
      rating: 5.0,
      description: '<p>Zero Two tỷ lệ 1/4 — figure cỡ lớn cực kỳ chi tiết từ FREEing. Trang phục Para-suit iconic.</p>',
      specs: { material: 'PVC, ABS', size: '430mm', sculptor: 'FREEing Team', releaseDate: '2025-10' },
      tags: ['darling in the franxx', 'zero two', '1/4', 'bunny']
    },

    // Nendoroid
    {
      name: 'Nendoroid Nezuko Kamado',
      series: 'Demon Slayer: Kimetsu no Yaiba',
      manufacturer: 'Good Smile Company',
      category: categories[1]._id,
      price: 1200000,
      stock: 30,
      sold: 120,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20191122/9107/66290/large/c1ab4c05f2a8f6bd23fca9d2f5f25e74.jpg',
      sku: 'NEND-NEZUKO',
      rating: 4.9,
      description: '<p>Nendoroid Nezuko dễ thương với phụ kiện tre trong miệng. Có thể thay đổi biểu cảm và tạo dáng.</p>',
      specs: { material: 'PVC, ABS', size: '100mm', sculptor: 'Shichibee', releaseDate: '2025-08' },
      tags: ['demon slayer', 'nezuko', 'nendoroid', 'chibi']
    },
    {
      name: 'Nendoroid Gojo Satoru',
      series: 'Jujutsu Kaisen',
      manufacturer: 'Good Smile Company',
      category: categories[1]._id,
      price: 1350000,
      stock: 25,
      sold: 95,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20210624/11353/84008/large/1fa2c7f87dfb8a808bb79b1b254d7277.jpg',
      sku: 'NEND-GOJO',
      rating: 4.8,
      description: '<p>Nendoroid Gojo Satoru siêu ngầu! Đi kèm phụ kiện bịt mắt, tay thay thế và hiệu ứng kỹ năng Domain Expansion.</p>',
      specs: { material: 'PVC, ABS', size: '100mm', sculptor: 'Momo (Shinkikaku)', releaseDate: '2025-09' },
      tags: ['jujutsu kaisen', 'gojo', 'nendoroid']
    },
    {
      name: 'Nendoroid Anya Forger',
      series: 'SPY×FAMILY',
      manufacturer: 'Good Smile Company',
      category: categories[1]._id,
      price: 1150000,
      stock: 35,
      sold: 150,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20220622/12752/95460/large/b30aff85d8f8f3b13c0e120b939e3810.jpg',
      sku: 'NEND-ANYA',
      rating: 5.0,
      description: '<p>Nendoroid Anya "Waku Waku!" — đi kèm nhiều biểu cảm hài hước và phụ kiện đậu phộng.</p>',
      specs: { material: 'PVC, ABS', size: '100mm', sculptor: 'Shichibee', releaseDate: '2025-07' },
      tags: ['spy family', 'anya', 'nendoroid', 'waku waku']
    },

    // Figma
    {
      name: 'figma Levi Ackerman',
      series: 'Attack on Titan',
      manufacturer: 'Max Factory',
      category: categories[2]._id,
      price: 1800000,
      stock: 18,
      sold: 72,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20200930/9990/73299/large/0b6b57e84f8fabb94b2a69e18baa2e71.jpg',
      sku: 'FIG-LEVI',
      rating: 4.7,
      description: '<p>figma Levi — đi kèm ODM Gear, kiếm đôi, và nhiều tay thay thế. Khớp nối linh hoạt cho mọi pose chiến đấu.</p>',
      specs: { material: 'PVC, ABS', size: '140mm', sculptor: 'Max Factory', releaseDate: '2025-11' },
      tags: ['attack on titan', 'levi', 'figma', 'action']
    },
    {
      name: 'figma Saber/Altria Pendragon',
      series: 'Fate/stay night',
      manufacturer: 'Max Factory',
      category: categories[2]._id,
      price: 1650000,
      stock: 12,
      sold: 88,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20141111/4711/32181/large/4c06e70b9c8ed4483edd7cba5ca5c24a.jpg',
      sku: 'FIG-SABER',
      rating: 4.6,
      description: '<p>figma Saber classic — Excalibur và Invisible Air đi kèm. Armor có thể tháo rời.</p>',
      specs: { material: 'PVC, ABS', size: '140mm', sculptor: 'Max Factory', releaseDate: '2025-06' },
      tags: ['fate', 'saber', 'figma', 'artoria']
    },

    // Gundam
    {
      name: 'MG 1/100 Freedom Gundam Ver. 2.0',
      series: 'Gundam SEED',
      manufacturer: 'Bandai',
      category: categories[3]._id,
      price: 1400000,
      stock: 40,
      sold: 200,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400',
      sku: 'MG-FREEDOM-20',
      rating: 4.9,
      description: '<p>Master Grade Freedom Gundam phiên bản 2.0 với khung nội hoàn toàn mới. Cánh METEOR có thể mở ra.</p>',
      specs: { material: 'PS, PE, ABS', size: '180mm', sculptor: 'Bandai', releaseDate: '2025-05' },
      tags: ['gundam', 'seed', 'master grade', 'freedom']
    },
    {
      name: 'RG 1/144 Wing Gundam Zero EW',
      series: 'Gundam Wing: Endless Waltz',
      manufacturer: 'Bandai',
      category: categories[3]._id,
      price: 850000,
      stock: 50,
      sold: 180,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400',
      sku: 'RG-WING-ZERO',
      rating: 4.8,
      description: '<p>Real Grade Wing Zero — cánh angel wing chi tiết đáng kinh ngạc ở tỷ lệ 1/144.</p>',
      specs: { material: 'PS, PE', size: '130mm', sculptor: 'Bandai', releaseDate: '2025-03' },
      tags: ['gundam', 'wing', 'real grade', 'zero']
    },

    // CD & Soundtrack
    {
      name: 'YOASOBI "THE BOOK 3" Album',
      series: 'YOASOBI',
      manufacturer: 'Sony Music',
      category: categories[4]._id,
      price: 680000,
      stock: 60,
      sold: 300,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      sku: 'CD-YOASOBI-TB3',
      rating: 4.9,
      description: '<p>Album "THE BOOK 3" của YOASOBI bao gồm hit "Idol" (Oshi no Ko OP) và nhiều bài mới. Bản giới hạn kèm photobook.</p>',
      specs: { material: 'CD + Booklet', size: 'Standard', sculptor: 'N/A', releaseDate: '2025-12' },
      tags: ['yoasobi', 'jpop', 'idol', 'oshi no ko', 'album']
    },
    {
      name: 'Attack on Titan: Final Season OST',
      series: 'Attack on Titan',
      manufacturer: 'Pony Canyon',
      category: categories[4]._id,
      price: 520000,
      stock: 25,
      sold: 85,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      sku: 'CD-AOT-FINAL',
      rating: 4.7,
      description: '<p>OST chính thức của Attack on Titan Final Season. Bao gồm "Ashes on The Fire", "Under the Tree" của SiM.</p>',
      specs: { material: '2CD Set', size: 'Standard', sculptor: 'N/A', releaseDate: '2025-08' },
      tags: ['attack on titan', 'ost', 'soundtrack', 'hiroyuki sawano']
    },
    {
      name: 'Jujutsu Kaisen Season 2 OST',
      series: 'Jujutsu Kaisen',
      manufacturer: 'Avex',
      category: categories[4]._id,
      price: 480000,
      stock: 30,
      sold: 60,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      sku: 'CD-JJK-S2',
      rating: 4.6,
      description: '<p>OST Jujutsu Kaisen Season 2 — Shibuya Incident Arc. Nhạc phim đầy kịch tính.</p>',
      specs: { material: 'CD', size: 'Standard', sculptor: 'N/A', releaseDate: '2025-10' },
      tags: ['jujutsu kaisen', 'ost', 'soundtrack']
    },

    // Manga & Art Book
    {
      name: 'ONE PIECE Art Book - Color Walk 10',
      series: 'ONE PIECE',
      manufacturer: 'Shueisha',
      category: categories[5]._id,
      price: 750000,
      stock: 20,
      sold: 45,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1614107151491-6876eecbff89?w=400',
      sku: 'BOOK-OP-CW10',
      rating: 4.8,
      description: '<p>Art book chính thức của Eiichiro Oda — tuyển tập minh họa màu One Piece từ arc Wano đến Final Saga.</p>',
      specs: { material: 'Hardcover, 192 pages', size: 'A4', sculptor: 'N/A', releaseDate: '2025-07' },
      tags: ['one piece', 'art book', 'oda', 'color walk']
    },
    {
      name: 'Chainsaw Man Manga Vol. 1-16 Box Set',
      series: 'Chainsaw Man',
      manufacturer: 'Shueisha',
      category: categories[5]._id,
      price: 1600000,
      stock: 15,
      sold: 70,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1614107151491-6876eecbff89?w=400',
      sku: 'MANGA-CSM-SET',
      rating: 4.9,
      description: '<p>Box set manga Chainsaw Man tập 1-16 tiếng Nhật. Bao gồm box bìa cứng collector edition.</p>',
      specs: { material: 'Paperback manga', size: 'B6', sculptor: 'N/A', releaseDate: '2025-09' },
      tags: ['chainsaw man', 'manga', 'box set', 'fujimoto']
    },

    // Goods
    {
      name: 'Jujutsu Kaisen Acrylic Stand Set (5 pcs)',
      series: 'Jujutsu Kaisen',
      manufacturer: 'Movic',
      category: categories[6]._id,
      price: 350000,
      stock: 80,
      sold: 250,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
      sku: 'GOODS-JJK-AS5',
      rating: 4.5,
      description: '<p>Set 5 acrylic stand nhân vật chính Jujutsu Kaisen: Yuji, Megumi, Nobara, Gojo, Sukuna. Cao khoảng 150mm.</p>',
      specs: { material: 'Acrylic', size: '150mm each', sculptor: 'N/A', releaseDate: '2025-06' },
      tags: ['jujutsu kaisen', 'acrylic stand', 'goods', 'set']
    },
    {
      name: 'Demon Slayer Premium Tote Bag',
      series: 'Demon Slayer: Kimetsu no Yaiba',
      manufacturer: 'Bandai',
      category: categories[6]._id,
      price: 280000,
      stock: 100,
      sold: 180,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
      sku: 'GOODS-DS-BAG',
      rating: 4.4,
      description: '<p>Tote bag cao cấp Demon Slayer — in hình Tanjirou, Nezuko và hiệu ứng hoa văn truyền thống Nhật Bản.</p>',
      specs: { material: 'Canvas', size: '40x35cm', sculptor: 'N/A', releaseDate: '2025-04' },
      tags: ['demon slayer', 'tote bag', 'goods']
    },
    {
      name: 'SPY×FAMILY Keychain Collection (6 pcs)',
      series: 'SPY×FAMILY',
      manufacturer: 'Banpresto',
      category: categories[6]._id,
      price: 220000,
      stock: 120,
      sold: 300,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
      sku: 'GOODS-SPY-KC6',
      rating: 4.6,
      description: '<p>Bộ 6 móc khóa SPY×FAMILY cực cute — Anya, Yor, Loid, Bond, Becky, Damian.</p>',
      specs: { material: 'Metal, Enamel', size: '40mm', sculptor: 'N/A', releaseDate: '2025-05' },
      tags: ['spy family', 'keychain', 'goods', 'collection']
    },

    // Pre-order
    {
      name: '[PRE-ORDER] Frieren: Beyond Journey\'s End 1/7',
      series: 'Sousou no Frieren',
      manufacturer: 'Alter',
      category: categories[7]._id,
      price: 5200000,
      stock: 30,
      sold: 0,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20230616/14256/110019/large/f9f5e3eb119be37efed8e01b2e63c068.jpg',
      sku: 'PO-FRIEREN-17',
      rating: 0,
      description: '<p>Figure Frieren 1/7 scale từ Alter — phiên bản giới hạn. Tái hiện Frieren với cây gậy phép và hiệu ứng ma thuật tinh xảo.</p><p><strong>Hạn đặt trước:</strong> 30/04/2026</p><p><strong>Dự kiến giao:</strong> Q4 2026</p>',
      preorderDeadline: '2026-04-30',
      estimatedDelivery: 'Q4 2026',
      maxPerOrder: 2,
      specs: { material: 'PVC, ABS', size: '260mm', sculptor: 'Alter Team', releaseDate: '2026-10' },
      tags: ['frieren', 'pre-order', 'alter', 'scale', 'limited']
    },
    {
      name: '[PRE-ORDER] Nendoroid Denji',
      series: 'Chainsaw Man',
      manufacturer: 'Good Smile Company',
      category: categories[7]._id,
      price: 1250000,
      stock: 50,
      sold: 0,
      status: 'active',
      image: 'https://images.goodsmile.info/cgm/images/product/20220927/13115/98696/large/4f66aba7823bc50fe7f23a24cb0bb53e.jpg',
      sku: 'PO-NEND-DENJI',
      rating: 0,
      description: '<p>Nendoroid Denji — đi kèm phụ kiện cưa xích, biểu cảm chiến đấu và biểu cảm "becomes Chainsaw Man". Có thể đổi head Chainsaw Man.</p><p><strong>Hạn đặt trước:</strong> 15/05/2026</p>',
      preorderDeadline: '2026-05-15',
      estimatedDelivery: 'Q1 2027',
      maxPerOrder: 3,
      specs: { material: 'PVC, ABS', size: '100mm', sculptor: 'Shichibee', releaseDate: '2027-01' },
      tags: ['chainsaw man', 'denji', 'nendoroid', 'pre-order']
    },
  ];

  for (const prod of products) {
    await ProductDAO.insert(prod);
    console.log(`  ✅ ${prod.name}`);
  }

  // ============ CUSTOMERS ============
  console.log('\n👤 Tạo tài khoản test...');
  await mongoose.connection.collection('customers').deleteMany({});

  const testUsers = [
    {
      username: 'testuser',
      password: 'Test1234',
      name: 'Nguyễn Văn Test',
      email: 'test@hobbyshop.vn',
      phone: '0901234567',
      active: 1,
      token: ''
    },
    {
      username: 'otaku',
      password: 'Otaku2026',
      name: 'Trần Thị Otaku',
      email: 'otaku@hobbyshop.vn',
      phone: '0912345678',
      active: 1,
      token: ''
    }
  ];

  for (const user of testUsers) {
    await CustomerDAO.insert(user);
    console.log(`  ✅ ${user.username} / ${user.password} (${user.name})`);
  }

  // ============ ARTICLES ============
  console.log('\n📝 Tạo bài viết blog...');
  await mongoose.connection.collection('articles').deleteMany({});

  const articles = [
    {
      title: 'Top 10 Figure Anime Đáng Mua Nhất 2026',
      slug: 'top-10-figure-anime-2026',
      author: 'HobbyShop Team',
      content: `<h2>Danh sách figure không thể bỏ qua!</h2>
<p>Năm 2026 hứa hẹn là năm bùng nổ của các figure anime chất lượng cao. Từ những tác phẩm scale figure đầy nghệ thuật đến những Nendoroid xinh xắn, đây là top 10 figure mà mọi collector nên cân nhắc.</p>
<h3>1. Rem: Crystal Dress Ver. 1/7</h3>
<p>Good Smile Company mang đến phiên bản Rem tuyệt đẹp nhất từ trước đến giờ. Dress crystal trong suốt, paint job tinh xảo.</p>
<h3>2. Frieren 1/7 by Alter</h3>
<p>Figure Frieren đầu tiên từ Alter — hãng nổi tiếng về chất lượng sơn và chi tiết. Không thể bỏ lỡ!</p>
<h3>3. Zero Two 1/4 by FREEing</h3>
<p>Figure cỡ lớn của Zero Two trong Para-suit. Đây là phiên bản definitive cho fan Darling in the Franxx.</p>
<p><em>Xem thêm tại HobbyShop — nơi quy tụ figure chính hãng từ Nhật Bản!</em></p>`,
      image: 'https://images.unsplash.com/photo-1608889175638-9322300c46e8?w=800',
      published: true
    },
    {
      title: 'Hướng Dẫn Bảo Quản Figure Đúng Cách',
      slug: 'huong-dan-bao-quan-figure',
      author: 'HobbyShop Team',
      content: `<h2>Giữ cho figure của bạn luôn như mới!</h2>
<p>Figure anime là khoản đầu tư không nhỏ, vì vậy bảo quản đúng cách là điều vô cùng quan trọng.</p>
<h3>1. Tránh ánh nắng trực tiếp</h3>
<p>UV sẽ làm phai màu sơn và biến dạng PVC theo thời gian. Đặt figure trong tủ kính hoặc nơi ít ánh sáng.</p>
<h3>2. Kiểm soát nhiệt độ</h3>
<p>Nhiệt độ lý tưởng là 20-25°C. Tránh để figure gần nguồn nhiệt hoặc trong ô tô.</p>
<h3>3. Vệ sinh định kỳ</h3>
<p>Dùng cọ mềm hoặc khí nén để làm sạch bụi mỗi 2-4 tuần. Không dùng nước nóng hoặc hóa chất mạnh.</p>
<h3>4. Sử dụng tủ Detolf</h3>
<p>Tủ kính IKEA Detolf là lựa chọn phổ biến nhất cho collector figure. Giúp bảo vệ khỏi bụi và tạo không gian trưng bày đẹp.</p>
<p><strong>Bonus tip:</strong> Lót silica gel trong tủ để hút ẩm, đặc biệt ở khu vực có độ ẩm cao.</p>`,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
      published: true
    },
    {
      title: 'Gunpla Cho Người Mới — Bắt Đầu Từ Đâu?',
      slug: 'gunpla-cho-nguoi-moi',
      author: 'HobbyShop Team',
      content: `<h2>Thế giới Gunpla không khó như bạn nghĩ!</h2>
<p>Gunpla (Gundam Plastic Model) là thú vui lắp ráp mô hình Gundam từ Bandai. Nếu bạn chưa bao giờ thử, đây là hướng dẫn cơ bản.</p>
<h3>Các grade phổ biến</h3>
<ul>
<li><strong>HG (High Grade)</strong> 1/144 — Dễ nhất, phù hợp người mới. Giá tốt.</li>
<li><strong>RG (Real Grade)</strong> 1/144 — Chi tiết hơn HG, nhưng kích thước tương tự.</li>
<li><strong>MG (Master Grade)</strong> 1/100 — Cỡ lớn, chi tiết cao, có khung nội.</li>
<li><strong>PG (Perfect Grade)</strong> 1/60 — Cao cấp nhất, kích thước lớn.</li>
</ul>
<h3>Công cụ cần thiết</h3>
<p>Chỉ cần kìm cắt runner (nipper) và giấy nhám 400-800. Nâng cao hơn thì thêm bút panel line và top coat.</p>
<p><em>Khám phá collection Gundam của HobbyShop ngay hôm nay!</em></p>`,
      image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=800',
      published: true
    },
  ];

  for (const article of articles) {
    await ArticleDAO.insert(article);
    console.log(`  ✅ ${article.title}`);
  }

  // ============ DONE ============
  console.log('\n✨ Seed hoàn tất!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  📁 ${categories.length} danh mục`);
  console.log(`  📦 ${products.length} sản phẩm`);
  console.log(`  👤 ${testUsers.length} tài khoản test`);
  console.log(`  📝 ${articles.length} bài viết`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📌 Tài khoản test:');
  console.log('  • testuser / Test1234');
  console.log('  • otaku / Otaku2026');
  console.log('\n📌 Admin:');
  console.log('  • admin / admin123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
