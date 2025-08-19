const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/men', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const menProducts = await Product.find({ gender: /men/i })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ gender: /men/i });

    res.json({
      products: menProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/women', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; 
    const skip = (page - 1) * limit;

    const womenProducts = await Product.find({ gender: /women/i })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ gender: /women/i });

    res.json({
      products: womenProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/accessories', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const keywordRegex = /(accessor(y|ies)|belt|hat|cap|scarf|sunglass|watch|bag|wallet|glove|tie|sock|bracelet|hairband|headband|brooch|cufflink|keychain)/i;

    const query = {
      $or: [
        { description: { $regex: keywordRegex } },
        { name: { $regex: keywordRegex } }
      ]
    };

    const accessoriesProducts = await Product.find(query).skip(skip).limit(limit);
    const total = await Product.countDocuments(query);

    res.json({
      products: accessoriesProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// router.get('/jewellery', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 50;
//     const skip = (page - 1) * limit;

//     const keywordRegex = /(jewel(l)?er(y|ies)|necklace|ring|earring|bracelet|bangle|pendant|chain|anklet|nosepin|brooch)/i;

//     const query = {
//       $or: [
//         { description: { $regex: keywordRegex } },
//         { name: { $regex: keywordRegex } }
//       ]
//     };

//     const jewelleryProducts = await Product.find(query).skip(skip).limit(limit);
//     const total = await Product.countDocuments(query);

//     res.json({
//       products: jewelleryProducts,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit)
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

router.get('/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    console.log(skip, limit);

    const [products, total] = await Promise.all([
      Product.find().skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      totalPages,
      currentPage: page,
      totalProducts: total,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;