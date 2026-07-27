import { DEFAULT_GEMINI_MODEL } from '../utils/constants';

/**
 * Intelligent Mock Response Generator when no API Key is configured.
 * Allows instant testing of all app features out-of-the-box!
 */
const getDemoMockResponse = (userText) => {
  const lower = userText.toLowerCase();

  if (lower.includes('quantum') || lower.includes('computing')) {
    return `### ⚛️ What is Quantum Computing?\n\nQuantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve complex problems faster than on classical supercomputers.\n\n#### Key Concepts:\n- **Qubits**: Unlike classical bits (0 or 1), qubits can exist in a state of **superposition** (0 and 1 simultaneously).\n- **Entanglement**: Qubits can be interconnected such that the state of one instantly influences another.\n- **Quantum Speedup**: Ideal for cryptography, molecular modeling, and complex optimization.\n\n*💡 Tip: Enter your free Google Gemini API key in Settings (⚙️) to unlock live real-time AI responses!*`;
  }

  if (lower.includes('react') || lower.includes('hook') || lower.includes('code')) {
    return `Here is an example of a custom **React Native Hook** for fetching data:\n\n\`\`\`javascript\nimport { useState, useEffect } from 'react';\n\nexport const useFetchData = (url) => {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(url)\n      .then(res => res.json())\n      .then(json => {\n        setData(json);\n        setLoading(false);\n      });\n  }, [url]);\n\n  return { data, loading };\n};\n\`\`\`\n\nYou can use this hook cleanly inside any component!`;
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
  return `I received your message: **"${userText}"**\n\nI am your **Mobile AI Chatbot Assistant**! All features including **Markdown rendering**, **Clipboard copying**, **Search**, **Chat Export**, and **Dark Mode** are fully functional.\n\n*Note: To connect to live Google Gemini 2.5 model responses, click the Settings icon (⚙️) in the top-right header and add your API key.*`;
};

/**
 * Sends conversation messages to the Google Gemini API (or returns demo fallback if no key is set).
 * 
 * @param {Array} messageHistory - List of message objects [{ id, sender: 'user'|'ai', text }]
 * @param {String} userApiKey - Optional custom user-provided API Key
 * @returns {Promise<String>} AI response text
 */
export const sendMessageToGemini = async (messageHistory, userApiKey = '') => {
  const apiKey = userApiKey.trim() || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  // If no API key is provided, return smart interactive demo response after a brief 1s simulation delay
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const lastUserMessage = messageHistory[messageHistory.length - 1]?.text || '';
    return getDemoMockResponse(lastUserMessage);
  }

  // Format messages into Gemini API format
  const contents = messageHistory.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;

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
              text: "You are a helpful, intelligent, modern AI Assistant built with React Native. Format responses cleanly using Markdown when helpful. Keep answers clear, friendly, and well-structured.",
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

      if (response.status === 400 || response.status === 403) {
        throw new Error('Invalid API Key or unauthorized request. Please check your Gemini API key in Settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
      } else {
        throw new Error(`Gemini API Error (${response.status}): ${errorMessage || 'Server error'}`);
      }
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

    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network connection and try again.');
    }
    
    if (error.message && !error.message.includes('fetch')) {
      throw error;
    }
    throw new Error('Network Connection Error. Please verify your internet connection and try again.');
  }
};
