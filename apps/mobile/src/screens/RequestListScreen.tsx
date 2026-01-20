import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { RequestCard } from '../components/RequestCard';
import { useTheme } from '../theme/theme';

type RequestListScreenProps = {
  requests: Request[];
  onSelect: (request: Request) => void;
  emptyTitle: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionIcon?: React.ReactNode;
  onEmptyAction?: () => void;
};

export const RequestListScreen: React.FC<RequestListScreenProps> = ({
  requests,
  onSelect,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionIcon,
  onEmptyAction,
}) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const shouldShowEmptyAction = Boolean(emptyActionLabel && onEmptyAction);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {requests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          {emptyDescription ? (
            <Text style={styles.emptyDescription}>{emptyDescription}</Text>
          ) : null}
          {shouldShowEmptyAction ? (
            <Pressable style={styles.emptyActionButton} onPress={onEmptyAction}>
              <View style={styles.emptyActionContent}>
                {emptyActionIcon ? emptyActionIcon : null}
                <Text style={styles.emptyActionText}>{emptyActionLabel}</Text>
              </View>
            </Pressable>
          ) : null}
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
      borderWidth: 0,
      backgroundColor: 'transparent',
      alignItems: 'center',
      gap: tokens.spacing.md,
    },
    emptyTitle: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '500',
      color: tokens.colors.textSubtle,
    },
    emptyDescription: {
      fontSize: tokens.fontSizes.xl,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
    },
    emptyActionButton: {
      marginTop: tokens.spacing.lg,
      paddingVertical: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.xxl,
      borderRadius: tokens.radii.md,
      backgroundColor: tokens.colors.brand,
    },
    emptyActionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      justifyContent: 'center',
    },
    emptyActionText: {
      fontSize: tokens.fontSizes.sm,
      fontWeight: '600',
      color: tokens.colors.onBrand,
    },
  });
