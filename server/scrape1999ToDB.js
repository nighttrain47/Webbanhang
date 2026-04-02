const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config();

const ITEM_COUNT_PER_CATEGORY = 5;

const categorySearchMap = {
  'Scale Figure': '1/7 scale figure',
  'Nendoroid': 'nendoroid',
  'Figma': 'figma',
  'Gundam & Mecha': 'gundam',
  'CD & Soundtrack': 'anime soundtrack cd',
  'Manga & Art Book': 'art book',
  'Goods & Merchandise': 'acrylic stand'
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  const db = mongoose.connection.db;

  const categories = await db.collection('categories').find({}).toArray();
  const productsCol = db.collection('products');

  for (const category of categories) {
    if (category.name === 'Pre-order') continue; // Bỏ qua Pre-order như user yêu cầu

    const keyword = categorySearchMap[category.name];
    if (!keyword) {
      console.log(`Skipping category ${category.name} - no mapping`);
      continue;
    }

    console.log(`Fetching ${ITEM_COUNT_PER_CATEGORY} items for ${category.name} using keyword "${keyword}"...`);
    const encodedKeyword = encodeURIComponent(keyword);
    // sold=0 means only in-stock items
    const url = `https://www.1999.co.jp/eng/search?searchkey=${encodedKeyword}&sold=0`;
    
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const $ = cheerio.load(data);
      const items = [];

      $('[class*="c-card"]').each((i, el) => {
        const title = $(el).find('.c-card__title').text().trim() || $(el).find('[class*="title"]').text().trim();
        const imgPath = $(el).find('img').attr('src');
        let priceText = $(el).find('.c-card__price, .c-card__price-sale, [class*="price"]').text().replace(/\s+/g, ' ').trim();
        if (!priceText) {
            priceText = $(el).text().replace(/\s+/g, ' ');
        }
        
        let jpyPrice = 5000; // default fallback
        const match = priceText.match(/([\d,]+)\s+JPY/i);
        if (match) {
          jpyPrice = parseInt(match[1].replace(/,/g, ''), 10);
        }

        if (title && imgPath && items.length < ITEM_COUNT_PER_CATEGORY) {
          items.push({
            title,
            img: imgPath.startsWith('http') ? imgPath : 'https://www.1999.co.jp' + imgPath,
            jpyPrice
          });
        }
      });

      console.log(`Found ${items.length} items for ${category.name}`);

      for (const item of items) {
        // Áp dụng công thức
        const originalPrice = item.jpyPrice * 170;
        const price = originalPrice + 300000;

        const newProduct = {
          name: item.title,
          series: category.name,
          manufacturer: 'HobbySearch Import',
          category: category._id,
          originalPrice: originalPrice,
          price: price,
          stock: Math.floor(Math.random() * 20) + 1, // Random stock between 1-20
          sold: Math.floor(Math.random() * 50),
          status: 'active',
          image: item.img,
          images: [item.img],
          description: `Sản phẩm nhập khẩu chính hãng: ${item.title}.\nGiá gốc quy đổi: ${originalPrice.toLocaleString('vi-VN')} VND.\nPhụ phí vận chuyển và dịch vụ: 300,000 VND.`,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0
        };

        await productsCol.insertOne(newProduct);
        console.log(`Inserted: ${item.title}`);
      }
    } catch (err) {
      console.error(`Error fetching for ${category.name}:`, err.message);
    }
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

run();
