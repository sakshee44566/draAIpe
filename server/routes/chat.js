const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const { callGeminiAPI } = require('../utils/gemini');
const Product = require('../models/Product');

function extractReplyAndRecommendations(rawReply, rawRecommendations) {
  let reply = rawReply;
  let recommendations = rawRecommendations;

  if (
    Array.isArray(rawRecommendations) &&
    rawRecommendations.length === 0 &&
    typeof rawReply === 'string'
  ) {
    let cleaned = rawReply.trim();

    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/, ''); 
    cleaned = cleaned.replace(/```$/, '');

    try {
      const parsed = JSON.parse(cleaned);
      reply = parsed.reply || cleaned;
      recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    } catch (e) {
    }
  }

  return { reply, recommendations };
}

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const userMessage = req.body.message;
    const imageFile = req.file;

    const aiRawResponse = await callGeminiAPI(userMessage, imageFile);
    console.log('aiRawResponse:', aiRawResponse);

    let { reply, recommendations } = aiRawResponse;
    ({ reply, recommendations } = extractReplyAndRecommendations(reply, recommendations));
    
    let products = [];
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      const orConditions = [];
      for (const r of recommendations) {
        const safe = r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        orConditions.push({ title: { $regex: safe, $options: 'i' } });
        orConditions.push({ description: { $regex: safe, $options: 'i' } });
      }
      products = await Product.find({ $or: orConditions }).lean();
    }

    res.json({ reply, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "Sorry, something went wrong.",
      products: []
    });
  }
});

module.exports = router;