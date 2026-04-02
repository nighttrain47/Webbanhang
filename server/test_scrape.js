const axios = require('axios');
const cheerio = require('cheerio');

async function testHobbySearch() {
  try {
    const url = 'https://www.1999.co.jp/eng/search?searchkey=nendoroid&sold=0';
    console.log('Fetching', url);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    
    const items = [];
    $('[class*="c-card"]').each((i, el) => {
      // Sometimes it's li with c-card, or li with some class containing c-card
      // Let's gather text from the container to inspect
      const text = $(el).text().replace(/\s+/g, ' ');
      // Or explicitly
      const title = $(el).find('.c-card__title').text().trim() || $(el).find('[class*="title"]').text().trim();
      const img = $(el).find('img').attr('src');
      let priceText = $(el).find('.c-card__price, .c-card__price-sale, [class*="price"]').text().replace(/\s+/g, ' ').trim();
      if (!priceText) {
          // just grab the whole text and match yen value
          const match = text.match(/([\d,]+)\s*yen/i);
          if (match) priceText = match[1];
      }
      
      if (title && img && items.length < 5) {
        items.push({ title, img, priceText, raw: text.substring(0, 50) });
      }
    });

    console.log(items);
  } catch (err) {
    console.error(err.message);
  }
}

testHobbySearch();
