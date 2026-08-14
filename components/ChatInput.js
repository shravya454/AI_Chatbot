import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAX_INPUT_LENGTH } from '../utils/constants';

const ChatInput = ({ onSendMessage, isLoading, theme }) => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setText('');
  };

  const isOverLimit = text.length > MAX_INPUT_LENGTH;
  const isSendDisabled = !text.trim() || isLoading || isOverLimit;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View
        style={[
          styles.inputCapsule,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: theme.textPrimary,
            },
          ]}
          placeholder="Ask NextChat anything..."
          placeholderTextColor={theme.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={MAX_INPUT_LENGTH + 10}
          editable={!isLoading}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />

        {/* Clear Button */}
        {text.length > 0 && !isLoading && (
          <TouchableOpacity
            onPress={() => setText('')}
            style={styles.clearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={isSendDisabled}
          style={[
            styles.sendButton,
            {
              backgroundColor: isSendDisabled ? theme.surfaceVariant : theme.primary,
            },
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-up"
            size={18}
            color={isSendDisabled ? theme.textMuted : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Character limit counter */}
      {text.length > MAX_INPUT_LENGTH * 0.8 && (
        <View style={styles.counterRow}>
          <Text
            style={[
              styles.counterText,
              { color: isOverLimit ? theme.error : theme.textMuted },
            ]}
          >
            {text.length} / {MAX_INPUT_LENGTH}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  inputCapsule: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    fontSize: 15,
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 8,
    lineHeight: 20,
  },
  clearBtn: {
    padding: 6,
    marginBottom: 4,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  counterRow: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginRight: 8,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default ChatInput;
