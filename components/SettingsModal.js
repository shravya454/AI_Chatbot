import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AVAILABLE_MODELS } from '../utils/constants';
import { testGeminiApiKey } from '../services/geminiApi';

const SettingsModal = ({
  visible,
  onClose,
  apiKey,
  selectedModel,
  isDarkMode,
  onSaveSettings,
  onClearAllSessions,
  onToggleDarkMode,
  theme,
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(selectedModel || 'gemini-flash-latest');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      setKeyInput(apiKey || '');
      setModel(selectedModel || 'gemini-flash-latest');
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [visible, apiKey, selectedModel]);

  const handleTestKey = async () => {
    const keyToTest = keyInput.trim() || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: 'Please enter a Gemini API Key to test.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testGeminiApiKey(keyToTest, model);
      setTestResult(result);
    } catch (e) {
      setTestResult({ success: false, message: e.message || 'Connection failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    await onSaveSettings({
      apiKey: keyInput.trim(),
      selectedModel: model,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleConfirmClearAll = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete all chat conversations? This action cannot be undone.')) {
        onClearAllSessions();
        onClose();
      }
    } else {
      Alert.alert(
        'Clear All Chats',
        'Are you sure you want to delete all chat conversations? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete All',
            style: 'destructive',
            onPress: () => {
              onClearAllSessions();
              onClose();
            },
          },
        ]
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveHeaderBtn, { backgroundColor: theme.primary }]}
            activeOpacity={0.8}
          >
            <Text style={styles.saveHeaderBtnText}>
              {savedSuccess ? 'Saved ✓' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* API Key Card */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="key-outline" size={18} color={theme.primary} />
              </View>
              <View style={styles.cardHeaderTexts}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Google Gemini API Key</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                  Enter your free API key from Google AI Studio
                </Text>
              </View>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              <TextInput
                style={[styles.keyInput, { color: theme.textPrimary }]}
                placeholder="AIzaSy... or AQ.Ab8..."
                placeholderTextColor={theme.textMuted}
                value={keyInput}
                onChangeText={(val) => {
                  setKeyInput(val);
                  setTestResult(null);
                }}
                secureTextEntry={!showKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowKey(!showKey)}
                style={styles.eyeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showKey ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Test Connection Button & Status */}
            <View style={styles.testRow}>
              <TouchableOpacity
                onPress={handleTestKey}
                disabled={isTesting}
                style={[
                  styles.testBtn,
                  { backgroundColor: theme.surfaceVariant, borderColor: theme.border },
                ]}
                activeOpacity={0.7}
              >
                {isTesting ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <>
                    <Ionicons name="flash-outline" size={16} color={theme.primary} />
                    <Text style={[styles.testBtnText, { color: theme.primary }]}>Test Connection</Text>
                  </>
                )}
              </TouchableOpacity>

              {testResult && (
                <View
                  style={[
                    styles.testResultBadge,
                    {
                      backgroundColor: testResult.success ? theme.success + '15' : theme.error + '15',
                      borderColor: testResult.success ? theme.success : theme.error,
                    },
                  ]}
                >
                  <Ionicons
                    name={testResult.success ? 'checkmark-circle' : 'alert-circle'}
                    size={14}
                    color={testResult.success ? theme.success : theme.error}
                  />
                  <Text
                    style={[
                      styles.testResultText,
                      { color: testResult.success ? theme.success : theme.error },
                    ]}
                    numberOfLines={2}
                  >
                    {testResult.message}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Model Selection Card */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="hardware-chip-outline" size={18} color={theme.accent} />
              </View>
              <View style={styles.cardHeaderTexts}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>AI Model Engine</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                  Select your preferred Gemini model
                </Text>
              </View>
            </View>

            <View style={styles.modelList}>
              {AVAILABLE_MODELS.map((item) => {
                const isSelected = model === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setModel(item.id)}
                    style={[
                      styles.modelOption,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.inputBg,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.modelRadioRow}>
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={isSelected ? theme.primary : theme.textMuted}
                      />
                      <View style={styles.modelInfo}>
                        <Text
                          style={[
                            styles.modelName,
                            { color: isSelected ? theme.primary : theme.textPrimary },
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text style={[styles.modelDesc, { color: theme.textSecondary }]}>
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Appearance & Preferences */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: theme.warning + '20' }]}>
                <Ionicons name="color-palette-outline" size={18} color={theme.warning} />
              </View>
              <View style={styles.cardHeaderTexts}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Appearance</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                  Customize theme and display style
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onToggleDarkMode}
              style={[styles.preferenceRow, { borderTopColor: theme.border }]}
              activeOpacity={0.7}
            >
              <View style={styles.preferenceLeft}>
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={20}
                  color={isDarkMode ? theme.accent : theme.warning}
                />
                <Text style={[styles.preferenceLabel, { color: theme.textPrimary }]}>
                  {isDarkMode ? 'Dark Theme' : 'Light Theme'}
                </Text>
              </View>
              <View
                style={[
                  styles.themeToggleBadge,
                  { backgroundColor: isDarkMode ? theme.accent + '20' : theme.surfaceVariant },
                ]}
              >
                <Text style={[styles.themeToggleText, { color: isDarkMode ? theme.accent : theme.textSecondary }]}>
                  {isDarkMode ? 'Dark' : 'Light'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Data Management Card */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: theme.error + '20' }]}>
                <Ionicons name="trash-outline" size={18} color={theme.error} />
              </View>
              <View style={styles.cardHeaderTexts}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Data Management</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                  Manage stored chat history
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleConfirmClearAll}
              style={[styles.dangerBtn, { borderColor: theme.error }]}
              activeOpacity={0.8}
            >
              <Ionicons name="trash" size={16} color={theme.error} />
              <Text style={[styles.dangerBtnText, { color: theme.error }]}>Clear All Chat Sessions</Text>
            </TouchableOpacity>
          </View>

          {/* About Card */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="information-circle-outline" size={18} color={theme.primary} />
              </View>
              <View style={styles.cardHeaderTexts}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>About NextChat</Text>
                <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                  Version 1.0.0 • Mobile AI Chatbot
                </Text>
              </View>
            </View>
            <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
              Built with React Native & Expo. Features multi-turn chat memory, model fallbacks, Markdown rendering with code copy, chat export, and local persistent storage.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  saveHeaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  saveHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderTexts: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  keyInput: {
    flex: 1,
    fontSize: 14,
  },
  eyeBtn: {
    padding: 6,
  },
  testRow: {
    marginTop: 12,
    gap: 8,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  testBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  testResultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  testResultText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  modelList: {
    gap: 10,
  },
  modelOption: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  modelRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '700',
  },
  modelDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeToggleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  dangerBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default SettingsModal;
