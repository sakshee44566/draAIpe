const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function fileToBase64(filePath) {
  return fs.readFileSync(filePath, { encoding: 'base64' });
}

exports.callGeminiAPI = async (message, imageFile) => {
  const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const systemPrompt = `
You are a professional shopping assistant.
Given a user message and an optional image, analyze the style and suggest up to 10 broad, general words or phrases that describe the types of clothes, garment features, or colors that would match the user's request or style.
Do NOT use adjectives like "elegant" or "modern"—only mention garment types (e.g. "t-shirt", "jeans", "dress"), colors, or simple descriptors (e.g. "striped", "denim", "long sleeve").
Respond ONLY in this JSON format:
{
  "reply": "A short, friendly reply to the user.",
  "recommendations": ["broad type 1", "broad type 2", ...]
}
Example:
{
  "reply": "Here are some items you might like!",
  "recommendations": ["black t-shirt", "summer dress", "blue jeans"]
}
`;

  const prompt = [
    { text: systemPrompt },
    { text: message }
  ];

  if (imageFile) {
    const base64Image = fileToBase64(imageFile.path);
    prompt.push({
      inlineData: {
        data: base64Image,
        mimeType: imageFile.mimetype,
      }
    });
  }

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: prompt }]
  });

  let replyText = result.candidates[0].content.parts[0].text;

if (replyText.startsWith('```')) {
  replyText = replyText.replace(/``````/gi, '').trim();
}

  let reply = '';
  let recommendations = [];
  try {
    const parsed = JSON.parse(replyText);
    reply = parsed.reply;
    recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations.map(s => s.trim()).filter(Boolean)
      : [];
  } catch (e) {
    reply = replyText;
    recommendations = [];
  }

  return {
    reply,
    recommendations
  };
};
