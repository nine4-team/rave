import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Archive } from 'lucide-react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { useTheme } from '../theme/theme';

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
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
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
          accessibilityLabel="Archive"
        >
          <Archive size={20} color={tokens.colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.messagePreview}>
        <Text style={styles.messageText} numberOfLines={2}>
          {lastMessage?.content ?? 'No messages yet.'}
        </Text>
        {lastMessage?.sentAt ? (
          <Text style={styles.messageTimestamp}>Sent: {formatDateTime(lastMessage.sentAt)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    card: {
      borderRadius: tokens.radii.lg,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surface,
      padding: tokens.spacing.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: tokens.spacing.lg,
      marginBottom: tokens.spacing.lg,
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
      backgroundColor: tokens.colors.brand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
      color: tokens.colors.surfaceAlt,
    },
    headerInfo: {
      flex: 1,
      gap: tokens.spacing.xs / 2,
    },
    name: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    date: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textSecondary,
    },
    archiveButton: {
      padding: tokens.spacing.sm,
      borderRadius: tokens.radii.sm,
      backgroundColor: 'transparent',
    },
    messagePreview: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
    },
    messageText: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
    },
    messageTimestamp: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textMuted,
      marginTop: tokens.spacing.xs,
    },
  });
