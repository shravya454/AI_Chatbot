import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({
  title = 'Gemini AI Assistant',
  isDarkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenSettings,
  onExportChat,
  onClearHistory,
  theme,
}) => {
  const handleConfirmClear = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
        onClearHistory();
      }
    } else {
      Alert.alert(
        'Clear Chat History',
        'Are you sure you want to delete all messages? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear All', style: 'destructive', onPress: onClearHistory },
        ]
      );
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      {/* Title & Avatar Info */}
      <View style={styles.leftSection}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="sparkles" size={20} color={theme.primary} />
          <View style={[styles.onlineIndicator, { backgroundColor: theme.success }]} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>Online • Gemini 2.5</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.rightSection}>
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

        <TouchableOpacity
          onPress={handleConfirmClear}
          style={styles.iconBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={20} color={theme.error} />
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
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  titleContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    padding: 4,
  },
});

export default Header;
