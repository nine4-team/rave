import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HistoryItem } from '../utils/requestDetail';
import { tokens } from '../theme/tokens';

type HistoryTimelineProps = {
  items: HistoryItem[];
};

const formatTimestamp = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setIsExpanded((prev) => !prev)}>
        <Text style={styles.headerTitle}>History</Text>
        <Text style={styles.headerIcon}>{isExpanded ? '^' : 'v'}</Text>
      </Pressable>
      {isExpanded ? (
        items.length === 0 ? (
          <Text style={styles.emptyText}>No activity yet.</Text>
        ) : (
          <View style={styles.itemsContainer}>
            {items.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemTimestamp}>{formatTimestamp(item.timestamp)}</Text>
                </View>
                {item.body ? (
                  <View style={styles.itemBody}>
                    <Text style={styles.itemBodyText}>{item.body}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
    backgroundColor: tokens.colors.surface,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    backgroundColor: tokens.colors.surfaceAlt,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: tokens.fontSizes.base,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  headerIcon: {
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textMuted,
  },
  emptyText: {
    padding: tokens.spacing.xl,
    color: tokens.colors.textMuted,
    fontSize: tokens.fontSizes.md,
  },
  itemsContainer: {
    gap: tokens.spacing.lg,
    padding: tokens.spacing.xl,
  },
  item: {
    gap: tokens.spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacing.lg,
  },
  itemTitle: {
    fontSize: tokens.fontSizes.md,
    fontWeight: '600',
    color: tokens.colors.textDark,
    flex: 1,
  },
  itemTimestamp: {
    fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textSubtle,
  },
  itemBody: {
    backgroundColor: tokens.colors.surfaceAlt,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.lg,
  },
  itemBodyText: {
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary,
  },
});
