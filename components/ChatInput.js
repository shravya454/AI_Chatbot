import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MAX_INPUT_LENGTH } from '../utils/constants';

const ChatInput = ({ onSendMessage, isLoading, theme }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setText('');
  };

  const isOverLimit = text.length > MAX_INPUT_LENGTH;
  const isSendDisabled = !text.trim() || isLoading || isOverLimit;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {/* Character Counter Row */}
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

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              color: theme.textPrimary,
              borderColor: theme.border,
            },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={theme.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={MAX_INPUT_LENGTH + 10}
          editable={!isLoading}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={isSendDisabled}
          style={[
            styles.sendButton,
            {
              backgroundColor: isSendDisabled ? theme.border : theme.primary,
            },
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-up"
            size={20}
            color={isSendDisabled ? theme.textMuted : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
  },
  counterRow: {
    alignItems: 'flex-end',
    marginBottom: 4,
    marginRight: 4,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput;
