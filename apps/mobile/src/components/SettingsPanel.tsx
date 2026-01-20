import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Check, Monitor, Moon, Sun } from 'lucide-react-native';
import { type ThemePreference, useTheme } from '../theme/theme';

type ThemeOption = {
  label: string;
  value: ThemePreference;
  Icon: typeof Sun;
};

export const SettingsPanel: React.FC = () => {
  const { tokens, themePreference, setThemePreference } = useTheme();
  const [businessDescription, setBusinessDescription] = useState('');
  const [toneExamples, setToneExamples] = useState('');
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState('');
  const [npsThreshold, setNpsThreshold] = useState(9);
  const [cadenceIntervalDays, setCadenceIntervalDays] = useState('3');
  const [cadenceMaxAttempts, setCadenceMaxAttempts] = useState('3');

  const themeOptions: ThemeOption[] = [
    { label: 'Light', value: 'light', Icon: Sun },
    { label: 'Dark', value: 'dark', Icon: Moon },
    { label: 'Auto', value: 'system', Icon: Monitor },
  ];

  const styles = createStyles(tokens);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, styles.appearanceTitle]}>Appearance</Text>
          <Text style={styles.sectionDescription}>
            Choose light, dark, or follow your system preference.
          </Text>
        </View>
        <View style={styles.optionList}>
          {themeOptions.map((option, index) => {
            const isActive = themePreference === option.value;
            const isLast = index === themeOptions.length - 1;
            return (
              <Pressable
                key={option.value}
                onPress={() => setThemePreference(option.value)}
                style={[styles.optionRow, !isLast && styles.optionRowDivider]}
              >
                <View style={styles.optionLeft}>
                  <option.Icon size={tokens.iconSizes.md} color={tokens.colors.textPrimary} />
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
                {isActive ? (
                  <Check size={tokens.iconSizes.md} color={tokens.colors.brand} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Description</Text>
          <Text style={styles.sectionDescription}>
            1–2 sentence summary of what you do and who you serve.
          </Text>
        </View>
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.inputField, styles.multilineInput]}
            placeholder="e.g. I run a mobile dog-grooming service in North Austin."
            placeholderTextColor={tokens.colors.textSubtle}
            multiline
            value={businessDescription}
            onChangeText={setBusinessDescription}
          />
          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tone Examples</Text>
          <Text style={styles.sectionDescription}>Optional sample sentences to match your voice.</Text>
        </View>
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.inputField, styles.multilineInput]}
            placeholder="Add a few sentences you might say to a customer."
            placeholderTextColor={tokens.colors.textSubtle}
            multiline
            value={toneExamples}
            onChangeText={setToneExamples}
          />
          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Google My Business URL</Text>
          <Text style={styles.sectionDescription}>Included automatically in review requests.</Text>
        </View>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.inputField}
            placeholder="https://g.page/your-business/review"
            placeholderTextColor={tokens.colors.textSubtle}
            value={googleBusinessUrl}
            onChangeText={setGoogleBusinessUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>NPS Review Threshold</Text>
          <View style={styles.sectionDescriptionContainer}>
            <Text style={styles.sectionDescription}>
              Controls who we ask to leave a review on Google, based on their NPS score.
            </Text>
            <Text style={styles.sectionDescription}>
              The question asked is:{' '}
              <Text style={styles.sectionDescriptionBold}>
                "How likely are you to refer my business to a friend or family member?"
              </Text>
              .
            </Text>
            <Text style={styles.sectionDescription}>
              Scores at or above your threshold will be asked for a Google review.
            </Text>
          </View>
        </View>
        <View style={styles.inputCard}>
          <View style={styles.thresholdRow}>
            <View style={styles.npsRow}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
                const isAtOrAboveThreshold = value >= npsThreshold;
                return (
                  <Pressable
                    key={value}
                    onPress={() => setNpsThreshold(value)}
                    accessibilityRole="button"
                    accessibilityLabel={`Set NPS threshold to ${value}`}
                    hitSlop={8}
                    style={[
                      styles.npsButton,
                      isAtOrAboveThreshold && styles.npsButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.npsButtonText,
                        isAtOrAboveThreshold && styles.npsButtonTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.thresholdActionRow}>
              <View style={styles.thresholdInfo}>
                <Text style={styles.thresholdInfoText}>
                  Threshold: {npsThreshold}+
                </Text>
              </View>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cadence Controls</Text>
          <Text style={styles.sectionDescription}>Set follow-up intervals and max attempts.</Text>
        </View>
        <View style={styles.inputCard}>
          <View style={styles.cadenceRow}>
            <View style={styles.cadenceField}>
              <Text style={styles.cadenceLabel}>Days between follow-ups</Text>
              <TextInput
                style={styles.inputField}
                keyboardType="number-pad"
                value={cadenceIntervalDays}
                onChangeText={setCadenceIntervalDays}
              />
            </View>
            <View style={styles.cadenceField}>
              <Text style={styles.cadenceLabel}>Max attempts</Text>
              <TextInput
                style={styles.inputField}
                keyboardType="number-pad"
                value={cadenceMaxAttempts}
                onChangeText={setCadenceMaxAttempts}
              />
            </View>
          </View>
          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    container: {
      gap: tokens.spacing.xxl,
    },
    section: {
      gap: tokens.spacing.md,
    },
    sectionHeader: {
      gap: tokens.spacing.xs,
      paddingHorizontal: tokens.spacing.xs,
    },
    sectionTitle: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    appearanceTitle: {
      fontSize: tokens.fontSizes.lg,
    },
    sectionDescriptionContainer: {
      gap: tokens.spacing.md,
    },
    sectionDescription: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.textSecondary,
    },
    sectionDescriptionBold: {
      fontWeight: '600',
    },
    optionList: {
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      overflow: 'hidden',
      backgroundColor: tokens.colors.surface,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.lg,
    },
    optionRowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.borderLight,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.lg,
    },
    optionLabel: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
    },
    inputCard: {
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surface,
      padding: tokens.spacing.xl,
      gap: tokens.spacing.lg,
    },
    inputField: {
      borderWidth: 1,
      borderColor: tokens.colors.borderMedium,
      borderRadius: tokens.radii.md,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.sm,
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
      backgroundColor: tokens.colors.surface,
    },
    multilineInput: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    actionRow: {
      alignItems: 'flex-end',
    },
    secondaryButton: {
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.radii.md,
      backgroundColor: tokens.colors.actionBackground,
    },
    secondaryButtonText: {
      fontSize: tokens.fontSizes.sm,
      fontWeight: '600',
      color: tokens.colors.textSecondary,
    },
    thresholdRow: {
      gap: tokens.spacing.lg,
    },
    npsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.xs,
      justifyContent: 'center',
    },
    npsButton: {
      width: 38,
      height: 38,
      borderRadius: tokens.radii.md,
      borderWidth: 1.5,
      borderColor: tokens.colors.borderMedium,
      backgroundColor: tokens.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    npsButtonActive: {
      backgroundColor: tokens.colors.brand,
      borderColor: tokens.colors.brand,
    },
    npsButtonText: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    npsButtonTextActive: {
      color: tokens.colors.onBrand,
    },
    thresholdActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: tokens.spacing.md,
    },
    thresholdInfo: {
      alignItems: 'flex-start',
    },
    thresholdInfoText: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.textSecondary,
      fontWeight: '500',
    },
    cadenceRow: {
      gap: tokens.spacing.lg,
    },
    cadenceField: {
      gap: tokens.spacing.xs2,
    },
    cadenceLabel: {
      fontSize: tokens.fontSizes.sm,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
  });
