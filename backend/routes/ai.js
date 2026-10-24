const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMMA_API_KEY);

// ✅ Actual Gemma 4 models available via Google AI Studio
const PRIMARY_MODEL   = 'gemma-4-31b-it';
const FALLBACK_MODEL  = 'gemma-4-26b-a4b-it';

// System instruction for Musico AI Assistant
const SYSTEM_INSTRUCTION = `You are Musico AI, an intelligent music assistant powered by Gemma 4, built into the Musico music streaming platform.

Your capabilities:
- Recommend songs based on mood, genre, language, or artist preferences
- Provide information about artists, songs, albums, and music history
- Suggest songs based on what the user is feeling
- Help users discover music in categories like: Bollywood, Punjabi, Bhojpuri, Sad, Dance, Romantic, Party, Devotional, Lo-Fi, Motivational
- Artists available on Musico include: Arijit Singh, Honey Singh, Sonu Nigam, Darshan Raval, Jubin Nautiyal, Vishal Mishra, Badshah, Sachet Tandon, Khesari Lal Yadav, Pawan Singh, and more
- Answer questions about lyrics, music trivia, and song meanings

Keep responses concise (2-4 sentences max unless listing songs), friendly, and music-focused. Use emojis sparingly. 
If someone asks something completely unrelated to music, gently redirect them back to music topics.`;

// Helper: try a model, return text or throw
async function askModel(modelName, chatHistory, message) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION,
  });
  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(message.trim());
  return result.response.text();
}

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Build chat history for multi-turn context
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    let reply;
    try {
      // Try primary model first: gemma-4-31b-it
      reply = await askModel(PRIMARY_MODEL, chatHistory, message);
    } catch (primaryErr) {
      console.warn(`Primary model (${PRIMARY_MODEL}) failed: ${primaryErr.message}. Trying fallback...`);
      // Fallback to gemma-4-26b-a4b-it
      reply = await askModel(FALLBACK_MODEL, chatHistory, message);
    }

    res.json({ reply });
  } catch (err) {
    console.error('Gemma AI Error:', err.status || '', err.message);
    res.status(500).json({ error: `AI Error: ${err.message}` });
  }
});

module.exports = router;
