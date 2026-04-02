const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  const db = mongoose.connection.db;

  const r = await axios.get('https://cystore.com/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(r.data);
  const scrapedItems = [];

  $('.m-product-slider__item, .product-item').each((i, el) => {
    let t = $(el).find('.m-product-slider__item--name').text().trim();
    if (!t) return; // skip invalid text

    let priceText = $(el).find('.m-product-slider__item--price').text().trim();
    let jpy = 3000;
    const match = priceText.match(/¥([\d,]+)/);
    if(match) jpy = parseInt(match[1].replace(/,/g, ''), 10);

    let img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
    if (t && img && !scrapedItems.some(x => x.t === t)) {
      scrapedItems.push({t, jpy, img: 'https://cystore.com' + img});
    }
  });

  console.log(`Scraped ${scrapedItems.length} unique real items from Cystore.`);
  
  const categories = await db.collection('categories').find({}).toArray();
  const validCategories = categories.filter(c => c.name !== 'Pre-order');
  
  const productsCol = db.collection('products');
  let itemIndex = 0;

  for (const category of validCategories) {
    console.log(`Injecting items into Category: ${category.name}`);
    for (let c = 0; c < 5; c++) {
      if (itemIndex >= scrapedItems.length) {
          console.log('Out of scraped items!');
          break;
      }
      const item = scrapedItems[itemIndex];
      itemIndex++;
      
      const originalPrice = item.jpy * 170;
      const price = originalPrice + 300000;

      const newProduct = {
        name: item.t,
        series: 'Cygames Universe',
        manufacturer: 'Cystore Import',
        category: category._id,
        originalPrice: originalPrice,
        price: price,
        stock: Math.floor(Math.random() * 20) + 1,
        sold: Math.floor(Math.random() * 50),
        status: 'active',
        image: item.img,
        images: [item.img],
        description: `Sản phẩm độc quyền từ CyStore Nhật Bản: ${item.t}.\nGiá gốc quy đổi: ${originalPrice.toLocaleString('vi-VN')} VND.`,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      };

      await productsCol.insertOne(newProduct);
      console.log(` -> Inserted: ${item.t} into ${category.name}`);
    }
  }

  console.log('Cystore Seeding Completed!');
  process.exit(0);
}
run();
