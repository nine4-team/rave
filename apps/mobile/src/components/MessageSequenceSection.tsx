import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MessageSequence } from '../../../../packages/shared/src/types';
import { tokens } from '../theme/tokens';

type MessageSequenceSectionProps = {
  sequence: MessageSequence;
};

const formatTimestamp = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const MessageSequenceSection: React.FC<MessageSequenceSectionProps> = ({ sequence }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const upcomingMessages = sequence.messages
    .filter((message) => message.status === 'unsent' && !message.sentAt)
    .sort((a, b) => a.orderInSequence - b.orderInSequence);
  const nextMessage = upcomingMessages[0];
  const timelineMessages = sequence.messages
    .filter((message) => message.sentAt)
    .sort((a, b) => {
      const aTimestamp = (a.sentAt ?? a.generatedAt).getTime();
      const bTimestamp = (b.sentAt ?? b.generatedAt).getTime();
      return bTimestamp - aTimestamp;
    });

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setIsExpanded((prev) => !prev)}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerIcon}>{isExpanded ? '^' : 'v'}</Text>
      </Pressable>
      {isExpanded ? (
        <View style={styles.content}>
          {nextMessage ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Next</Text>
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{nextMessage.content}</Text>
              </View>
              <View style={styles.actions}>
                <Pressable style={[styles.button, styles.primaryButton]}>
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>Send</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.secondaryButton]}>
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Revise</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.ghostButton]}>
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Sent</Text>
            {timelineMessages.length === 0 ? (
              <Text style={styles.emptyText}>No messages yet.</Text>
            ) : (
              timelineMessages.map((message) => {
                const timestamp = message.sentAt ?? message.generatedAt;
                return (
                  <View key={message.id} style={styles.timelineItem}>
                    <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
                    <View style={styles.messageBox}>
                      <Text style={styles.messageText}>{message.content}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
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
  content: {
    padding: tokens.spacing.xl,
    gap: tokens.spacing.xl,
  },
  section: {
    gap: tokens.spacing.lg,
  },
  sectionLabel: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: tokens.typography.letterSpacingBase,
  },
  messageBox: {
    backgroundColor: tokens.colors.surfaceAlt,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.lg,
  },
  messageText: {
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radii.sm,
  },
  buttonText: {
    fontSize: tokens.fontSizes.md,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: tokens.colors.brand,
  },
  primaryButtonText: {
    color: tokens.colors.surface,
  },
  secondaryButton: {
    backgroundColor: tokens.colors.actionBackground,
  },
  secondaryButtonText: {
    color: tokens.colors.textSecondary,
  },
  ghostButton: {
    backgroundColor: tokens.colors.actionBackgroundSubtle,
  },
  emptyText: {
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textSubtle,
  },
  timelineItem: {
    gap: tokens.spacing.sm,
  },
  timestamp: {
    fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textSubtle,
    textAlign: 'right',
  },
});
