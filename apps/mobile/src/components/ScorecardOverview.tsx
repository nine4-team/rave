import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Handshake, Star } from 'lucide-react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { useTheme } from '../theme/theme';

type MetricItem = {
  label: string;
  value: string | number;
};

type MetricRow = {
  title: 'Reviews' | 'Referrals';
  items: MetricItem[];
};

type ScorecardOverviewProps = {
  requests: Request[];
};

export const ScorecardOverview: React.FC<ScorecardOverviewProps> = ({ requests }) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const overviewMetrics = useMemo<MetricRow[]>(() => {
    const activeRequests = requests.filter((request) => !request.archivedAt);

    const reviewRequestsMade = activeRequests.filter(
      (request) => request.type === 'review' && request.status !== 'new',
    ).length;
    const reviewReviewsReceived = activeRequests.filter(
      (request) => request.type === 'review' && ['reviewed', 'replied'].includes(request.status),
    ).length;
    const reviewConversion = reviewRequestsMade
      ? Math.round((reviewReviewsReceived / reviewRequestsMade) * 100)
      : 0;

    const referralRequestsMade = activeRequests.filter(
      (request) => request.type === 'referral' && request.status !== 'new',
    ).length;
    const referralIntrosMade = activeRequests.filter(
      (request) => request.type === 'referral' && ['introduced', 'thanked'].includes(request.status),
    ).length;
    const referralConversion = referralRequestsMade
      ? Math.round((referralIntrosMade / referralRequestsMade) * 100)
      : 0;

    return [
      {
        title: 'Reviews',
        items: [
          { label: 'Requests', value: reviewRequestsMade },
          { label: 'Reviews', value: reviewReviewsReceived },
          { label: 'Conversion', value: `${reviewConversion}%` },
        ],
      },
      {
        title: 'Referrals',
        items: [
          { label: 'Requests', value: referralRequestsMade },
          { label: 'Intros', value: referralIntrosMade },
          { label: 'Conversion', value: `${referralConversion}%` },
        ],
      },
    ];
  }, [requests]);

  return (
    <View style={styles.container}>
      {overviewMetrics.map((row) => (
        <View key={row.title} style={styles.card}>
          <View style={styles.cardHeader}>
            {row.title === 'Reviews' ? (
              <Star size={tokens.iconSizes.sm} color={tokens.colors.brand} />
            ) : (
              <Handshake size={tokens.iconSizes.sm} color={tokens.colors.brand} />
            )}
            <Text style={styles.cardTitle}>{row.title}</Text>
          </View>
          <View style={styles.metricsRow}>
            {row.items.map((item) => (
              <View key={item.label} style={styles.metricItem}>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    container: {
      gap: tokens.spacing.xl,
    },
    card: {
      borderRadius: tokens.radii.xl,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surface,
      padding: tokens.spacing.xxl,
      gap: tokens.spacing.xl,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    cardTitle: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    metricsRow: {
      flexDirection: 'row',
    },
    metricItem: {
      flex: 1,
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    metricLabel: {
      fontSize: tokens.fontSizes.sm,
      textTransform: 'uppercase',
      letterSpacing: tokens.typography.letterSpacingWide,
      color: tokens.colors.textMuted,
    },
    metricValue: {
      fontSize: tokens.fontSizes.xxxl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
  });
