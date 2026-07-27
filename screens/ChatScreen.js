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
import Sidebar from '../components/Sidebar';
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
  loadAllSessions,
  saveAllSessions,
  loadActiveSessionId,
  saveActiveSessionId,
  clearAllSessionsStorage,
  loadSettings,
  saveSettings,
} from '../storage/storage';

const ChatScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Modals
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const flatListRef = useRef(null);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  // Active Session Object & Message list
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const messages = activeSession ? activeSession.messages : [];

  // Initial Load from Storage
  useEffect(() => {
    const initApp = async () => {
      const loadedSessions = await loadAllSessions();
      const savedActiveId = await loadActiveSessionId();
      const savedSettings = await loadSettings();

      if (savedSettings) {
        setIsDarkMode(savedSettings.isDarkMode || false);
        setApiKey(savedSettings.apiKey || '');
      }

      if (loadedSessions && loadedSessions.length > 0) {
        setSessions(loadedSessions);
        if (savedActiveId && loadedSessions.some((s) => s.id === savedActiveId)) {
          setActiveSessionId(savedActiveId);
        } else {
          setActiveSessionId(loadedSessions[0].id);
        }
      } else {
        // Create initial default session
        const initialSession = {
          id: generateId(),
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setSessions([initialSession]);
        setActiveSessionId(initialSession.id);
        saveAllSessions([initialSession]);
        saveActiveSessionId(initialSession.id);
      }
    };
    initApp();
  }, []);

  // Save sessions whenever updated
  const updateSessionsState = (newSessions) => {
    setSessions(newSessions);
    saveAllSessions(newSessions);
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  // Create a New Chat Thread
  const handleNewChat = () => {
    const newSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updated = [newSession, ...sessions];
    updateSessionsState(updated);
    setActiveSessionId(newSession.id);
    saveActiveSessionId(newSession.id);
    setErrorMessage(null);
  };

  // Select Session from Sidebar
  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    saveActiveSessionId(sessionId);
    setErrorMessage(null);
  };

  // Rename Session Title
  const handleRenameSession = (sessionId, newTitle) => {
    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, title: newTitle, updatedAt: Date.now() } : s
    );
    updateSessionsState(updated);
  };

  // Delete Session
  const handleDeleteSession = (sessionId) => {
    const remaining = sessions.filter((s) => s.id !== sessionId);

    if (remaining.length === 0) {
      // Create fresh blank session if all deleted
      const freshSession = {
        id: generateId(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      updateSessionsState([freshSession]);
      setActiveSessionId(freshSession.id);
      saveActiveSessionId(freshSession.id);
    } else {
      updateSessionsState(remaining);
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
        saveActiveSessionId(remaining[0].id);
      }
    }
  };

  // Clear Current Chat History
  const handleClearHistory = () => {
    if (!activeSessionId) return;
    const updated = sessions.map((s) =>
      s.id === activeSessionId ? { ...s, messages: [], updatedAt: Date.now() } : s
    );
    updateSessionsState(updated);
  };

  // Toggle Dark Mode
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

  // Send Message
  const handleSendMessage = async (userText) => {
    if (!userText.trim() || isLoading || !activeSessionId) return;

    setErrorMessage(null);
    const userMsg = {
      id: generateId(),
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    // Auto-generate title for "New Chat" from first message
    let sessionTitle = activeSession?.title || 'New Chat';
    if (messages.length === 0 || sessionTitle === 'New Chat') {
      sessionTitle = userText.length > 28 ? userText.substring(0, 28) + '...' : userText;
    }

    const currentMessages = [...messages, userMsg];
    
    // Update local state immediately
    const updatedSessions = sessions.map((s) => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: sessionTitle,
          messages: currentMessages,
          updatedAt: Date.now(),
        };
      }
      return s;
    });

    updateSessionsState(updatedSessions);
    setIsLoading(true);
    scrollToBottom();

    try {
      const aiResponseText = await sendMessageToGemini(currentMessages, apiKey);

      const aiMsg = {
        id: generateId(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: Date.now(),
      };

      const finalSessions = sessions.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...currentMessages, aiMsg],
            updatedAt: Date.now(),
          };
        }
        return s;
      });

      updateSessionsState(finalSessions);
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

      const errorSessions = sessions.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...currentMessages, errorMsg],
            updatedAt: Date.now(),
          };
        }
        return s;
      });

      updateSessionsState(errorSessions);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  // Regenerate Response
  const handleRegenerate = async () => {
    if (isLoading || messages.length === 0) return;

    const lastUserMsgIdx = [...messages].reverse().findIndex((m) => m.sender === 'user');
    if (lastUserMsgIdx === -1) return;

    const actualIdx = messages.length - 1 - lastUserMsgIdx;
    const historyUpToUser = messages.slice(0, actualIdx + 1);

    setIsLoading(true);
    setErrorMessage(null);

    // Update state to remove trailing response
    const updatedSessions = sessions.map((s) => {
      if (s.id === activeSessionId) {
        return { ...s, messages: historyUpToUser, updatedAt: Date.now() };
      }
      return s;
    });
    updateSessionsState(updatedSessions);

    try {
      const aiResponseText = await sendMessageToGemini(historyUpToUser, apiKey);
      const aiMsg = {
        id: generateId(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: Date.now(),
      };

      const finalSessions = sessions.map((s) => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...historyUpToUser, aiMsg], updatedAt: Date.now() };
        }
        return s;
      });
      updateSessionsState(finalSessions);
    } catch (error) {
      setErrorMessage(error.message);
      const errorMsg = {
        id: generateId(),
        sender: 'ai',
        text: `⚠️ ${error.message}`,
        timestamp: Date.now(),
        isError: true,
      };

      const errorSessions = sessions.map((s) => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...historyUpToUser, errorMsg], updatedAt: Date.now() };
        }
        return s;
      });
      updateSessionsState(errorSessions);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  // Export Chat
  const handleExportChat = async () => {
    if (messages.length === 0) {
      Alert.alert('Export Chat', 'There are no messages in this conversation to export.');
      return;
    }

    const exportText = generateChatExportText(messages);

    if (Platform.OS === 'web') {
      try {
        const element = document.createElement('a');
        const file = new Blob([exportText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${activeSession?.title || 'NextChat'}_Export_${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } catch (e) {
        console.error('Web export failed:', e);
      }
    } else {
      try {
        const FileSystem = require('expo-file-system');
        const Sharing = require('expo-sharing');
        const fileUri = `${FileSystem.documentDirectory}NextChat_Export_${Date.now()}.txt`;

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

  const lastAiMessageId = [...messages].reverse().find((m) => m.sender === 'ai' && !m.isError)?.id;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.surface} />

      {/* App Header */}
      <Header
        title={activeSession?.title || 'NextChat'}
        onOpenSidebar={() => setSidebarVisible(true)}
        onNewChat={handleNewChat}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenSearch={() => setSearchModalVisible(true)}
        onOpenSettings={() => setSettingsModalVisible(true)}
        onExportChat={handleExportChat}
        onClearHistory={handleClearHistory}
        theme={theme}
      />

      {/* Error Banner */}
      {errorMessage && (
        <View style={[styles.errorBanner, { backgroundColor: theme.error + '20', borderColor: theme.error }]}>
          <Ionicons name="warning" size={18} color={theme.error} />
          <Text style={[styles.errorBannerText, { color: theme.error }]}>{errorMessage}</Text>
          <TouchableOpacity onPress={() => setErrorMessage(null)}>
            <Ionicons name="close-circle" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>
      )}

      {/* Main Chat Area */}
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
                  NextChat AI Assistant
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                  What can I help you with today? Choose a prompt or type your question below.
                </Text>

                <SuggestedPrompts onSelectPrompt={handleSendMessage} theme={theme} />
              </View>
            ) : null
          }
          ListFooterComponent={isLoading ? <LoadingIndicator theme={theme} /> : null}
        />

        {/* Bottom Input Field */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />
      </KeyboardAvoidingView>

      {/* Sidebar Drawer */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setSettingsModalVisible(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        theme={theme}
      />

      {/* Search Modal */}
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        messages={messages}
        theme={theme}
      />

      {/* Settings Modal */}
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
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
});

export default ChatScreen;
