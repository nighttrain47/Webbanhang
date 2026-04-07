const dns = require('dns').promises;

async function test() {
    console.log("Starting DNS lookup...");
    try {
        const records = await dns.resolveMx("gmail.com");
        console.log("DNS records:", records);
    } catch (err) {
        console.log("DNS Error:", err);
    }
    console.log("Done!");
}

test();
