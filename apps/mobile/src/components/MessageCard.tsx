import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/theme';

type MessageCardProps = {
  text: string;
  subtext?: string;
  timestamp?: string;
  actions?: React.ReactNode;
};

export const MessageCard: React.FC<MessageCardProps> = ({ text, subtext, timestamp, actions }) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);

  return (
    <View style={styles.container}>
      {timestamp ? (
        <View style={styles.timestampRow}>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      ) : null}
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{text}</Text>
        {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
      </View>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    container: {
      gap: tokens.spacing.lg,
    },
    timestampRow: {
      alignItems: 'flex-end',
    },
    timestamp: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textSubtle,
    },
    messageBox: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
    },
    messageText: {
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
  });
