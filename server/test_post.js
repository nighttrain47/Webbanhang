

(async () => {
    try {
        console.log("Sending POST request (no token)...");
        const res = await fetch('http://localhost:5000/api/customer/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                label: 'Test', fullName: 'John Doe', phone: '123', address: '123 Test St', city: 'Testville', isDefault: false
            })
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text);
    } catch (err) {
        console.error(err);
    }
})();
