import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { RequestCard } from '../components/RequestCard';
import { tokens } from '../theme/tokens';

type RequestListScreenProps = {
  requests: Request[];
  onSelect: (request: Request) => void;
  emptyTitle: string;
  emptyDescription: string;
};

export const RequestListScreen: React.FC<RequestListScreenProps> = ({
  requests,
  onSelect,
  emptyTitle,
  emptyDescription,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {requests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.emptyDescription}>{emptyDescription}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} onPress={onSelect} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.xxl,
  },
  list: {
    gap: tokens.spacing.xl,
  },
  emptyState: {
    paddingVertical: tokens.spacing.huge,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens.colors.borderMedium,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  emptyTitle: {
    fontSize: tokens.fontSizes.xl,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  emptyDescription: {
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
  },
});
