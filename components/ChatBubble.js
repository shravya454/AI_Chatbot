import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { formatTime } from '../utils/formatters';

const ChatBubble = ({ message, isLastAiMessage, onRegenerate, onRetry, theme }) => {
  const [copied, setCopied] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

  const isUser = message.sender === 'user';
  const isError = message.isError;

  const handleCopyMessage = async () => {
    try {
      await Clipboard.setStringAsync(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard copy error:', e);
    }
  };

  const handleCopyCode = async (codeStr, idx) => {
    try {
      await Clipboard.setStringAsync(codeStr);
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 2000);
    } catch (e) {
      console.error('Code copy error:', e);
    }
  };

  /**
   * Helper to format inline bold (**text**) and inline code (`text`)
   */
  const renderInlineFormattedText = (rawText, textColor, keyPrefix = '') => {
    const parts = rawText.split(/(\*\*.*?\*\*|`.*?`)/g);

    return (
      <Text style={[styles.messageText, { color: textColor }]}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            return (
              <Text key={`${keyPrefix}-b-${i}`} style={styles.boldText}>
                {part.slice(2, -2)}
              </Text>
            );
          }
          if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
            return (
              <Text
                key={`${keyPrefix}-c-${i}`}
                style={[
                  styles.inlineCode,
                  {
                    backgroundColor: theme.surfaceVariant,
                    color: theme.primary,
                  },
                ]}
              >
                {` ${part.slice(1, -1)} `}
              </Text>
            );
          }
          return <Text key={`${keyPrefix}-t-${i}`}>{part}</Text>;
        })}
      </Text>
    );
  };

  /**
   * Parses message content into structured blocks
   */
  const renderFormattedBlocks = (fullText) => {
    if (isUser) {
      return (
        <Text style={[styles.messageText, { color: theme.userBubbleText }]}>
          {fullText}
        </Text>
      );
    }

    const blocks = [];
    const lines = fullText.split('\n');
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          blocks.push({
            type: 'code',
            language: codeLanguage || 'code',
            content: codeLines.join('\n'),
          });
          inCodeBlock = false;
          codeLanguage = '';
          codeLines = [];
        } else {
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).trim();
          codeLines = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Headers (###, ##, #)
      if (line.startsWith('#')) {
        const headerLevel = line.match(/^#+/)[0].length;
        const headerText = line.replace(/^#+\s*/, '');
        blocks.push({
          type: 'header',
          level: headerLevel,
          text: headerText,
        });
        continue;
      }

      // Bullet or numbered lists
      const listMatch = line.trim().match(/^([-*]|\d+\.)\s+(.*)/);
      if (listMatch) {
        blocks.push({
          type: 'list_item',
          bullet: listMatch[1],
          text: listMatch[2],
        });
        continue;
      }

      // Horizontal dividers
      if (line.trim() === '---' || line.trim() === '***') {
        blocks.push({ type: 'divider' });
        continue;
      }

      // Spacers
      if (line.trim() === '') {
        blocks.push({ type: 'spacer' });
        continue;
      }

      // Standard paragraph
      blocks.push({
        type: 'paragraph',
        text: line,
      });
    }

    if (inCodeBlock && codeLines.length > 0) {
      blocks.push({
        type: 'code',
        language: codeLanguage || 'code',
        content: codeLines.join('\n'),
      });
    }

    return (
      <View style={styles.blocksContainer}>
        {blocks.map((block, idx) => {
          if (block.type === 'code') {
            const isCodeCopied = copiedCodeIdx === idx;
            return (
              <View
                key={`block-${idx}`}
                style={[
                  styles.codeCard,
                  { backgroundColor: theme.surfaceVariant, borderColor: theme.border },
                ]}
              >
                <View style={[styles.codeHeader, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.codeLangText, { color: theme.textSecondary }]}>
                    {block.language}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleCopyCode(block.content, idx)}
                    style={styles.copyCodeBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isCodeCopied ? 'checkmark' : 'copy-outline'}
                      size={13}
                      color={isCodeCopied ? theme.success : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.copyCodeText,
                        { color: isCodeCopied ? theme.success : theme.textSecondary },
                      ]}
                    >
                      {isCodeCopied ? 'Copied' : 'Copy code'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.codeBodyText, { color: theme.textPrimary }]} selectable>
                  {block.content}
                </Text>
              </View>
            );
          }

          if (block.type === 'header') {
            const fontSize = block.level === 1 ? 18 : block.level === 2 ? 16 : 15;
            return (
              <Text
                key={`block-${idx}`}
                style={[
                  styles.headerText,
                  { fontSize, color: theme.textPrimary },
                ]}
              >
                {block.text}
              </Text>
            );
          }

          if (block.type === 'list_item') {
            return (
              <View key={`block-${idx}`} style={styles.listRow}>
                <View style={[styles.bulletDot, { backgroundColor: theme.primary }]} />
                <View style={styles.listContent}>
                  {renderInlineFormattedText(block.text, theme.aiBubbleText, `list-${idx}`)}
                </View>
              </View>
            );
          }

          if (block.type === 'divider') {
            return (
              <View
                key={`block-${idx}`}
                style={[styles.divider, { backgroundColor: theme.border }]}
              />
            );
          }

          if (block.type === 'spacer') {
            return <View key={`block-${idx}`} style={styles.spacer} />;
          }

          return (
            <View key={`block-${idx}`} style={styles.paragraphWrapper}>
              {renderInlineFormattedText(block.text, theme.aiBubbleText, `p-${idx}`)}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {/* AI Sparkle Avatar on Left */}
      {!isUser && (
        <View
          style={[
            styles.avatar,
            { backgroundColor: isError ? theme.error : theme.primary },
          ]}
        >
          <Ionicons
            name={isError ? 'alert' : 'sparkles'}
            size={14}
            color="#FFFFFF"
          />
        </View>
      )}

      {/* Message Content Container */}
      <View style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: theme.userBubble }]
              : [
                  styles.aiBubble,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ],
            isError && {
              backgroundColor: theme.error + '15',
              borderColor: theme.error,
            },
          ]}
        >
          {renderFormattedBlocks(message.text)}
        </View>

        {/* Clean Action Footer under message */}
        <View style={[styles.footerRow, isUser && styles.userFooterRow]}>
          <Text
            style={[
              styles.timestamp,
              { color: theme.textMuted },
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>

          {!isUser && !isError && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={handleCopyMessage}
                style={styles.actionBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={15}
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
                  <Ionicons name="refresh-outline" size={15} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {isError && onRetry && (
            <TouchableOpacity onPress={onRetry} style={styles.retryBtn} activeOpacity={0.7}>
              <Ionicons name="reload" size={13} color={theme.error} />
              <Text style={[styles.retryText, { color: theme.error }]}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  bubbleWrapper: {
    flex: 1,
  },
  userWrapper: {
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  aiWrapper: {
    maxWidth: '90%',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    borderRadius: 20,
    borderBottomRightRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  aiBubble: {
    borderRadius: 18,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0.2,
  },
  boldText: {
    fontWeight: '700',
  },
  inlineCode: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
    borderRadius: 4,
  },
  blocksContainer: {
    flexDirection: 'column',
    gap: 3,
  },
  paragraphWrapper: {
    marginVertical: 2,
  },
  headerText: {
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
    marginRight: 10,
  },
  listContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    width: '100%',
  },
  spacer: {
    height: 6,
  },
  codeCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  codeLangText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  copyCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  copyCodeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  codeBodyText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 19,
    padding: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
    gap: 12,
  },
  userFooterRow: {
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  copiedBadge: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  retryText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ChatBubble;
