import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NextAction } from '../utils/requestDetail';
import { tokens } from '../theme/tokens';

type NextActionCardProps = {
  action: NextAction;
};

export const NextActionCard: React.FC<NextActionCardProps> = ({ action }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Next</Text>
      <View style={styles.body}>
        <Text style={styles.label}>{action.label}</Text>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{action.message}</Text>
          {action.subtext ? <Text style={styles.subtext}>{action.subtext}</Text> : null}
        </View>
        <View style={styles.actions}>
          {action.actions.map((button) => (
            <Pressable
              key={button.id}
              onPress={button.onPress}
              style={[styles.buttonBase, styles[`button${button.variant}`]]}
            >
              <Text style={[styles.buttonText, styles[`buttonText${button.variant}`]]}>
                {button.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
    backgroundColor: tokens.colors.surface,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: tokens.fontSizes.base,
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
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm,
  },
  messageContainer: {
    backgroundColor: tokens.colors.surfaceAlt,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  message: {
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textPrimary,
  },
  subtext: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    flexWrap: 'wrap',
  },
  buttonBase: {
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonprimary: {
    backgroundColor: tokens.colors.brand,
  },
  buttonsecondary: {
    backgroundColor: tokens.colors.actionBackground,
  },
  buttonghost: {
    backgroundColor: tokens.colors.actionBackgroundSubtle,
  },
  buttonText: {
    fontSize: tokens.fontSizes.md,
    fontWeight: '600',
  },
  buttonTextprimary: {
    color: tokens.colors.surface,
  },
  buttonTextsecondary: {
    color: tokens.colors.textSecondary,
  },
  buttonTextghost: {
    color: tokens.colors.textSecondary,
  },
});
