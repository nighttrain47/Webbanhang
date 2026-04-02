const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const r = await axios.get('https://cystore.com/');
  const $ = cheerio.load(r.data);
  const items = [];
  $('.m-product-slider__item, .product-item').each((i, el) => {
    let t = $(el).find('.m-product-slider__item--name').text().trim();
    if (!t) t = $(el).text().replace(/\s+/g, ' ').trim();
    
    let priceText = $(el).find('.m-product-slider__item--price').text().trim();
    if (!priceText) priceText = $(el).text().replace(/\s+/g, ' ').trim();
    
    let jpy = 3000;
    const match = priceText.match(/¥([\d,]+)/);
    if(match) jpy = parseInt(match[1].replace(/,/g, ''), 10);
    
    // Find img src inside the element
    let img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
    
    if (t && img) {
      items.push({t, jpy, img: 'https://cystore.com' + img});
    }
  });
  console.log(items.length);
  console.log(items.slice(0, 3));
}
test();
