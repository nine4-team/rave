import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Mic,
  Send,
  Type,
  Users,
} from 'lucide-react-native';
import type { ReferralData } from '../../../../packages/shared/src/types';
import { useTheme } from '../theme/theme';

type ReferralDataSectionProps = {
  referralData: ReferralData;
};

const formatTimestamp = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatToneLabel = (tone: string) => tone.charAt(0).toUpperCase() + tone.slice(1);
const getToneIcon = (tone: string) => {
  switch (tone) {
    case 'casual':
      return '😄';
    case 'professional':
      return '💼';
    case 'warm':
      return '🤝';
    default:
      return '•';
  }
};

export const ReferralDataSection: React.FC<ReferralDataSectionProps> = ({ referralData }) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setIsExpanded((prev) => !prev)}>
        <View style={styles.headerTitleRow}>
          <Users size={20} color={tokens.colors.textPrimary} />
          <Text style={styles.headerTitle}>Referral Data</Text>
        </View>
        {isExpanded ? (
          <ChevronUp size={20} color={tokens.colors.textMuted} />
        ) : (
          <ChevronDown size={20} color={tokens.colors.textMuted} />
        )}
      </Pressable>
      {isExpanded ? (
        <View style={styles.content}>
          <View style={[styles.section, styles.sectionFirst]}>
            <Text style={styles.sectionTitle}>Referrer & Targets</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Referrer ID:</Text>
              <Text style={styles.rowValue}>{referralData.referrerId}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Target contacts:</Text>
              <Text style={styles.rowValue}>{referralData.targetContactIds.join(', ')}</Text>
            </View>
          </View>

          {referralData.referrerInput ? (
            <View style={[styles.section, styles.sectionBorder]}>
              <View style={styles.sectionTitleRow}>
                {referralData.referrerInput.inputMethod === 'voice' ? (
                  <Mic size={16} color={tokens.colors.textPrimary} />
                ) : (
                  <Type size={16} color={tokens.colors.textPrimary} />
                )}
                <Text style={styles.sectionTitle}>
                  {referralData.referrerInput.inputMethod === 'voice' ? 'Voice Input' : 'Text Input'}
                </Text>
              </View>
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{referralData.referrerInput.rawInput}</Text>
                <Text style={styles.subtext}>
                  Submitted {formatTimestamp(referralData.referrerInput.submittedAt)}
                </Text>
              </View>
            </View>
          ) : null}

          {referralData.messageVariants ? (
            <View style={[styles.section, styles.sectionBorder]}>
              <Text style={styles.sectionTitle}>Message Variants</Text>
              <View style={styles.variants}>
                {referralData.messageVariants.variants.map((variant) => {
                  const isSelected = referralData.messageVariants?.selectedVariant === variant.tone;
                  return (
                    <View
                      key={variant.tone}
                      style={[styles.variantCard, isSelected ? styles.variantSelected : styles.variantDefault]}
                    >
                      <View style={styles.variantHeader}>
                        <Text style={styles.variantTitle}>
                          {getToneIcon(variant.tone)} {formatToneLabel(variant.tone)}
                        </Text>
                        {isSelected ? (
                          <View style={styles.variantBadge}>
                            <Text style={styles.variantBadgeText}>Selected</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.variantText}>{variant.text}</Text>
                    </View>
                  );
                })}
              </View>
              {referralData.messageVariants.customizationContext ? (
                <View style={styles.customizationBox}>
                  <View style={styles.customizationHeader}>
                    <CheckCircle size={14} color={tokens.colors.warning} />
                    <Text style={styles.customizationLabel}>Customization Applied:</Text>
                  </View>
                  <Text style={styles.customizationText}>
                    "{referralData.messageVariants.customizationContext}"
                  </Text>
                </View>
              ) : null}
              <View style={styles.finalMessage}>
                <View style={styles.finalHeader}>
                  <Send size={14} color={tokens.colors.brand} />
                  <Text style={styles.finalLabel}>Final Message (Will Send):</Text>
                </View>
                <Text style={styles.finalText}>{referralData.messageVariants.finalMessage}</Text>
              </View>
            </View>
          ) : null}

          <View style={[styles.section, styles.sectionBorder, styles.statusSection]}>
            <Text style={styles.sectionTitle}>Send Status</Text>
            {referralData.sentAt ? (
              <View style={styles.statusRow}>
                <CheckCircle size={16} color={tokens.colors.success} />
                <Text style={styles.sentText}>Sent {formatTimestamp(referralData.sentAt)}</Text>
              </View>
            ) : (
              <View style={styles.statusRow}>
                <Clock size={16} color={tokens.colors.warningPending} />
                <Text style={styles.pendingText}>Pending send</Text>
              </View>
            )}
          </View>
        </View>
      ) : null}
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
    header: {
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.lg,
      backgroundColor: tokens.colors.surfaceAlt,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    headerTitle: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    content: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.borderLight,
    },
    section: {
      padding: tokens.spacing.xl,
      gap: tokens.spacing.sm,
    },
    sectionFirst: {
      borderTopWidth: 0,
    },
    sectionBorder: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.borderLight,
    },
    sectionTitle: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.xs,
    },
    rowLabel: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.textMuted,
    },
    rowValue: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.textPrimary,
      fontWeight: '600',
    },
    messageBox: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.xs2,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
    },
    messageText: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
    },
    subtext: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textSubtle,
    },
    variants: {
      gap: tokens.spacing.md,
    },
    variantCard: {
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
      borderWidth: 2,
    },
    variantSelected: {
      borderColor: tokens.colors.brand,
      backgroundColor: tokens.colors.brandMuted,
    },
    variantDefault: {
      borderColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surfaceAlt,
    },
    variantHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: tokens.spacing.sm,
      marginBottom: tokens.spacing.xs2,
    },
    variantTitle: {
      fontSize: tokens.fontSizes.sm,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    variantBadge: {
      backgroundColor: tokens.colors.brand,
      borderRadius: tokens.radii.sm,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
    },
    variantBadgeText: {
      fontSize: tokens.fontSizes.xs,
      fontWeight: '600',
      color: tokens.colors.onBrand,
    },
    variantText: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.textPrimary,
    },
    customizationBox: {
      backgroundColor: '#FFF8E1',
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
      borderWidth: 1,
      borderColor: '#FFF0B5',
      gap: tokens.spacing.xs2,
    },
    customizationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    customizationLabel: {
      fontSize: tokens.fontSizes.xs,
      fontWeight: '600',
      color: tokens.colors.warning,
    },
    customizationText: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.warning,
      fontStyle: 'italic',
    },
    finalMessage: {
      backgroundColor: tokens.colors.brandMuted,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
      gap: tokens.spacing.xs2,
      borderWidth: 1,
      borderColor: '#D4C4B0',
    },
    finalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    finalLabel: {
      fontSize: tokens.fontSizes.sm,
      fontWeight: '600',
      color: tokens.colors.brand,
    },
    finalText: {
      fontSize: tokens.fontSizes.md,
      color: tokens.colors.brand,
    },
    statusSection: {
      backgroundColor: tokens.colors.brandMuted,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    sentText: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.success,
    },
    pendingText: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.warningPending,
    },
  });
