const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
