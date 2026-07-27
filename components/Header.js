import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({
  title = 'NextChat',
  onOpenSidebar,
  onNewChat,
  isDarkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenSettings,
  onExportChat,
  onClearHistory,
  theme,
}) => {
  const handleDirectClear = () => {
    onClearHistory();
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      {/* Sidebar Toggle & App Title */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={onOpenSidebar}
          style={styles.menuBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="menu-outline" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onOpenSidebar} style={styles.titleContainer} activeOpacity={0.8}>
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: theme.success }]} />
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>Gemini 2.5</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Header Action Buttons */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={onNewChat}
          style={[styles.newChatHeaderBtn, { backgroundColor: theme.primaryLight }]}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={20} color={theme.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenSearch}
          style={styles.iconBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="search-outline" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggleDarkMode}
          style={styles.iconBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onExportChat}
          style={styles.iconBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="download-outline" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenSettings}
          style={styles.iconBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="settings-outline" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  menuBtn: {
    padding: 6,
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newChatHeaderBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  iconBtn: {
    padding: 4,
  },
});

export default Header;
