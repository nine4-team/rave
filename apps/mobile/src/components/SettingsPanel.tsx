import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Info,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react-native';
import { type ThemePreference, useTheme } from '../theme/theme';

type ThemeOption = {
  label: string;
  value: ThemePreference;
  Icon: typeof Sun;
};

type SettingsPanelProps = {
  onManageContacts: () => void;
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onManageContacts }) => {
  const { tokens, themePreference, setThemePreference } = useTheme();
  const [businessDescription, setBusinessDescription] = useState('');
  const [toneExamples, setToneExamples] = useState('');
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState('');
  const [npsThreshold, setNpsThreshold] = useState(9);
  const [npsExplanationExpanded, setNpsExplanationExpanded] = useState(false);
  const [businessDescriptionExpanded, setBusinessDescriptionExpanded] = useState(false);
  const [toneExamplesExpanded, setToneExamplesExpanded] = useState(false);
  const [googleBusinessUrlExpanded, setGoogleBusinessUrlExpanded] = useState(false);
  const [cadenceIntervalDays, setCadenceIntervalDays] = useState('3');
  const [cadenceMaxAttempts, setCadenceMaxAttempts] = useState('3');
  const [cadenceExplanationExpanded, setCadenceExplanationExpanded] = useState(false);

  const themeOptions: ThemeOption[] = [
    { label: 'Light', value: 'light', Icon: Sun },
    { label: 'Dark', value: 'dark', Icon: Moon },
    { label: 'Auto', value: 'system', Icon: Monitor },
  ];

  const styles = createStyles(tokens);
  const npsScale = Array.from({ length: 11 }, (_, value) => value);

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
          <Text style={styles.sectionTitle}>Manage Contacts</Text>
          <Text style={styles.sectionDescription}>
            Organize your contacts and make requests.
          </Text>
        </View>
        <Pressable style={styles.manageCard} onPress={onManageContacts}>
          <Text style={styles.manageLabel}>Manage Contacts</Text>
          <ChevronRight size={tokens.iconSizes.md} color={tokens.colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Business Description</Text>
            <Pressable
              onPress={() => setBusinessDescriptionExpanded(!businessDescriptionExpanded)}
              hitSlop={8}
            >
              {businessDescriptionExpanded ? (
                <ChevronUp
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              ) : (
                <Info
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              )}
            </Pressable>
          </View>
          {businessDescriptionExpanded && (
            <View style={styles.sectionDescriptionContainer}>
              <Text style={styles.sectionDescription}>
                1–2 sentence summary of what you do and who you serve.
              </Text>
            </View>
          )}
        </View>
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.inputField, styles.multilineInput]}
            placeholder="e.g. I run a mobile dog-grooming service in North Austin."
            placeholderTextColor={tokens.colors.textSubtle}
            selectionColor={tokens.colors.brand}
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
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Tone Examples</Text>
            <Pressable
              onPress={() => setToneExamplesExpanded(!toneExamplesExpanded)}
              hitSlop={8}
            >
              {toneExamplesExpanded ? (
                <ChevronUp
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              ) : (
                <Info
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              )}
            </Pressable>
          </View>
          {toneExamplesExpanded && (
            <View style={styles.sectionDescriptionContainer}>
              <Text style={styles.sectionDescription}>Optional sample sentences to match your voice.</Text>
            </View>
          )}
        </View>
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.inputField, styles.multilineInput]}
            placeholder="Add a few sentences you might say to a customer."
            placeholderTextColor={tokens.colors.textSubtle}
            selectionColor={tokens.colors.brand}
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
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Google Business Profile URL</Text>
            <Pressable
              onPress={() => setGoogleBusinessUrlExpanded(!googleBusinessUrlExpanded)}
              hitSlop={8}
            >
              {googleBusinessUrlExpanded ? (
                <ChevronUp
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              ) : (
                <Info
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              )}
            </Pressable>
          </View>
          {googleBusinessUrlExpanded && (
            <View style={styles.sectionDescriptionContainer}>
              <Text style={styles.sectionDescription}>Included automatically in review requests.</Text>
            </View>
          )}
        </View>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.inputField}
            placeholder="https://g.page/your-business/review"
            placeholderTextColor={tokens.colors.textSubtle}
            selectionColor={tokens.colors.brand}
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
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>NPS Review Threshold</Text>
            <Pressable
              onPress={() => setNpsExplanationExpanded(!npsExplanationExpanded)}
              hitSlop={8}
            >
              {npsExplanationExpanded ? (
                <ChevronUp
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              ) : (
                <Info
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              )}
            </Pressable>
          </View>
          {npsExplanationExpanded && (
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
                Scores at or above your threshold will be asked for a Google review. Everyone else will be asked to leave you feedback directly.
              </Text>
            </View>
          )}
        </View>
        <View style={styles.inputCard}>
          <View style={styles.thresholdRow}>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderLabels}>
                {npsScale.map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => setNpsThreshold(value)}
                    style={styles.sliderLabelItem}
                    accessibilityRole="button"
                    accessibilityLabel={`Set NPS threshold to ${value}`}
                  >
                    <Text
                      style={[
                        styles.sliderLabel,
                        value >= npsThreshold
                          ? styles.sliderLabelActive
                          : styles.sliderLabelInactive,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.thresholdActionRow}>
              <View style={styles.thresholdInfo}>
                <Text style={styles.thresholdInfoText}>
                  Threshold:{' '}
                  <Text style={styles.thresholdInfoValue}>{npsThreshold}+</Text>
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
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Cadence Controls</Text>
            <Pressable
              onPress={() => setCadenceExplanationExpanded(!cadenceExplanationExpanded)}
              hitSlop={8}
            >
              {cadenceExplanationExpanded ? (
                <ChevronUp
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              ) : (
                <Info
                  size={tokens.iconSizes.md}
                  color={tokens.colors.textSecondary}
                />
              )}
            </Pressable>
          </View>
          {cadenceExplanationExpanded && (
            <View style={styles.sectionDescriptionContainer}>
              <Text style={styles.sectionDescription}>Set follow-up intervals and max attempts.</Text>
            </View>
          )}
        </View>
        <View style={styles.inputCard}>
          <View style={styles.cadenceRow}>
            <View style={styles.cadenceField}>
              <Text style={styles.cadenceLabel}>Days between follow-ups</Text>
              <TextInput
                style={styles.inputField}
                keyboardType="number-pad"
                selectionColor={tokens.colors.brand}
                value={cadenceIntervalDays}
                onChangeText={setCadenceIntervalDays}
              />
            </View>
            <View style={styles.cadenceField}>
              <Text style={styles.cadenceLabel}>Max attempts</Text>
              <TextInput
                style={styles.inputField}
                keyboardType="number-pad"
                selectionColor={tokens.colors.brand}
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
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.xs,
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
      paddingTop: tokens.spacing.sm,
      paddingBottom: tokens.spacing.sm,
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
    manageCard: {
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surface,
      paddingVertical: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    manageLabel: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
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
    sliderContainer: {
      gap: tokens.spacing.xs,
    },
    sliderLabels: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      height: 20,
    },
    sliderLabelItem: {
      flex: 1,
      alignItems: 'center',
    },
    sliderLabel: {
      fontSize: tokens.fontSizes.xs,
    },
    sliderLabelActive: {
      color: tokens.colors.brand,
      fontWeight: '600',
    },
    sliderLabelInactive: {
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
    thresholdInfoValue: {
      color: tokens.colors.brand,
      fontWeight: '600',
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
