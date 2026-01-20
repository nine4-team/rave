import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Edit2, Send, Trash2 } from 'lucide-react-native';
import type { NextAction } from '../utils/requestDetail';
import { useTheme } from '../theme/theme';

type NextActionCardProps = {
  action: NextAction;
};

export const NextActionCard: React.FC<NextActionCardProps> = ({ action }) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
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

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Next</Text>
      <View style={styles.body}>
        {action.kind !== 'request-referral' ? <Text style={styles.label}>{action.label}</Text> : null}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{action.message}</Text>
          {action.subtext ? <Text style={styles.subtext}>{action.subtext}</Text> : null}
        </View>
        <View style={styles.actions}>
          {action.actions.map((button) => (
            <Pressable
              key={button.id}
              onPress={button.onPress}
              style={[
                styles.buttonBase,
                styles[`button${button.variant}`],
                button.id === 'delete' ? styles.iconOnlyButton : null,
              ]}
            >
              {button.id === 'delete'
                ? getActionIcon(button.id, tokens.colors.textDark)
                : (
                  <>
                    {getActionIcon(
                      button.id,
                      button.variant === 'primary' ? tokens.colors.onBrand : tokens.colors.textDark,
                    )}
                    <Text style={[styles.buttonText, styles[`buttonText${button.variant}`]]}>
                      {button.label}
                    </Text>
                  </>
                )}
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
    sectionTitle: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.lg,
      backgroundColor: tokens.colors.surfaceAlt,
    },
    body: {
      padding: tokens.spacing.xl,
    },
    label: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textMuted,
      fontWeight: '300',
      marginBottom: tokens.spacing.sm,
    },
    messageContainer: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
      marginBottom: tokens.spacing.lg,
    },
    message: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
    },
    subtext: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textSecondary,
      marginTop: tokens.spacing.sm,
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
    iconOnlyButton: {
      width: tokens.spacing.huge,
      height: tokens.spacing.huge,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.sm,
      flex: 0,
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
