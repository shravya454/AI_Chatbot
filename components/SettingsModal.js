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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsModal = ({ visible, onClose, apiKey, onSaveApiKey, theme }) => {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeyInput(apiKey || '');
  }, [apiKey, visible]);

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={[styles.saveBtnText, { color: theme.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* API Key Card */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="key-outline" size={20} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Gemini API Key</Text>
            </View>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Enter your Google AI Studio Gemini API Key below. If left blank, the app will run in Demo Mode so you can test all features without requiring an API key.
            </Text>

            <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              <TextInput
                style={[styles.keyInput, { color: theme.textPrimary }]}
                placeholder="AIzaSy... (Optional for Demo)"
                placeholderTextColor={theme.textMuted}
                value={keyInput}
                onChangeText={setKeyInput}
                secureTextEntry={!showKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowKey(!showKey)} style={styles.eyeBtn}>
                <Ionicons
                  name={showKey ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            </View>

            {savedSuccess && (
              <View style={styles.successRow}>
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                <Text style={[styles.successText, { color: theme.success }]}>Settings saved successfully!</Text>
              </View>
            )}
          </View>

          {/* Model info card */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="hardware-chip-outline" size={20} color={theme.accent} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>AI Engine Status</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Current Mode</Text>
              <Text style={[styles.infoValue, { color: apiKey ? theme.success : theme.primary }]}>
                {apiKey ? 'Live Gemini 2.5 API' : 'Built-in Demo Mode'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Provider</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>Google AI Studio</Text>
            </View>
          </View>

          {/* About Card */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>About Mobile AI Chatbot</Text>
            </View>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Built with React Native & Expo. Features persistent local storage, dark mode, multi-turn AI conversation context, message search, and chat export capabilities.
            </Text>
            <Text style={[styles.versionText, { color: theme.textMuted }]}>Version 1.0.0</Text>
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
  },
  saveBtn: {
    padding: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  keyInput: {
    flex: 1,
    fontSize: 14,
  },
  eyeBtn: {
    padding: 4,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#00000010',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    marginTop: 8,
  },
});

export default SettingsModal;
