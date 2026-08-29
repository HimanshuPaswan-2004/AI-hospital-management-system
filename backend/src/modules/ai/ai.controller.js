import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';
import prisma from '../../config/db.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      generationConfig: { 
        maxOutputTokens: 2000,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            possibleConditions: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING, description: "Name of the condition" },
                  probability: { type: SchemaType.STRING, description: "E.g., High Possibility, Moderate Possibility" }
                }
              }
            },
            severity: { type: SchemaType.STRING, description: "E.g., Low, Moderate, High, Severe" },
            recommendedDepartment: { type: SchemaType.STRING, description: "E.g., General Medicine, Cardiology" },
            recommendedTests: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            },
            warningSigns: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            },
            actions: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING, description: "Things the user can do, e.g., Rest and stay hydrated" }
            }
          },
          required: ["possibleConditions", "severity", "recommendedDepartment", "recommendedTests", "warningSigns", "actions"]
        }
      }
    });

    const chatSession = model.startChat({
      history: formatHistory(history),
    });

    let prompt = symptoms || 'Please analyze this attached document.';
    if (!history || history.length === 0) {
      prompt = `You are a highly skilled AI Medical Assistant. 
      A patient has reported the following symptoms or attached a document: ${symptoms || 'See attachment'}. 
      Please provide a structured analysis. Remember you are an AI, always recommend consulting a real doctor.`;
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

    res.status(200).json(JSON.parse(text));
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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      generationConfig: { 
        maxOutputTokens: 2000,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            normalFindings: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            },
            abnormalFindings: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  status: { type: SchemaType.STRING, description: "E.g., High, Low" }
                }
              }
            },
            summary: { type: SchemaType.STRING },
            questionsForDoctor: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            }
          },
          required: ["normalFindings", "abnormalFindings", "summary", "questionsForDoctor"]
        }
      }
    });

    const chatSession = model.startChat({
      history: formatHistory(history),
    });

    let prompt = reportText || 'Please analyze this attached lab report.';
    if (!history || history.length === 0) {
      prompt = `You are an AI Medical Assistant specialized in translating complex medical lab reports into simple, easy-to-understand language for patients.
      Please summarize the following lab report text or attached document:
      "${reportText || 'See attached document'}"`;
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

    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error('Error summarizing report:', error);
    next(error);
  }
};

export const explainPrescription = async (req, res, next) => {
  try {
    const { prescriptionText, attachment } = req.body;
    if (!prescriptionText && !attachment) {
      return res.status(400).json({ message: 'Prescription text or attachment is required' });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      generationConfig: { 
        maxOutputTokens: 2000,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            medicineName: { type: SchemaType.STRING },
            purpose: { type: SchemaType.STRING },
            instructions: { type: SchemaType.STRING },
            precautions: { type: SchemaType.STRING },
            sideEffects: { type: SchemaType.STRING }
          },
          required: ["medicineName", "purpose", "instructions", "precautions", "sideEffects"]
        }
      }
    });

    let prompt = `You are an AI Medical Assistant. Explain the following prescription details: ${prescriptionText || 'See attachment'}`;
    const content = [{ text: prompt }];
    if (attachment && attachment.base64) {
      content.push({
        inlineData: {
          data: attachment.base64,
          mimeType: attachment.mimeType
        }
      });
    }

    const result = await model.generateContent(content);
    const text = (await result.response).text();

    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error('Error explaining prescription:', error);
    next(error);
  }
};

export const recommendDoctor = async (req, res, next) => {
  try {
    const { concern } = req.body;
    if (!concern) {
      return res.status(400).json({ message: 'Health concern is required' });
    }

    // First use AI to determine department and specialist
    const aiModel = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      generationConfig: { 
        maxOutputTokens: 500,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            department: { type: SchemaType.STRING },
            specialist: { type: SchemaType.STRING, description: "e.g., Cardiologist, Dermatologist" }
          },
          required: ["department", "specialist"]
        }
      }
    });

    const result = await aiModel.generateContent(`Based on these symptoms/concerns, what is the best medical department and specialist type to see? Concern: ${concern}`);
    const aiResponse = JSON.parse((await result.response).text());

    // Then find doctors matching this in the DB
    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        doctorProfile: {
          specialization: { contains: aiResponse.department, mode: 'insensitive' }
        }
      },
      include: {
        doctorProfile: true
      },
      take: 3
    });

    res.status(200).json({
      recommendedDepartment: aiResponse.department,
      specialist: aiResponse.specialist,
      topDoctors: doctors.map(d => ({
        id: d.id,
        name: `Dr. ${d.firstName} ${d.lastName}`,
        specialization: d.doctorProfile?.specialization || aiResponse.specialist,
        rating: 4.8 // Mock rating since it's not in schema
      }))
    });
  } catch (error) {
    console.error('Error recommending doctor:', error);
    next(error);
  }
};

export const findAppointmentSlots = async (req, res, next) => {
  try {
    const { requestText } = req.body;
    if (!requestText) {
      return res.status(400).json({ message: 'Request text is required' });
    }

    // AI parses the request to find specialist type and timeframe
    const aiModel = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      generationConfig: { 
        maxOutputTokens: 500,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            specialist: { type: SchemaType.STRING, description: "e.g., Dermatologist" },
            timeframe: { type: SchemaType.STRING, description: "e.g., Tomorrow morning" }
          },
          required: ["specialist", "timeframe"]
        }
      }
    });

    const result = await aiModel.generateContent(`Extract the requested specialist type and timeframe from this booking request: "${requestText}"`);
    const aiResponse = JSON.parse((await result.response).text());

    // Find doctors matching
    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        doctorProfile: {
          specialization: { contains: aiResponse.specialist, mode: 'insensitive' }
        }
      },
      include: { doctorProfile: true },
      take: 1
    });

    const doctor = doctors[0];
    
    // Generate mock slots
    const slots = [];
    if (doctor) {
      slots.push({
        doctorId: doctor.id,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        specialization: doctor.doctorProfile?.specialization,
        date: 'Tomorrow',
        time: '10:00 AM'
      });
      slots.push({
        doctorId: doctor.id,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        specialization: doctor.doctorProfile?.specialization,
        date: 'Tomorrow',
        time: '11:30 AM'
      });
    }

    res.status(200).json({
      parsedSpecialist: aiResponse.specialist,
      parsedTimeframe: aiResponse.timeframe,
      slots
    });
  } catch (error) {
    console.error('Error finding slots:', error);
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { message, history, attachment } = req.body;
    if (!message && !attachment) {
      return res.status(400).json({ message: 'Message or an attachment is required' });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      generationConfig: { maxOutputTokens: 2000 }
    });

    const chatSession = model.startChat({
      history: formatHistory(history),
    });

    let userMessage = message || 'Please analyze this attached document.';
    if (!history || history.length === 0) {
      userMessage = `You are a helpful AI Medical Assistant for MediAI hospital management system. Help the user with their health-related questions. Keep answers concise. User says: ${message || 'See attached document'}`;
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
