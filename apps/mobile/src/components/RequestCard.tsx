import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { tokens } from '../theme/tokens';

type RequestCardProps = {
  request: Request;
  onPress?: (request: Request) => void;
  onArchive?: (request: Request) => void;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const formatDateTime = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const RequestCard: React.FC<RequestCardProps> = ({ request, onPress, onArchive }) => {
  const lastMessage = request.messageSequence.messages[request.messageSequence.messages.length - 1];
  const contactName = request.contactSnapshot?.displayName ?? request.contactId;
  const initials =
    request.contactSnapshot?.initials ??
    contactName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(request)}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{contactName}</Text>
          <Text style={styles.date}>{formatDate(request.createdAt)}</Text>
        </View>
          </View>
        <Pressable
          onPress={(event) => {
            event.stopPropagation?.();
            onArchive?.(request);
          }}
          style={styles.archiveButton}
        >
          <Text style={styles.archiveText}>Archive</Text>
        </Pressable>
      </View>

      <View style={styles.messagePreview}>
        <Text style={styles.messageText} numberOfLines={2}>
          {lastMessage?.content ?? 'No messages yet.'}
        </Text>
        {lastMessage?.sentAt ? (
          <Text style={styles.messageTimestamp}>Sent {formatDateTime(lastMessage.sentAt)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.lg,
    flex: 1,
  },
  avatar: {
    width: tokens.sizes.avatar,
    height: tokens.sizes.avatar,
    borderRadius: tokens.sizes.avatar / 2,
    backgroundColor: tokens.colors.avatarBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: tokens.fontSizes.base,
    fontWeight: '600',
    color: tokens.colors.avatarText,
  },
  headerInfo: {
    flex: 1,
    gap: tokens.spacing.xs / 2,
  },
  name: {
    fontSize: tokens.fontSizes.lg,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  date: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
  },
  archiveButton: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs2,
    borderRadius: tokens.radii.sm,
    backgroundColor: tokens.colors.actionBackground,
  },
  archiveText: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textSecondary,
    fontWeight: '600',
  },
  messagePreview: {
    backgroundColor: tokens.colors.surfaceAlt,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.xs2,
  },
  messageText: {
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary,
  },
  messageTimestamp: {
    fontSize: tokens.fontSizes.xs,
    color: tokens.colors.textMuted,
  },
});
