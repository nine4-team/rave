import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { HistoryTimeline } from './HistoryTimeline';
import { NextActionCard } from './NextActionCard';
import { buildHistoryItems, getNextAction } from '../utils/requestDetail';
import { tokens } from '../theme/tokens';

type ReviewActivityTimelineProps = {
  request: Request;
};

export const ReviewActivityTimeline: React.FC<ReviewActivityTimelineProps> = ({ request }) => {
  const nextAction = getNextAction(request);
  const historyItems = buildHistoryItems(request);

  return (
    <View style={styles.container}>
      {nextAction ? <NextActionCard action={nextAction} /> : null}
      <HistoryTimeline items={historyItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.xl,
  },
});
