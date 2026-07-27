import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CHAT_SESSIONS: '@nextchat_sessions_v2',
  ACTIVE_SESSION_ID: '@nextchat_active_session_id_v2',
  SETTINGS: '@nextchat_settings_v2',
};

/**
 * Load all conversation sessions from AsyncStorage
 */
export const loadAllSessions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

/**
 * Save all sessions to AsyncStorage
 */
export const saveAllSessions = async (sessions) => {
  try {
    const jsonValue = JSON.stringify(sessions);
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, jsonValue);
  } catch (error) {
    console.error('Error saving chat sessions:', error);
  }
};

/**
 * Load active session ID
 */
export const loadActiveSessionId = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
  } catch (error) {
    console.error('Error loading active session ID:', error);
    return null;
  }
};

/**
 * Save active session ID
 */
export const saveActiveSessionId = async (id) => {
  try {
    if (id) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, id);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
    }
  } catch (error) {
    console.error('Error saving active session ID:', error);
  }
};

/**
 * Clear all sessions from storage
 */
export const clearAllSessionsStorage = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_SESSIONS);
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
  } catch (error) {
    console.error('Error clearing sessions storage:', error);
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
    console.error('Error loading settings:', error);
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
    console.error('Error saving settings:', error);
  }
};
