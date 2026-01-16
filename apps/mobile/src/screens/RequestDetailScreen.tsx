import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { HistoryTimeline } from '../components/HistoryTimeline';
import { NextActionCard } from '../components/NextActionCard';
import { buildHistoryItems, getNextAction } from '../utils/requestDetail';

type RequestDetailScreenProps = {
  request: Request;
};

const getStatusLabel = (status: Request['status']) => {
  switch (status) {
    case 'new':
      return 'New';
    case 'requested':
      return 'Requested';
    case 'feedback-received':
      return 'Feedback In';
    case 'referral-drafted':
      return 'Referral Drafted';
    case 'reviewed':
      return 'Review Posted';
    case 'replied':
      return 'Replied';
    case 'introduced':
      return 'Intro Made';
    case 'thanked':
      return 'Thanked';
    default:
      return status;
  }
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({ request }) => {
  const contactName = request.contactSnapshot?.displayName ?? request.contactId;
  const nextAction = getNextAction(request);
  const historyItems = buildHistoryItems(request);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.contactName}>{contactName}</Text>
        <Text style={styles.subtext}>Created {formatDate(request.createdAt)}</Text>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={styles.statusValue}>{getStatusLabel(request.status)}</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Type</Text>
          <Text style={styles.statusValue}>{request.type}</Text>
        </View>
      </View>

      <View style={styles.section}>
        {nextAction ? <NextActionCard action={nextAction} /> : null}
      </View>

      <View style={styles.section}>
        <HistoryTimeline items={historyItems} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  contactName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  subtext: {
    fontSize: 12,
    color: '#888888',
  },
  statusBar: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
  },
  statusItem: {
    gap: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#888888',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    textTransform: 'capitalize',
  },
  section: {
    gap: 12,
  },
});
