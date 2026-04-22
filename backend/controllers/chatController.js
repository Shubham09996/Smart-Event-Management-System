const asyncHandler = require('express-async-handler');
const { GoogleGenAI } = require('@google/genai');

const handleChat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  // Ensure API Key exists
  if (!process.env.GEMINI_API_KEY) {
    res.status(500);
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const systemPrompt = `You are an AI Event Management Assistant for the 'Smart College Event Management System'. 
    Your job is to help users (students, organizers, and admins) navigate the platform. 
    Keep your answers concise, professional, and helpful. Do not mention code implementation details, just functionality.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [{ text: systemPrompt + "\n\nUser Message: " + message }]
            }
        ]
    });

    if (response && response.text) {
      res.json({ reply: response.text });
    } else {
      res.status(500).json({ reply: "I'm sorry, I couldn't process that right now." });
    }

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500);
    throw new Error('Failed to generate AI response. Make sure the API key is valid.');
  }
});

module.exports = { handleChat };
