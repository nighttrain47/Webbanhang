const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  try {
    const r = await axios.get('https://cystore.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(r.data);
    const links = [];
    $('a').each((i, el) => {
      const h = $(el).attr('href');
      if (h && h.startsWith('/collections')) links.push(h);
    });
    console.log([...new Set(links)]);
  } catch(e) {
    console.error(e.message);
  }
}
test();
