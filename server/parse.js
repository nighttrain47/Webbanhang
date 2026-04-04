const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('koto_sample.html', 'utf8');
const $ = cheerio.load(html);

console.log($('.tile_item').first().html());
