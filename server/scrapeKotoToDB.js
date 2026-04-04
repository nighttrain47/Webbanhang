require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const ProductDAO = require('./models/ProductDAO');

const KOTOBUKIYA_URL = process.argv[2] || 'https://shop.kotobukiya.co.jp/shop/r/r1356/';
const BRAND_ID = '69d0a0a96503feac4c28613d'; // Kotobukiya
const CATEGORY_ID = '69d0a0336503feac4c28611d'; // Model Kits

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB.');

        console.log(`Fetching Kotobukiya page: ${KOTOBUKIYA_URL} ...`);
        const res = await axios.get(KOTOBUKIYA_URL, { responseType: 'arraybuffer' });
        const html = iconv.decode(res.data, 'Shift_JIS');
        const $ = cheerio.load(html);

        let seriesName = $('title').text().split('｜')[0].trim();
        if (!seriesName) seriesName = 'Kotobukiya Model Kit';
        console.log(`Detected series: ${seriesName}`);

        const products = [];
        $('.tile_item').each((i, el) => {
            // Check if available
            const classes = $(el).attr('class') || '';
            if (classes.includes('goods_nostock_')) {
                return; // Skip out of stock
            }

            const name = $(el).find('.desc .name').text().trim();
            const priceText = $(el).find('.desc .price .amount_of_money').text().trim().replace(/,/g, '');
            const priceJPY = parseInt(priceText, 10);
            const priceVND = priceJPY * 165; // Approximate JPY to VND rate + padding

            const imgRel = $(el).find('img.lazy').attr('data-original');
            if (!imgRel || !name || isNaN(priceJPY)) return;

            const image = 'https://shop.kotobukiya.co.jp' + imgRel;

            // Optional: get URL
            const href = $(el).find('a').attr('href');
            let sku = '';
            if (href) {
                const match = href.match(/\/g\/g(\d+)/);
                if (match) sku = match[1];
            }

            products.push({
                name,
                series: seriesName,
                manufacturer: 'Kotobukiya',
                brand: BRAND_ID,
                category: CATEGORY_ID,
                price: priceVND,
                stock: 50,
                status: 'active',
                image,
                images: [image],
                sku: sku,
                isPreorder: false,
                description: `Sản phẩm chính hãng từ Kotobukiya. Dòng ${seriesName}.\nThiết kế tinh xảo, chất lượng cao.`
            });
        });

        console.log(`Found ${products.length} available products.`);
        
        const count = Math.min(20, products.length);
        const toInsert = products.slice(0, count);

        for (const p of toInsert) {
            const existing = await mongoose.connection.collection('products').findOne({ name: p.name });
            if (!existing) {
                await ProductDAO.insert(p);
                console.log(`Inserted: ${p.name}`);
            } else {
                console.log(`Skipped existing: ${p.name}`);
            }
        }

        console.log('Done!');
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
