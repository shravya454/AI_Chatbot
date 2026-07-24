import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import LoadingIndicator from '../components/LoadingIndicator';
import SuggestedPrompts from '../components/SuggestedPrompts';
import SearchModal from '../components/SearchModal';
import SettingsModal from '../components/SettingsModal';

import { LIGHT_THEME, DARK_THEME } from '../utils/constants';
import { generateId, generateChatExportText } from '../utils/formatters';
import { sendMessageToGemini } from '../services/geminiApi';
import {
  loadChatHistory,
  saveChatHistory,
  clearChatHistoryStorage,
  loadSettings,
  saveSettings,
} from '../storage/storage';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Modals
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const flatListRef = useRef(null);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  // Initial Load: AsyncStorage History & Settings
  useEffect(() => {
    const initApp = async () => {
      const savedMessages = await loadChatHistory();
      const savedSettings = await loadSettings();

      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      }
      if (savedSettings) {
        setIsDarkMode(savedSettings.isDarkMode || false);
        setApiKey(savedSettings.apiKey || '');
      }
    };
    initApp();
  }, []);

  // Save messages whenever updated
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  // Toggle Theme
  const handleToggleDarkMode = async () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    await saveSettings({ apiKey, isDarkMode: nextMode });
  };

  // Save API Key
  const handleSaveApiKey = async (newKey) => {
    setApiKey(newKey);
    await saveSettings({ apiKey: newKey, isDarkMode });
    setErrorMessage(null);
  };

  // Clear History
  const handleClearHistory = async () => {
    setMessages([]);
    await clearChatHistoryStorage();
  };

  // Send Message Logic
  const handleSendMessage = async (userText) => {
    if (!userText.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg = {
      id: generateId(),
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    scrollToBottom();

    try {
      // Send conversation context to Gemini API
      const aiResponseText = await sendMessageToGemini(updatedMessages, apiKey);

      const aiMsg = {
        id: generateId(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setErrorMessage(error.message);

      const errorMsg = {
        id: generateId(),
        sender: 'ai',
        text: `⚠️ ${error.message}`,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  // Regenerate Response for last user message
  const handleRegenerate = async () => {
    if (isLoading) return;

    // Find the last user message
    const lastUserMsgIdx = [...messages].reverse().findIndex((m) => m.sender === 'user');
    if (lastUserMsgIdx === -1) return;

    const actualIdx = messages.length - 1 - lastUserMsgIdx;
    const historyUpToUser = messages.slice(0, actualIdx + 1);

    // Remove any trailing AI responses
    setMessages(historyUpToUser);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const aiResponseText = await sendMessageToGemini(historyUpToUser, apiKey);
      const aiMsg = {
        id: generateId(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setErrorMessage(error.message);
      const errorMsg = {
        id: generateId(),
        sender: 'ai',
        text: `⚠️ ${error.message}`,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  // Export Chat History as TXT File
  const handleExportChat = async () => {
    if (messages.length === 0) {
      Alert.alert('Export Chat', 'There are no messages in the chat history to export.');
      return;
    }

    const exportText = generateChatExportText(messages);

    if (Platform.OS === 'web') {
      try {
        const element = document.createElement('a');
        const file = new Blob([exportText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `AI_Chat_Export_${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } catch (e) {
        console.error('Web export failed:', e);
      }
    } else {
      // Mobile native fallback (using expo-file-system / expo-sharing)
      try {
        const FileSystem = require('expo-file-system');
        const Sharing = require('expo-sharing');
        const fileUri = `${FileSystem.documentDirectory}AI_Chat_Export_${Date.now()}.txt`;

        await FileSystem.writeAsStringAsync(fileUri, exportText);
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Exported', `File saved to: ${fileUri}`);
        }
      } catch (err) {
        console.error('Mobile export failed:', err);
        Alert.alert('Export Error', 'Could not export file on this device.');
      }
    }
  };

  // Determine last AI message ID for regenerate button
  const lastAiMessageId = [...messages].reverse().find((m) => m.sender === 'ai' && !m.isError)?.id;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.surface} />

      {/* Header Bar */}
      <Header
        title="Gemini AI Assistant"
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenSearch={() => setSearchModalVisible(true)}
        onOpenSettings={() => setSettingsModalVisible(true)}
        onExportChat={handleExportChat}
        onClearHistory={handleClearHistory}
        theme={theme}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <View style={[styles.errorBanner, { backgroundColor: theme.error + '20', borderColor: theme.error }]}>
          <Ionicons name="warning" size={18} color={theme.error} />
          <Text style={[styles.errorBannerText, { color: theme.error }]}>{errorMessage}</Text>
          <TouchableOpacity onPress={() => setErrorMessage(null)}>
            <Ionicons name="close-circle" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>
      )}

      {/* Chat Messages Container */}
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isLastAiMessage={item.id === lastAiMessageId}
              onRegenerate={handleRegenerate}
              onRetry={handleRegenerate}
              theme={theme}
            />
          )}
          ListHeaderComponent={
            messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={[styles.welcomeIconCircle, { backgroundColor: theme.primaryLight }]}>
                  <Ionicons name="sparkles" size={36} color={theme.primary} />
                </View>
                <Text style={[styles.welcomeTitle, { color: theme.textPrimary }]}>
                  Welcome to Mobile AI Chatbot!
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                  Powered by Google Gemini 2.5. Ask any question, draft code, or brainstorm ideas.
                </Text>

                <SuggestedPrompts onSelectPrompt={handleSendMessage} theme={theme} />
              </View>
            ) : null
          }
          ListFooterComponent={isLoading ? <LoadingIndicator theme={theme} /> : null}
        />

        {/* Input Bar */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />
      </KeyboardAvoidingView>

      {/* Modals */}
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        messages={messages}
        theme={theme}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        theme={theme}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  welcomeIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
});

export default ChatScreen;
