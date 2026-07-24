import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { formatTime } from '../utils/formatters';

const ChatBubble = ({ message, isLastAiMessage, onRegenerate, onRetry, theme }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';
  const isError = message.isError;

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard copy error:', e);
    }
  };

  // Helper to simple-parse basic Markdown elements (bold, code snippets, lists)
  const renderTextContent = (text) => {
    if (isUser) {
      return <Text style={[styles.messageText, { color: theme.userBubbleText }]}>{text}</Text>;
    }

    // Split text into paragraphs
    const lines = text.split('\n');

    return (
      <View style={styles.markdownContainer}>
        {lines.map((line, idx) => {
          const isCodeBlock = line.startsWith('```') || line.startsWith('`');
          const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\./.test(line.trim());
          const isHeader = line.startsWith('#');

          if (isCodeBlock) {
            const cleanCode = line.replace(/```/g, '').replace(/`/g, '');
            return (
              <View key={idx} style={[styles.codeBlock, { backgroundColor: theme.surfaceVariant, borderColor: theme.border }]}>
                <Text style={[styles.codeText, { color: theme.textPrimary }]}>{cleanCode}</Text>
              </View>
            );
          }

          if (isHeader) {
            const headerText = line.replace(/#/g, '').trim();
            return (
              <Text key={idx} style={[styles.headerText, { color: theme.textPrimary }]}>
                {headerText}
              </Text>
            );
          }

          return (
            <Text
              key={idx}
              style={[
                styles.messageText,
                { color: theme.aiBubbleText },
                isListItem && styles.listItem,
                line.trim() === '' && { height: 8 },
              ]}
            >
              {line}
            </Text>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Ionicons name="sparkles" size={14} color="#FFFFFF" />
        </View>
      )}

      <View style={styles.bubbleWrapper}>
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: theme.userBubble }]
              : [styles.aiBubble, { backgroundColor: theme.aiBubble, borderColor: theme.border }],
            isError && { backgroundColor: theme.error + '15', borderColor: theme.error },
          ]}
        >
          {renderTextContent(message.text)}

          {/* Timestamp and Action Row */}
          <View style={styles.footerRow}>
            <Text
              style={[
                styles.timestamp,
                { color: isUser ? '#FFFFFF99' : theme.textMuted },
              ]}
            >
              {formatTime(message.timestamp)}
            </Text>

            {!isUser && !isError && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={handleCopy}
                  style={styles.actionBtn}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={copied ? 'checkmark' : 'copy-outline'}
                    size={14}
                    color={copied ? theme.success : theme.textSecondary}
                  />
                  {copied && (
                    <Text style={[styles.copiedBadge, { color: theme.success }]}>Copied</Text>
                  )}
                </TouchableOpacity>

                {isLastAiMessage && onRegenerate && (
                  <TouchableOpacity
                    onPress={onRegenerate}
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="refresh-outline" size={14} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {isError && onRetry && (
              <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
                <Ionicons name="alert-circle-outline" size={14} color={theme.error} />
                <Text style={[styles.retryText, { color: theme.error }]}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  bubbleWrapper: {
    maxWidth: '82%',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  markdownContainer: {
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 4,
  },
  listItem: {
    paddingLeft: 4,
  },
  codeBlock: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 6,
    fontFamily: 'monospace',
  },
  codeText: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 2,
  },
  timestamp: {
    fontSize: 10,
    fontWeight: '400',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copiedBadge: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  retryText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },
});

export default ChatBubble;
