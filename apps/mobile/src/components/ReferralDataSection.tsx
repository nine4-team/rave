import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReferralData } from '../../../../packages/shared/src/types';
import { tokens } from '../theme/tokens';

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

export const ReferralDataSection: React.FC<ReferralDataSectionProps> = ({ referralData }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setIsExpanded((prev) => !prev)}>
        <Text style={styles.headerTitle}>Referral Data</Text>
        <Text style={styles.headerIcon}>{isExpanded ? '^' : 'v'}</Text>
      </Pressable>
      {isExpanded ? (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Referrer & Targets</Text>
            <Text style={styles.rowLabel}>Referrer ID</Text>
            <Text style={styles.rowValue}>{referralData.referrerId}</Text>
            <Text style={styles.rowLabel}>Target contacts</Text>
            <Text style={styles.rowValue}>{referralData.targetContactIds.join(', ')}</Text>
          </View>

          {referralData.referrerInput ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {referralData.referrerInput.inputMethod === 'voice' ? 'Voice Input' : 'Text Input'}
              </Text>
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{referralData.referrerInput.rawInput}</Text>
                <Text style={styles.subtext}>
                  Submitted {formatTimestamp(referralData.referrerInput.submittedAt)}
                </Text>
              </View>
            </View>
          ) : null}

          {referralData.messageVariants ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Message Variants</Text>
              <View style={styles.variants}>
                {referralData.messageVariants.variants.map((variant) => {
                  const isSelected = referralData.messageVariants?.selectedVariant === variant.tone;
                  return (
                    <View
                      key={variant.tone}
                      style={[styles.variantCard, isSelected ? styles.variantSelected : styles.variantDefault]}
                    >
                      <Text style={styles.variantTitle}>
                        {formatToneLabel(variant.tone)}
                        {isSelected ? ' · Selected' : ''}
                      </Text>
                      <Text style={styles.variantText}>{variant.text}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.finalMessage}>
                <Text style={styles.finalLabel}>Final Message</Text>
                <Text style={styles.finalText}>{referralData.messageVariants.finalMessage}</Text>
              </View>
            </View>
          ) : null}

          <View style={[styles.section, styles.statusSection]}>
            <Text style={styles.sectionTitle}>Send Status</Text>
            {referralData.sentAt ? (
              <Text style={styles.sentText}>Sent {formatTimestamp(referralData.sentAt)}</Text>
            ) : (
              <Text style={styles.pendingText}>Pending send</Text>
            )}
          </View>
        </View>
      ) : null}
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
  header: {
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    backgroundColor: tokens.colors.surfaceAlt,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: tokens.fontSizes.base,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  headerIcon: {
    fontSize: tokens.fontSizes.base,
    color: tokens.colors.textMuted,
  },
  content: {
    padding: tokens.spacing.xl,
    gap: tokens.spacing.xl,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: tokens.fontSizes.md,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  rowLabel: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
  },
  rowValue: {
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary,
  },
  messageBox: {
    backgroundColor: tokens.colors.surfaceAlt,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.xs2,
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
    borderRadius: tokens.radii.md,
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
  variantTitle: {
    fontSize: tokens.fontSizes.sm,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs2,
  },
  variantText: {
    fontSize: tokens.fontSizes.md,
    color: tokens.colors.textPrimary,
  },
  finalMessage: {
    backgroundColor: tokens.colors.brandMuted,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.xs2,
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
    padding: tokens.spacing.lg,
    borderRadius: tokens.radii.md,
  },
  sentText: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.success,
  },
  pendingText: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.warning,
  },
});
