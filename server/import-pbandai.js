require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const Product = require('./models/ProductDAO'); // Wait, ProductDAO doesn't export model directly.
// In ProductDAO.js it does module.exports = ProductDAO;
// Actually I need the Mongoose model. I can get it from mongoose.model('Product') after requiring ProductDAO.
const ProductDAO = require('./models/ProductDAO');
const CategoryDAO = require('./models/CategoryDAO');
const ProductModel = mongoose.model('Product');
const CategoryModel = mongoose.model('Category');
// Let's connect to DB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // We need to fetch the category ID for Gundam
    const bgCategory = mongoose.model('Category');
    const categoryDoc = await bgCategory.findOne({ name: { $regex: /Gundam/i } });
    if (!categoryDoc) {
      console.log('Category not found!');
      process.exit(1);
    }
    const catId = categoryDoc._id;

    // Read the content.md
    const contentPath = 'C:\\Users\\KTB\\.gemini\\antigravity\\brain\\80193ae6-9b10-4431-a21a-0a7070aa52a0\\.system_generated\\steps\\147\\content.md';
    const content = fs.readFileSync(contentPath, 'utf8');
    
    const match = content.match(/PRELOAD_DATA = (\{[\s\S]*?\})\n\nerrorStatus = null/);
    if (!match) {
        console.log('No preload data found');
        process.exit(1);
    }
    
    const data = JSON.parse(match[1]);
    const products = data.searchResult.productResults.products;
    
    console.log(`Found ${products.length} products`);
    
    for (const p of products) {
        let name = p.productName.en || p.productName['zh-HK'];
        name = name.replace(/\[\w{3} \d{4} Delivery\]/i, '').trim(); // Remove [Jun 2026 Delivery]
        
        const price = p.fixedListPrice?.amount || 0;
        
        let images = p.productImages.map(img => `https://p-bandai.com/${img.fileUrl}`);
        let mainImage = images[0] || '';
        
        let scale = '';
        if (name.includes('1/144')) scale = '1/144';
        else if (name.includes('1/100')) scale = '1/100';
        else if (name.includes('1/60')) scale = '1/60';
        
        let seriesName = 'Gundam';
        if (name.includes('HG')) seriesName = 'High Grade';
        else if (name.includes('MG')) seriesName = 'Master Grade';
        else if (name.includes('PG')) seriesName = 'Perfect Grade';
        else if (name.includes('RG')) seriesName = 'Real Grade';
        
        let isPreorder = false;
        let pStatus = 'active';
        if (p.productType === 'PreOrder' || p.productFlags?.some(f => f.labelCode === 'PRE_ORDER')) {
            isPreorder = true;
            pStatus = 'pre-order';
        }
        
        // Check if exists
        const exists = await ProductModel.findOne({ name });
        if (exists) {
            console.log(`Skipping ${name} - already exists`);
            continue;
        }
        
        await ProductDAO.insert({
            name,
            series: seriesName,
            manufacturer: 'Bandai Spirits',
            category: catId,
            price: price * 19000, // Roughly SGD to VND e.g. 25 * 19000 = 475k
            stock: 10,
            status: pStatus,
            image: mainImage,
            images: images,
            sku: p.productCode || p.areaProductNo,
            description: `Sản phẩm chính hãng P-Bandai Singapore.\n${name}`,
            isPreorder,
            scale,
        });
        console.log(`Inserted ${name}`);
    }
    
    console.log('Import done');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
