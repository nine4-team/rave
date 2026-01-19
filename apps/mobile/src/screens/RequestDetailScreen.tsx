import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { MessageSequenceSection } from '../components/MessageSequenceSection';
import { ReferralDataSection } from '../components/ReferralDataSection';
import { ReviewActivityTimeline } from '../components/ReviewActivityTimeline';
import { tokens } from '../theme/tokens';

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
        {request.type === 'review' ? (
          <ReviewActivityTimeline request={request} />
        ) : (
          <>
            <MessageSequenceSection sequence={request.messageSequence} />
            {request.referralData ? (
              <ReferralDataSection referralData={request.referralData} />
            ) : null}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.xxl,
    gap: tokens.spacing.xl,
  },
  header: {
    gap: tokens.spacing.xs2,
  },
  contactName: {
    fontSize: tokens.fontSizes.xxl,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  subtext: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
  },
  statusBar: {
    flexDirection: 'row',
    gap: tokens.spacing.xl,
    padding: tokens.spacing.xl,
    borderRadius: tokens.radii.lg,
    backgroundColor: tokens.colors.surfaceAlt,
  },
  statusItem: {
    gap: tokens.spacing.xs,
  },
  statusLabel: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
  },
  statusValue: {
    fontSize: tokens.fontSizes.base,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    textTransform: 'capitalize',
  },
  section: {
    gap: tokens.spacing.lg,
  },
});
