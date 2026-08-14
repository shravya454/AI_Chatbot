import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Sidebar = ({
  visible,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onOpenSettings,
  onOpenSearch,
  onExportChat,
  isDarkMode,
  onToggleDarkMode,
  theme,
}) => {
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const handleStartRename = (session) => {
    setEditingSessionId(session.id);
    setEditTitleInput(session.title || 'New Chat');
  };

  const handleSaveRename = (sessionId) => {
    if (editTitleInput.trim()) {
      onRenameSession(sessionId, editTitleInput.trim());
    }
    setEditingSessionId(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop tap to close */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* Drawer Content */}
        <View style={[styles.drawer, { backgroundColor: theme.surface, borderRightColor: theme.border }]}>
          {/* Header & Logo */}
          <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.logoRow}>
              <View style={[styles.logoBadge, { backgroundColor: theme.primary }]}>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              </View>
              <Text style={[styles.brandName, { color: theme.textPrimary }]}>NextChat</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* New Chat Button */}
          <View style={styles.newChatSection}>
            <TouchableOpacity
              style={[styles.newChatBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                onNewChat();
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
              <Text style={styles.newChatBtnText}>New Chat</Text>
            </TouchableOpacity>
          </View>

          {/* History List */}
          <View style={styles.historySection}>
            <Text style={[styles.historyLabel, { color: theme.textMuted }]}>Recent Chats</Text>

            {sessions.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Ionicons name="chatbubbles-outline" size={32} color={theme.textMuted} />
                <Text style={[styles.emptyHistoryText, { color: theme.textSecondary }]}>
                  No conversations yet.
                </Text>
              </View>
            ) : (
              <FlatList
                data={sessions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => {
                  const isActive = item.id === activeSessionId;
                  const isEditing = editingSessionId === item.id;

                  return (
                    <View
                      style={[
                        styles.sessionCard,
                        {
                          backgroundColor: isActive ? theme.primaryLight : 'transparent',
                          borderColor: isActive ? theme.primary + '30' : 'transparent',
                        },
                      ]}
                    >
                      {isEditing ? (
                        <View style={styles.editRow}>
                          <TextInput
                            style={[
                              styles.renameInput,
                              {
                                color: theme.textPrimary,
                                borderColor: theme.primary,
                                backgroundColor: theme.inputBg,
                              },
                            ]}
                            value={editTitleInput}
                            onChangeText={setEditTitleInput}
                            autoFocus
                            onSubmitEditing={() => handleSaveRename(item.id)}
                          />
                          <TouchableOpacity
                            onPress={() => handleSaveRename(item.id)}
                            style={styles.saveRenameBtn}
                          >
                            <Ionicons name="checkmark" size={18} color={theme.success} />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.sessionMainClick}
                          onPress={() => {
                            onSelectSession(item.id);
                            onClose();
                          }}
                        >
                          <Ionicons
                            name="chatbox-outline"
                            size={16}
                            color={isActive ? theme.primary : theme.textSecondary}
                          />
                          <View style={styles.sessionTitleContainer}>
                            <Text
                              style={[
                                styles.sessionTitle,
                                {
                                  color: isActive ? theme.primary : theme.textPrimary,
                                  fontWeight: isActive ? '700' : '500',
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {item.title || 'New Chat'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}

                      {!isEditing && (
                        <View style={styles.sessionActions}>
                          <TouchableOpacity
                            onPress={() => handleStartRename(item)}
                            style={styles.actionIcon}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Ionicons name="create-outline" size={15} color={theme.textMuted} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => onDeleteSession(item.id)}
                            style={styles.actionIcon}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Ionicons name="trash-outline" size={15} color={theme.error} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                }}
              />
            )}
          </View>

          {/* Footer Controls */}
          <View style={[styles.drawerFooter, { borderTopColor: theme.border }]}>
            {onOpenSearch && (
              <TouchableOpacity
                style={styles.footerBtn}
                onPress={() => {
                  onClose();
                  onOpenSearch();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="search-outline" size={18} color={theme.textPrimary} />
                <Text style={[styles.footerBtnText, { color: theme.textPrimary }]}>Search Messages</Text>
              </TouchableOpacity>
            )}

            {onExportChat && (
              <TouchableOpacity
                style={styles.footerBtn}
                onPress={() => {
                  onClose();
                  onExportChat();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={18} color={theme.textPrimary} />
                <Text style={[styles.footerBtnText, { color: theme.textPrimary }]}>Export Conversation</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.footerBtn}
              onPress={onToggleDarkMode}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={18}
                color={theme.textPrimary}
              />
              <Text style={[styles.footerBtnText, { color: theme.textPrimary }]}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerBtn}
              onPress={() => {
                onClose();
                onOpenSettings();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={18} color={theme.textPrimary} />
              <Text style={[styles.footerBtnText, { color: theme.textPrimary }]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000060',
  },
  drawer: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    borderRightWidth: 1,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  closeBtn: {
    padding: 4,
  },
  newChatSection: {
    padding: 14,
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 21,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  newChatBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  historySection: {
    flex: 1,
    paddingHorizontal: 12,
  },
  historyLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginVertical: 8,
    marginLeft: 8,
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyHistoryText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 1,
  },
  sessionMainClick: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sessionTitleContainer: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 13.5,
  },
  sessionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionIcon: {
    padding: 4,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  renameInput: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 13,
  },
  saveRenameBtn: {
    padding: 4,
  },
  drawerFooter: {
    padding: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  footerBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
});

export default Sidebar;
