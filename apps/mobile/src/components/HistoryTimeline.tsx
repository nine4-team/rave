import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HistoryItem } from '../utils/requestDetail';

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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  headerIcon: {
    fontSize: 14,
    color: '#888888',
  },
  emptyText: {
    padding: 16,
    color: '#888888',
    fontSize: 13,
  },
  itemsContainer: {
    gap: 12,
    padding: 16,
  },
  item: {
    gap: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
    flex: 1,
  },
  itemTimestamp: {
    fontSize: 11,
    color: '#999999',
  },
  itemBody: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
  },
  itemBodyText: {
    fontSize: 13,
    color: '#111111',
  },
});
