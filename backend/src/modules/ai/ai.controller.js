import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

const formatHistory = (history) => {
  if (!history || !Array.isArray(history)) return [];
  return history.map(msg => {
    const parts = [];
    if (msg.text) parts.push({ text: msg.text });
    if (msg.attachment && msg.attachment.base64) {
      parts.push({
        inlineData: {
          data: msg.attachment.base64,
          mimeType: msg.attachment.mimeType
        }
      });
    }
    // Fallback if no parts
    if (parts.length === 0) parts.push({ text: '' });

    return {
      role: msg.role === 'model' ? 'model' : 'user',
      parts
    };
  });
};

export const analyzeSymptoms = async (req, res, next) => {
  try {
    const { symptoms, history, attachment } = req.body;
    if (!symptoms && !attachment) {
      return res.status(400).json({ message: 'Symptoms or an attachment are required' });
    }

    const chatSession = model.startChat({
      history: formatHistory(history),
      generationConfig: { maxOutputTokens: 2000 },
    });

    let prompt = symptoms || 'Please analyze this attached document.';
    // If it's the first message, inject the system prompt
    if (!history || history.length === 0) {
      prompt = `You are a highly skilled AI Medical Assistant. 
      A patient has reported the following symptoms or attached a document: ${symptoms || 'See attachment'}. 
      Please provide a structured analysis including:
      1. Possible conditions (with a disclaimer that you are not a doctor).
      2. Recommendations for next steps (e.g., self-care, visit a doctor, go to emergency).
      3. Questions a doctor might ask them.
      Keep the response concise and well-formatted.`;
    }

    const content = [{ text: prompt }];
    if (attachment && attachment.base64) {
      content.push({
        inlineData: {
          data: attachment.base64,
          mimeType: attachment.mimeType
        }
      });
    }

    const result = await chatSession.sendMessage(content);
    const text = (await result.response).text();

    res.status(200).json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    next(error);
  }
};

export const summarizeReport = async (req, res, next) => {
  try {
    const { reportText, history, attachment } = req.body;
    if (!reportText && !attachment) {
      return res.status(400).json({ message: 'Report text or an attachment is required' });
    }

    const chatSession = model.startChat({
      history: formatHistory(history),
      generationConfig: { maxOutputTokens: 2000 },
    });

    let prompt = reportText || 'Please analyze this attached lab report.';
    // If it's the first message, inject the system prompt
    if (!history || history.length === 0) {
      prompt = `You are an AI Medical Assistant specialized in translating complex medical lab reports into simple, easy-to-understand language for patients.
      Please summarize the following lab report text or attached document:
      "${reportText || 'See attached document'}"
      
      Structure your summary as follows:
      1. **Key Findings:** What are the most important results?
      2. **Normal vs. Abnormal:** Highlight what is out of range.
      3. **Simple Explanation:** What does this mean in plain English?
      4. **Suggested Questions for Doctor:** What should the patient ask their doctor based on this report?`;
    }

    const content = [{ text: prompt }];
    if (attachment && attachment.base64) {
      content.push({
        inlineData: {
          data: attachment.base64,
          mimeType: attachment.mimeType
        }
      });
    }

    const result = await chatSession.sendMessage(content);
    const text = (await result.response).text();

    res.status(200).json({ summary: text });
  } catch (error) {
    console.error('Error summarizing report:', error);
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { message, history, attachment } = req.body;
    if (!message && !attachment) {
      return res.status(400).json({ message: 'Message or an attachment is required' });
    }

    const chatSession = model.startChat({
      history: formatHistory(history),
      generationConfig: { maxOutputTokens: 2000 },
    });

    let userMessage = message || 'Please analyze this attached document.';
    if (!history || history.length === 0) {
      userMessage = `You are a helpful AI Medical Assistant for MediAI hospital management system. Help the user with their health-related questions. User says: ${message || 'See attached document'}`;
    }

    const content = [{ text: userMessage }];
    if (attachment && attachment.base64) {
      content.push({
        inlineData: {
          data: attachment.base64,
          mimeType: attachment.mimeType
        }
      });
    }

    const result = await chatSession.sendMessage(content);
    const text = (await result.response).text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Error in AI chat:', error);
    next(error);
  }
};
