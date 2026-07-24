import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatFullDateTime } from '../utils/formatters';

const SearchModal = ({ visible, onClose, messages, theme }) => {
  const [query, setQuery] = useState('');

  const filteredMessages = query.trim()
    ? messages.filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Search Chat Messages</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchBoxContainer}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={18} color={theme.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search keyword..."
              placeholderTextColor={theme.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {query.trim() === '' ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Type keywords above to search past conversation history.
            </Text>
          </View>
        ) : filteredMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No messages found matching "{query}"
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.resultHeader}>
                  <View style={styles.roleBadge}>
                    <Ionicons
                      name={item.sender === 'user' ? 'person-circle-outline' : 'sparkles'}
                      size={14}
                      color={item.sender === 'user' ? theme.primary : theme.accent}
                    />
                    <Text style={[styles.roleText, { color: theme.textSecondary }]}>
                      {item.sender === 'user' ? 'You' : 'AI Assistant'}
                    </Text>
                  </View>
                  <Text style={[styles.dateText, { color: theme.textMuted }]}>
                    {formatFullDateTime(item.timestamp)}
                  </Text>
                </View>
                <Text style={[styles.messageContent, { color: theme.textPrimary }]} numberOfLines={4}>
                  {item.text}
                </Text>
              </View>
            )}
          />
        )}
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
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  searchBoxContainer: {
    padding: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  resultCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 10,
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SearchModal;
