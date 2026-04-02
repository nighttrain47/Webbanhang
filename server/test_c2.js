const axios = require('axios');
const cheerio = require('cheerio');

async function doTest() {
  const r = await axios.get('https://cystore.com/');
  const $ = cheerio.load(r.data);
  const it = [];
  $('a[href*="ProductDetail.aspx"]').each((i, el)=>{
    if(it.length >= 5) return;
    const item = $(el).parent();
    const t = $(el).find('img').attr('alt') || $(el).text();
    const imgSpan = $(el).html();
    const p = $(el).parent().text().replace(/\s+/g,' ').trim();
    it.push({t, imgSpan, p, href: $(el).attr('href')});
  });
  console.log(JSON.stringify(it, null, 2));
}
doTest();
