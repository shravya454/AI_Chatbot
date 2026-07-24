import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CHAT_MESSAGES: '@ai_chat_messages_v1',
  SETTINGS: '@ai_chat_settings_v1',
};

/**
 * Load chat history from AsyncStorage
 */
export const loadChatHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading chat history from AsyncStorage:', error);
    return [];
  }
};

/**
 * Save chat messages to AsyncStorage
 */
export const saveChatHistory = async (messages) => {
  try {
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, jsonValue);
  } catch (error) {
    console.error('Error saving chat history to AsyncStorage:', error);
  }
};

/**
 * Clear chat history
 */
export const clearChatHistoryStorage = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  } catch (error) {
    console.error('Error clearing chat history from AsyncStorage:', error);
  }
};

/**
 * Load user settings (API key, theme preference)
 */
export const loadSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : { apiKey: '', isDarkMode: false };
  } catch (error) {
    console.error('Error loading settings from AsyncStorage:', error);
    return { apiKey: '', isDarkMode: false };
  }
};

/**
 * Save user settings
 */
export const saveSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving settings to AsyncStorage:', error);
  }
};
