import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Edit2, Send, Trash2 } from 'lucide-react-native';
import type { NextStep } from '../utils/requestDetail';
import { useTheme } from '../theme/theme';
import { MessageCard } from './MessageCard';

type NextStepCardProps = {
  step: NextStep;
  onSend?: () => void;
  onRevise?: () => void;
  onDelete?: () => void;
  onRequestReferral?: () => void;
};

export const NextStepCard: React.FC<NextStepCardProps> = ({
  step,
  onSend,
  onRevise,
  onDelete,
  onRequestReferral,
}) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const deleteAction = step.actions.find((button) => button.id === 'delete');
  const primaryActions = step.actions.filter((button) => button.id !== 'delete');
  const hasMessageContent = Boolean(step.message || step.subtext);
  const getActionIcon = (id: string, color: string) => {
    switch (id) {
      case 'send':
        return <Send size={16} color={color} />;
      case 'revise':
        return <Edit2 size={16} color={color} />;
      case 'delete':
        return <Trash2 size={16} color={color} />;
      default:
        return null;
    }
  };

  const handleActionPress = (actionId: string) => {
    switch (actionId) {
      case 'send':
        onSend?.();
        break;
      case 'revise':
        onRevise?.();
        break;
      case 'delete':
        onDelete?.();
        break;
      case 'request-referral':
        onRequestReferral?.();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Next Step</Text>
        {deleteAction ? (
          <Pressable
            onPress={() =>
              deleteAction.onPress ? deleteAction.onPress() : handleActionPress(deleteAction.id)
            }
            style={styles.deleteButton}
            accessibilityLabel="Delete next step"
          >
            {getActionIcon(deleteAction.id, tokens.colors.textMuted)}
          </Pressable>
        ) : null}
      </View>
      <View style={styles.body}>
        {step.kind !== 'request-referral' ? <Text style={styles.label}>{step.label}</Text> : null}
        {hasMessageContent ? (
          <MessageCard text={step.message || ''} subtext={step.subtext} />
        ) : null}
        <View style={styles.actions}>
          {primaryActions.map((button) => (
            <Pressable
              key={button.id}
              onPress={() => (button.onPress ? button.onPress() : handleActionPress(button.id))}
              style={[
                styles.buttonBase,
                styles[`button${button.variant}`],
              ]}
            >
              <>
                {getActionIcon(
                  button.id,
                  button.variant === 'primary' ? tokens.colors.onBrand : tokens.colors.textDark,
                )}
                <Text style={[styles.buttonText, styles[`buttonText${button.variant}`]]}>
                  {button.label}
                </Text>
              </>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    card: {
      borderRadius: tokens.radii.lg,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surface,
      overflow: 'hidden',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.lg,
      backgroundColor: tokens.colors.surfaceAlt,
    },
    sectionTitle: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    deleteButton: {
      padding: tokens.spacing.xs2,
      borderRadius: tokens.radii.sm,
    },
    body: {
      padding: tokens.spacing.xl,
      gap: tokens.spacing.lg,
    },
    label: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textMuted,
      fontWeight: '300',
    },
    actions: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
      alignItems: 'stretch',
    },
    buttonBase: {
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      borderRadius: tokens.radii.sm,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.xs2,
      justifyContent: 'center',
    },
    buttonprimary: {
      backgroundColor: tokens.colors.brand,
    },
    buttonsecondary: {
      backgroundColor: tokens.colors.actionBackground,
    },
    buttonghost: {
      backgroundColor: tokens.colors.actionBackground,
    },
    buttonText: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
    },
    buttonTextprimary: {
      color: tokens.colors.onBrand,
    },
    buttonTextsecondary: {
      color: tokens.colors.textDark,
    },
    buttonTextghost: {
      color: tokens.colors.textDark,
    },
  });
