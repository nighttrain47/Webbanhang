const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
    try {
        const response = await axios.get('https://shop.kotobukiya.co.jp/shop/r/r100105/', {
            responseType: 'arraybuffer', // In case of Shift_JIS, we can handle it later if needed, but let's try raw first
        });
        
        // Kotobukiya shop might be UTF-8 nowadays. Let's assume UTF-8 for a moment.
        const html = response.data.toString('utf8');
        const $ = cheerio.load(html);
        
        const products = [];
        $('.block-goods-list .goods-item').each((i, el) => {
            const name = $(el).find('.goods-name').text().trim();
            const price = $(el).find('.goods-price').text().trim();
            const image = $(el).find('.goods-image img').attr('src');
            products.push({ name, price, image });
        });
        
        console.log(`Found ${products.length} products`);
        if (products.length === 0) {
            // Let's dump some HTML classes to figure it out
            console.log($('div, li').map((i, el) => $(el).attr('class')).get().slice(0, 50).join(', '));
        } else {
            console.log(products.slice(0, 3));
        }
    } catch (e) {
        console.error(e);
    }
}
testScrape();
