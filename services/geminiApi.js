import { DEFAULT_GEMINI_MODEL } from '../utils/constants.js';

/**
 * Intelligent Mock Response Generator when no API Key is configured.
 * Allows instant testing of all app features out-of-the-box!
 */
const getDemoMockResponse = (userText) => {
  const lower = userText.toLowerCase();

  if (lower.includes('quantum') || lower.includes('computing')) {
    return `### ⚛️ What is Quantum Computing?\n\nQuantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve complex problems faster than classical supercomputers.\n\n#### Key Concepts:\n- **Qubits**: Unlike classical bits (0 or 1), qubits can exist in a state of **superposition** (0 and 1 simultaneously).\n- **Entanglement**: Qubits can be interconnected such that the state of one instantly influences another.\n- **Quantum Speedup**: Ideal for cryptography, molecular modeling, and complex optimization.\n\n*💡 Tip: Enter your free Google Gemini API key in Settings (⚙️) to unlock live real-time AI responses!*`;
  }

  if (lower.includes('react') || lower.includes('hook') || lower.includes('code')) {
    return `Here is an example of a custom **React Native Hook** for fetching data:\n\n\`\`\`javascript\nimport { useState, useEffect } from 'react';\n\nexport const useFetchData = (url) => {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    let isMounted = true;\n    fetch(url)\n      .then(res => res.json())\n      .then(json => {\n        if (isMounted) {\n          setData(json);\n          setLoading(false);\n        }\n      })\n      .catch(() => {\n        if (isMounted) setLoading(false);\n      });\n    return () => { isMounted = false; };\n  }, [url]);\n\n  return { data, loading };\n};\n\`\`\`\n\nYou can use this hook cleanly inside any component!`;
  }

  if (lower.includes('workout') || lower.includes('fitness')) {
    return `### 🏋️ 7-Day Fitness & Workout Plan\n\n- **Monday**: Upper Body Strength (Bench Press, Pull-ups, Shoulder Press)\n- **Tuesday**: Lower Body & Core (Squats, Deadlifts, Planks)\n- **Wednesday**: Active Recovery & 30-min Cardio Walk\n- **Thursday**: High-Intensity Interval Training (HIIT)\n- **Friday**: Full Body Strength & Core\n- **Saturday & Sunday**: Rest & Flexibility / Yoga\n\nRemember to stay hydrated and prioritize 8 hours of sleep!`;
  }

  if (lower.includes('startup') || lower.includes('idea')) {
    return `### 🚀 3 Startup Ideas for 2026:\n\n1. **AI-Powered Personal Finance Coach**: An app that analyzes spending patterns in real-time and automates micro-investing.\n2. **Smart Local Event Finder**: Hyper-local AI matching users with local activities, live music, and community meetups.\n3. **Eco-Tracking Supply Chain SaaS**: Helping small businesses measure and offset carbon footprints easily.`;
  }

  if (lower.includes('email') || lower.includes('follow-up')) {
    return `Subject: Follow-up regarding our recent conversation\n\nHi [Name],\n\nI hope you're having a great week!\n\nI wanted to follow up on our previous discussion regarding [Topic]. Please let me know if you have any questions or if you'd like to schedule a quick 10-minute call to align on next steps.\n\nBest regards,\n[Your Name]`;
  }

  // General fallback demo answer
  return `I received your message: **"${userText}"**\n\nI am your **Mobile AI Chatbot Assistant**! All features including **Markdown rendering**, **Clipboard copying**, **Search**, **Chat Export**, and **Dark Mode** are fully functional.\n\n*Note: To connect to live Google Gemini model responses, click the Settings icon (⚙️) in the top-right header and add your API key.*`;
};

/**
 * Clean and format message history for Gemini API.
 * Ensures alternating user/model roles and valid message schema.
 */
const formatGeminiContents = (messageHistory) => {
  // 1. Filter out error messages and blank messages
  const validMessages = messageHistory.filter(
    (msg) => !msg.isError && msg.text && msg.text.trim().length > 0
  );

  if (validMessages.length === 0) {
    return [];
  }

  // 2. Limit to last 20 messages to prevent hitting payload/token limits
  const recentMessages = validMessages.slice(-20);

  // 3. Ensure the sequence starts with a user message
  const firstUserIdx = recentMessages.findIndex((m) => m.sender === 'user');
  const sanitized = firstUserIdx >= 0 ? recentMessages.slice(firstUserIdx) : recentMessages;

  // 4. Merge consecutive messages with identical roles
  const formatted = [];
  for (const msg of sanitized) {
    const role = msg.sender === 'user' ? 'user' : 'model';
    const lastEntry = formatted[formatted.length - 1];

    if (lastEntry && lastEntry.role === role) {
      lastEntry.parts[0].text += `\n\n${msg.text.trim()}`;
    } else {
      formatted.push({
        role,
        parts: [{ text: msg.text.trim() }],
      });
    }
  }

  return formatted;
};

/**
 * Execute single generation request to Gemini API
 */
const executeGeminiRequest = async (modelName, apiKey, contents) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [
            {
              text: 'You are a helpful, intelligent, friendly AI Assistant built with React Native. Format your responses cleanly using Markdown (headings, bullet points, and code blocks) where appropriate. Keep answers insightful, concise, and easy to read on mobile screens.',
            },
          ],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      const statusCode = response.status;

      const err = new Error(errorMessage || `Gemini API Error (${statusCode})`);
      err.status = statusCode;
      err.details = errorData;
      throw err;
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];

    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      if (candidate?.finishReason === 'SAFETY') {
        throw new Error('The AI response was blocked by safety filters. Please try rephrasing your prompt.');
      }
      throw new Error('Received an empty or invalid response from the AI model.');
    }

    return candidate.content.parts[0].text;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Sends conversation messages to the Google Gemini API with automatic model fallback.
 *
 * @param {Array} messageHistory - List of message objects [{ id, sender: 'user'|'ai', text, isError }]
 * @param {String} customApiKey - Optional custom user-provided API Key from settings
 * @param {String} customModel - Optional chosen Gemini model name
 * @returns {Promise<String>} AI response text
 */
export const sendMessageToGemini = async (messageHistory, customApiKey = '', customModel = '') => {
  const apiKey = (customApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '').trim();

  // If no API key is configured or default placeholder is used, return demo fallback
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const lastUserMessage = messageHistory[messageHistory.length - 1]?.text || '';
    return getDemoMockResponse(lastUserMessage);
  }

  const contents = formatGeminiContents(messageHistory);
  if (contents.length === 0) {
    throw new Error('No valid message content to send.');
  }

  const primaryModel = customModel || DEFAULT_GEMINI_MODEL || 'gemini-flash-latest';
  const fallbackModels = ['gemini-flash-latest', 'gemini-3.7-flash', 'gemini-3.1-flash-lite'].filter(
    (m) => m !== primaryModel
  );
  const modelsToTry = [primaryModel, ...fallbackModels];

  let lastError = null;

  for (const modelToUse of modelsToTry) {
    try {
      const result = await executeGeminiRequest(modelToUse, apiKey, contents);
      return result;
    } catch (error) {
      lastError = error;

      // If unauthorized or invalid API key, do not retry other models — it will fail identically
      if (error.status === 400 || error.status === 403) {
        throw new Error('Invalid API Key or unauthorized request. Please check your Gemini API key in Settings (⚙️).');
      }

      // If abort/timeout, fail gracefully
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }

      // If rate limited
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a few moments before sending another message.');
      }

      console.warn(`Model ${modelToUse} failed with error: ${error.message}. Trying next fallback model...`);
    }
  }

  // If all candidate models failed, throw descriptive error
  if (lastError) {
    if (lastError.message && !lastError.message.includes('fetch')) {
      throw lastError;
    }
    throw new Error('Network Connection Error. Please verify your internet connection and try again.');
  }

  throw new Error('Failed to generate response from Gemini AI. Please try again.');
};

/**
 * Validates and tests an API Key with a lightweight request
 */
export const testGeminiApiKey = async (apiKey, model = 'gemini-flash-latest') => {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: 'Please enter an API Key to test.' };
  }

  try {
    const text = await executeGeminiRequest(
      model || 'gemini-flash-latest',
      apiKey.trim(),
      [{ role: 'user', parts: [{ text: 'Hello! Respond with: OK' }] }]
    );
    return { success: true, message: 'Connection successful! Gemini API is active.', text };
  } catch (error) {
    if (error.status === 400 || error.status === 403) {
      return { success: false, message: 'Invalid API Key. Please verify the key in Google AI Studio.' };
    }
    if (error.status === 429) {
      return { success: false, message: 'Rate limit reached on this API key.' };
    }
    return { success: false, message: error.message || 'Could not connect to Gemini API.' };
  }
};
