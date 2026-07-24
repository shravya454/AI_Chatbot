import { DEFAULT_GEMINI_MODEL } from '../utils/constants';

/**
 * Sends conversation messages to the Google Gemini API and returns the AI text response.
 * 
 * @param {Array} messageHistory - List of message objects [{ id, sender: 'user'|'ai', text }]
 * @param {String} userApiKey - Optional custom user-provided API Key
 * @returns {Promise<String>} AI response text
 */
export const sendMessageToGemini = async (messageHistory, userApiKey = '') => {
  const apiKey = userApiKey.trim() || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error('API Key Missing! Please add your Gemini API Key in the Settings menu (top right header icon).');
  }

  // Format messages into Gemini API format
  // Gemini expects: contents: [{ role: "user" | "model", parts: [{ text: "..." }] }]
  const contents = messageHistory.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

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
        throw new Error('Invalid API Key or unauthorized request. Please verify your Gemini API key in Settings.');
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
    
    // Pass through custom error messages or generic network failure
    if (error.message && !error.message.includes('fetch')) {
      throw error;
    }
    throw new Error('Network Connection Error. Please verify your internet connection and try again.');
  }
};
