import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckCircle, ChevronDown, ChevronUp, Frown, Meh, Send, Smile, Star, Type } from 'lucide-react-native';
import type { HistoryItem } from '../utils/requestDetail';
import { useTheme } from '../theme/theme';

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
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const [isExpanded, setIsExpanded] = useState(true);
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [items],
  );

  const getRatingIcon = (value: number) => {
    switch (value) {
      case 1:
      case 2:
        return <Frown size={20} color={tokens.colors.success} />;
      case 3:
        return <Meh size={20} color={tokens.colors.success} />;
      case 4:
      case 5:
        return <Smile size={20} color={tokens.colors.success} />;
      default:
        return <Meh size={20} color={tokens.colors.success} />;
    }
  };

  const renderIcon = (icon: HistoryItem['icon']) => {
    switch (icon) {
      case 'send':
        return <Send size={20} color={tokens.colors.brand} />;
      case 'feedback':
        return <CheckCircle size={20} color={tokens.colors.brand} />;
      case 'review-posted':
        return <Star size={20} color={tokens.colors.brand} />;
      case 'referrer-input':
        return <Type size={20} color={tokens.colors.textSecondary} />;
      case 'intro-sent':
        return <Send size={20} color={tokens.colors.brand} />;
      case 'intro-success':
        return <CheckCircle size={20} color={tokens.colors.brand} />;
      default:
        return <Type size={20} color={tokens.colors.textSecondary} />;
    }
  };

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setIsExpanded((prev) => !prev)}>
        <Text style={styles.headerTitle}>History</Text>
        {isExpanded ? (
          <ChevronUp size={20} color={tokens.colors.textMuted} />
        ) : (
          <ChevronDown size={20} color={tokens.colors.textMuted} />
        )}
      </Pressable>
      {isExpanded ? (
        sortedItems.length === 0 ? (
          <Text style={styles.emptyText}>No activity yet.</Text>
        ) : (
          <View style={styles.itemsContainer}>
            {sortedItems.map((item, index) => (
              <View key={item.id} style={[styles.item, index > 0 ? styles.itemBorder : null]}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <View style={styles.itemIcon}>{renderIcon(item.icon)}</View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.itemTimestamp}>{formatTimestamp(item.timestamp)}</Text>
                </View>
                {item.icon === 'feedback' && (item.rating || item.feedbackText) ? (
                  <View style={styles.itemBody}>
                    <View style={styles.feedbackContent}>
                      {item.rating ? (
                        <View style={styles.feedbackRow}>
                          {getRatingIcon(item.rating)}
                          <Text style={styles.feedbackRating}>{item.rating}/5</Text>
                        </View>
                      ) : null}
                      {item.feedbackText ? (
                        <View
                          style={[
                            styles.feedbackTextContainer,
                            item.rating ? styles.feedbackDivider : null,
                          ]}
                        >
                          <Text style={styles.feedbackText}>{item.feedbackText}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ) : item.body ? (
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

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
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
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    emptyText: {
      padding: tokens.spacing.xl,
      color: tokens.colors.textMuted,
      fontSize: tokens.fontSizes.base,
    },
    itemsContainer: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.borderLight,
    },
    item: {
      padding: tokens.spacing.xxl,
      gap: tokens.spacing.sm,
    },
    itemBorder: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.borderLight,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.lg,
    },
    itemHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.md,
      flex: 1,
    },
    itemIcon: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemTitle: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
      color: tokens.colors.textSecondary,
      flex: 1,
    },
    itemTimestamp: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textSubtle,
    },
    itemBody: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.xl,
    },
    itemBodyText: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
    },
    feedbackContent: {
      gap: tokens.spacing.sm,
    },
    feedbackRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    feedbackRating: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textSecondary,
    },
    feedbackDivider: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.borderLight,
      paddingTop: tokens.spacing.sm,
    },
    feedbackTextContainer: {},
    feedbackText: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
    },
  });
