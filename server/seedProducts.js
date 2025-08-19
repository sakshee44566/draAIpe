require('dotenv').config()

const mongoose = require('mongoose');
const axios = require('axios');

const MONGODB_URI = process.env.MONGODB_URL;

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
}, { strict: false }); 

const Product = mongoose.model('Product', productSchema);

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const res = await axios.get('https://fakestoreapi.com/products');
    const products = res.data;

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    await Product.insertMany(products);
    console.log('Inserted products:', products.length);

    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('Error:', err);
    mongoose.disconnect();
  }
}

seedProducts();
