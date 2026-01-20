import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp, Edit2, Send, Trash2 } from 'lucide-react-native';
import type { MessageSequence } from '../../../../packages/shared/src/types';
import { useTheme } from '../theme/theme';

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
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const [isExpanded, setIsExpanded] = useState(true);
  const upcomingMessages = useMemo(
    () =>
      sequence.messages
        .filter((message) => message.status === 'unsent' && !message.sentAt)
        .sort((a, b) => a.orderInSequence - b.orderInSequence),
    [sequence.messages],
  );
  const nextMessage = upcomingMessages[0];
  const timelineMessages = useMemo(
    () =>
      sequence.messages
        .filter((message) => message.sentAt)
        .sort((a, b) => {
          const aTimestamp = (a.sentAt ?? a.generatedAt).getTime();
          const bTimestamp = (b.sentAt ?? b.generatedAt).getTime();
          return bTimestamp - aTimestamp;
        }),
    [sequence.messages],
  );

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setIsExpanded((prev) => !prev)}>
        <Text style={styles.headerTitle}>Messages</Text>
        {isExpanded ? (
          <ChevronUp size={20} color={tokens.colors.textMuted} />
        ) : (
          <ChevronDown size={20} color={tokens.colors.textMuted} />
        )}
      </Pressable>
      {isExpanded ? (
        <View style={styles.content}>
          {nextMessage ? (
            <View style={[styles.section, styles.sectionFirst]}>
              <View style={styles.sectionDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.sectionDividerText}>Next</Text>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{nextMessage.content}</Text>
              </View>
              <View style={styles.actions}>
                <Pressable style={[styles.button, styles.primaryButton]}>
                  <Send size={16} color={tokens.colors.onBrand} />
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>Send</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.secondaryButton]}>
                  <Edit2 size={16} color={tokens.colors.textDark} />
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Revise</Text>
                </Pressable>
                <Pressable style={[styles.iconButton, styles.secondaryButton]}>
                  <Trash2 size={16} color={tokens.colors.textDark} />
                </Pressable>
              </View>
            </View>
          ) : null}

          {timelineMessages.map((message, index) => {
            const timestamp = message.sentAt ?? message.generatedAt;
            const stageLabel = getStageLabel(message);
            const prevStageLabel =
              index > 0 ? getStageLabel(timelineMessages[index - 1]) : nextMessage ? 'Next' : null;
            const showDivider = index === 0 || stageLabel !== prevStageLabel;
            const showBorder = index > 0 || Boolean(nextMessage);

            return (
              <View
                key={message.id}
                style={[styles.section, showBorder ? styles.sectionBorder : styles.sectionFirst]}
              >
                {showDivider ? (
                  <View style={styles.sectionDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.sectionDividerText}>{stageLabel}</Text>
                    <View style={styles.dividerLine} />
                  </View>
                ) : null}
                <View style={styles.timestampRow}>
                  <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
                </View>
                <View style={styles.messageBox}>
                  <Text style={styles.messageText}>{message.content}</Text>
                </View>
              </View>
            );
          })}
        </View>
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
    content: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.borderLight,
    },
    section: {
      padding: tokens.spacing.xl,
      gap: tokens.spacing.lg,
    },
    sectionFirst: {
      borderTopWidth: 0,
    },
    sectionBorder: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.borderLight,
    },
    sectionDivider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    dividerLine: {
      height: 1,
      flex: 1,
      backgroundColor: tokens.colors.borderLight,
    },
    sectionDividerText: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textSubtle,
      textTransform: 'uppercase',
      letterSpacing: tokens.typography.letterSpacingBase,
    },
    messageBox: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
    },
    messageText: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
    },
    actions: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
      alignItems: 'stretch',
    },
    button: {
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      borderRadius: tokens.radii.sm,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.xs2,
      justifyContent: 'center',
    },
    iconButton: {
      width: tokens.spacing.huge,
      height: tokens.spacing.huge,
      padding: tokens.spacing.sm,
      borderRadius: tokens.radii.sm,
      flex: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
    },
    primaryButton: {
      backgroundColor: tokens.colors.brand,
    },
    primaryButtonText: {
      color: tokens.colors.onBrand,
    },
    secondaryButton: {
      backgroundColor: tokens.colors.actionBackground,
    },
    secondaryButtonText: {
      color: tokens.colors.textDark,
    },
    ghostButton: {
      backgroundColor: tokens.colors.actionBackgroundSubtle,
    },
    timestampRow: {
      alignItems: 'flex-end',
    },
    timestamp: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textSubtle,
    },
  });
