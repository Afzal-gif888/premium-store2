import fetch from 'node-fetch';

const API = 'http://localhost:5000/api/products';

(async () => {
  try {
    const product = {
      name: 'TEST PRODUCT - multi images',
      category: 'Test Category',
      price: 999,
      sizes: [{ size: 'SIZE 8', stock: 5 }],
      images: [
        'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        'https://res.cloudinary.com/demo/image/upload/balloons.jpg'
      ]
    };

    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    const data = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Request failed:', err.message || err);
  }
})();
