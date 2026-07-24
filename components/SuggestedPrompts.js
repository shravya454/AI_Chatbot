import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEFAULT_SUGGESTIONS } from '../utils/constants';

const SuggestedPrompts = ({ onSelectPrompt, theme }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.heading, { color: theme.textSecondary }]}>Suggested Prompts</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {DEFAULT_SUGGESTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.chip,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => onSelectPrompt(item.label)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={15} color={theme.primary} style={styles.icon} />
            <Text style={[styles.label, { color: theme.textPrimary }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  heading: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 16,
    marginBottom: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default SuggestedPrompts;
