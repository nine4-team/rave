import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { RequestCard } from '../components/RequestCard';
import { useTheme } from '../theme/theme';

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
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
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

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: tokens.spacing.xxxl,
      paddingVertical: tokens.spacing.huge,
    },
    list: {
      gap: tokens.spacing.xl,
    },
    emptyState: {
      paddingVertical: 48,
      paddingHorizontal: tokens.spacing.xxxl,
      borderRadius: tokens.radii.xl,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: tokens.colors.borderMedium,
      backgroundColor: tokens.colors.surface,
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    emptyTitle: {
      fontSize: tokens.fontSizes.lg,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    emptyDescription: {
      fontSize: tokens.fontSizes.xl,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
    },
  });
