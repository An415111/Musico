const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMMA_API_KEY);

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

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemma-3-27b-it',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Build chat history for multi-turn context
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message.trim());
    const response = result.response.text();

    res.json({ reply: response });
  } catch (err) {
    console.error('Gemma AI Error:', err.message);
    res.status(500).json({ error: 'AI service is temporarily unavailable. Please try again.' });
  }
});

module.exports = router;
