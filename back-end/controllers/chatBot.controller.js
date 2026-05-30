const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const chatHistory = require("../utils/chatHistory.js"); // Import chat history file

const chatBot = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { userInput } = req.body;

  if (!userInput || typeof userInput !== "string") {
    return res.status(400).json({
      response: "Please type a valid message so I can help you with your trip.",
    });
  }

  if (!apiKey) {
    return res.status(200).json({
      response:
        "Tripsy is currently running in offline mode. Please add GEMINI_API_KEY in backend .env to enable AI responses.",
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "Your system instruction goes here...",
  });

  const generationConfig = {
    temperature: 0.5,
    topP: 0.5,
    topK: 64,
    maxOutputTokens: 10000,
    responseMimeType: "text/plain",
  };

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory, // Use imported chat history
    });

    const result = await chatSession.sendMessage(userInput);
    return res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error in chat interaction:", error.message);
    return res.status(200).json({
      response:
        "I am having trouble connecting right now. Please try again in a moment.",
    });
  }
};

module.exports = chatBot;
