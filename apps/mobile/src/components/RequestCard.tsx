import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Request } from '../../../../packages/shared/src/types';

type RequestCardProps = {
  request: Request;
  onPress?: (request: Request) => void;
};

const statusLabelMap: Record<Request['status'], string> = {
  new: 'New',
  requested: 'Requested',
  'feedback-received': 'Responded',
  reviewed: 'Completed',
  replied: 'Completed',
  'referral-drafted': 'Responded',
  introduced: 'Completed',
  thanked: 'Completed',
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const RequestCard: React.FC<RequestCardProps> = ({ request, onPress }) => {
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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{contactName}</Text>
          <Text style={styles.date}>{formatDate(request.createdAt)}</Text>
        </View>
        {request.actionRequired ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Action Needed</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>{statusLabelMap[request.status]}</Text>
        <Text style={styles.typeLabel}>{request.type}</Text>
      </View>

      <View style={styles.messagePreview}>
        <Text style={styles.messageText} numberOfLines={2}>
          {lastMessage?.content ?? 'No messages yet.'}
        </Text>
        {lastMessage?.sentAt ? (
          <Text style={styles.messageTimestamp}>Sent {formatDate(lastMessage.sentAt)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4C4B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B5D47',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  date: {
    fontSize: 12,
    color: '#888888',
  },
  badge: {
    backgroundColor: '#F5F3EF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#987E55',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444444',
  },
  typeLabel: {
    fontSize: 12,
    color: '#888888',
    textTransform: 'capitalize',
  },
  messagePreview: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  messageText: {
    fontSize: 13,
    color: '#111111',
  },
  messageTimestamp: {
    fontSize: 11,
    color: '#888888',
  },
});
