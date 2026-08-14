import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEFAULT_SUGGESTIONS } from '../utils/constants';

const SuggestedPrompts = ({ onSelectPrompt, theme }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme.textSecondary }]}>
        Suggested Prompts
      </Text>
      <View style={styles.grid}>
        {DEFAULT_SUGGESTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => onSelectPrompt(item.prompt || item.title)}
            activeOpacity={0.75}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name={item.icon} size={18} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text
                style={[styles.cardTitle, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {item.subtitle}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={14} color={theme.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  heading: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  grid: {
    gap: 10,
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default SuggestedPrompts;
