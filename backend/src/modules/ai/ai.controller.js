import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); // Using gemini-flash-latest as it's the recommended default for text

const formatHistory = (history) => {
  if (!history || !Array.isArray(history)) return [];
  return history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text || '' }]
  }));
};

export const analyzeSymptoms = async (req, res, next) => {
  try {
    const { symptoms, history } = req.body;
    if (!symptoms) {
      return res.status(400).json({ message: 'Symptoms are required' });
    }

    const chatSession = model.startChat({
      history: formatHistory(history),
      generationConfig: { maxOutputTokens: 2000 },
    });

    let prompt = symptoms;
    // If it's the first message, inject the system prompt
    if (!history || history.length === 0) {
      prompt = `You are a highly skilled AI Medical Assistant. 
      A patient has reported the following symptoms: ${symptoms}. 
      Please provide a structured analysis including:
      1. Possible conditions (with a disclaimer that you are not a doctor).
      2. Recommendations for next steps (e.g., self-care, visit a doctor, go to emergency).
      3. Questions a doctor might ask them.
      Keep the response concise and well-formatted.`;
    }

    const result = await chatSession.sendMessage(prompt);
    const text = (await result.response).text();

    res.status(200).json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    next(error);
  }
};

export const summarizeReport = async (req, res, next) => {
  try {
    const { reportText, history } = req.body;
    if (!reportText) {
      return res.status(400).json({ message: 'Report text is required' });
    }

    const chatSession = model.startChat({
      history: formatHistory(history),
      generationConfig: { maxOutputTokens: 2000 },
    });

    let prompt = reportText;
    // If it's the first message, inject the system prompt
    if (!history || history.length === 0) {
      prompt = `You are an AI Medical Assistant specialized in translating complex medical lab reports into simple, easy-to-understand language for patients.
      Please summarize the following lab report:
      "${reportText}"
      
      Structure your summary as follows:
      1. **Key Findings:** What are the most important results?
      2. **Normal vs. Abnormal:** Highlight what is out of range.
      3. **Simple Explanation:** What does this mean in plain English?
      4. **Suggested Questions for Doctor:** What should the patient ask their doctor based on this report?`;
    }

    const result = await chatSession.sendMessage(prompt);
    const text = (await result.response).text();

    res.status(200).json({ summary: text });
  } catch (error) {
    console.error('Error summarizing report:', error);
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const chatSession = model.startChat({
      history: formatHistory(history),
      generationConfig: { maxOutputTokens: 2000 },
    });

    let userMessage = message;
    if (!history || history.length === 0) {
      userMessage = `You are a helpful AI Medical Assistant for MediAI hospital management system. Help the user with their health-related questions. User says: ${message}`;
    }

    const result = await chatSession.sendMessage(userMessage);
    const text = (await result.response).text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Error in AI chat:', error);
    next(error);
  }
};
