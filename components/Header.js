import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({
  title = 'NextChat',
  modelName = 'Gemini Flash',
  onOpenSidebar,
  onNewChat,
  isDarkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenSettings,
  onExportChat,
  theme,
}) => {
  const displayModel = modelName
    ? modelName.replace('gemini-', 'Gemini ').replace('-latest', ' Flash').replace('-preview', '')
    : 'Gemini Flash';

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
      ]}
    >
      {/* Left: Sidebar Menu Button */}
      <TouchableOpacity
        onPress={onOpenSidebar}
        style={styles.menuBtn}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="menu" size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      {/* Center: Gemini/ChatGPT Model Selector Pill */}
      <TouchableOpacity
        onPress={onOpenSettings}
        style={[
          styles.modelPill,
          {
            backgroundColor: theme.surfaceVariant,
            borderColor: theme.border,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={[styles.modelDot, { backgroundColor: theme.success }]} />
        <Text
          style={[styles.modelPillText, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {displayModel}
        </Text>
        <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
      </TouchableOpacity>

      {/* Right: Clean Action Buttons (New Chat & More Options) */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={onNewChat}
          style={[styles.actionBtn, { backgroundColor: theme.primaryLight }]}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="create-outline" size={20} color={theme.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenSettings}
          style={[styles.actionBtn, { backgroundColor: theme.surfaceVariant }]}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    maxWidth: '55%',
  },
  modelDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  modelPillText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
