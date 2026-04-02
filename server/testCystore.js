const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://cystore.com/collections/all', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}).then(r => {
  const $ = cheerio.load(r.data);
  let count = 0;
  $('.product-item').each((i, el) => {
    if(count > 5) return;
    console.log($(el).find('.product-item__title').text().trim());
    count++;
  });
}).catch(console.error);
