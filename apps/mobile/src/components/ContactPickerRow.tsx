import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Check, Handshake, Star } from 'lucide-react-native';
import { useTheme } from '../theme/theme';
import type { ContactRequestMeta, PickerContact } from '../utils/contactPicker';

type ContactPickerRowAction = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary';
};

type ContactPickerRowProps = {
  contact: PickerContact;
  secondaryLabel?: string;
  isSelected: boolean;
  requestMeta?: ContactRequestMeta | null;
  onPress: () => void;
  actions?: ContactPickerRowAction[];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
};

export const ContactPickerRow: React.FC<ContactPickerRowProps> = ({
  contact,
  secondaryLabel,
  isSelected,
  requestMeta,
  onPress,
  actions = [],
  onSwipeLeft,
  onSwipeRight,
}) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const swipeableRef = useRef<Swipeable>(null);
  const swipeEnabled = Boolean(onSwipeLeft || onSwipeRight);

  const handleSwipeRight = useCallback(() => {
    if (onSwipeRight) {
      onSwipeRight();
    }
    swipeableRef.current?.close();
  }, [onSwipeRight]);

  const handleSwipeLeft = useCallback(() => {
    if (onSwipeLeft) {
      onSwipeLeft();
    }
    swipeableRef.current?.close();
  }, [onSwipeLeft]);

  const renderLeftActions = useCallback(
    (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
      const translateX = dragX.interpolate({
        inputRange: [0, 80, 160],
        outputRange: [-24, 0, 8],
        extrapolate: 'clamp',
      });
      const opacity = dragX.interpolate({
        inputRange: [0, 40, 80],
        outputRange: [0, 0.6, 1],
        extrapolate: 'clamp',
      });
      const scale = dragX.interpolate({
        inputRange: [0, 80],
        outputRange: [0.9, 1],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          style={[
            styles.swipeAction,
            styles.swipeActionRequest,
            { opacity, transform: [{ translateX }, { scale }] },
          ]}
        >
          <Text style={[styles.swipeActionText, styles.swipeActionTextOnBrand]}>Request</Text>
        </Animated.View>
      );
    },
    [styles],
  );

  const renderRightActions = useCallback(
    (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
      const translateX = dragX.interpolate({
        inputRange: [-160, -80, 0],
        outputRange: [-8, 0, 24],
        extrapolate: 'clamp',
      });
      const opacity = dragX.interpolate({
        inputRange: [-80, -40, 0],
        outputRange: [1, 0.6, 0],
        extrapolate: 'clamp',
      });
      const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          style={[
            styles.swipeAction,
            styles.swipeActionSetAside,
            { opacity, transform: [{ translateX }, { scale }] },
          ]}
        >
          <Text style={[styles.swipeActionText, styles.swipeActionTextSecondary]}>Set Aside</Text>
        </Animated.View>
      );
    },
    [styles],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      enabled={swipeEnabled}
      overshootLeft={false}
      overshootRight={false}
      friction={1.5}
      leftThreshold={48}
      rightThreshold={48}
      renderLeftActions={swipeEnabled ? renderLeftActions : undefined}
      renderRightActions={swipeEnabled ? renderRightActions : undefined}
      onSwipeableLeftOpen={handleSwipeRight}
      onSwipeableRightOpen={handleSwipeLeft}
    >
      <Pressable
        style={[styles.row, isSelected && styles.rowSelected]}
        onPress={onPress}
        accessibilityLabel={`Select ${contact.name}`}
      >
        <View style={styles.main}>
          <View style={styles.textGroup}>
            <Text style={styles.name}>{contact.name}</Text>
            {secondaryLabel ? <Text style={styles.secondary}>{secondaryLabel}</Text> : null}
            {requestMeta ? (
              <View style={styles.metaRow}>
                <View style={styles.metaIcon}>
                  {requestMeta.requestType === 'review' ? (
                    <Star size={tokens.iconSizes.sm} color={tokens.colors.brand} />
                  ) : (
                    <Handshake size={tokens.iconSizes.sm} color={tokens.colors.brand} />
                  )}
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{requestMeta.stageLabel}</Text>
                </View>
              </View>
            ) : null}
          </View>
          <View style={styles.trailing}>
            {isSelected ? (
              <View style={styles.selectedBadge}>
                <Check size={tokens.iconSizes.sm} color={tokens.colors.onBrand} />
              </View>
            ) : null}
            {actions.length > 0 ? (
              <View style={styles.actionRow}>
                {actions.map((action) => (
                  <Pressable
                    key={action.label}
                    style={[
                      styles.actionButton,
                      action.tone === 'primary'
                        ? styles.actionButtonPrimary
                        : styles.actionButtonSecondary,
                    ]}
                    onPress={(event) => {
                      event.stopPropagation?.();
                      action.onPress();
                    }}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        action.tone === 'primary'
                          ? styles.actionTextPrimary
                          : styles.actionTextSecondary,
                      ]}
                    >
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    row: {
      borderRadius: tokens.radii.lg,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surface,
      padding: tokens.spacing.xl,
    },
    rowSelected: {
      borderColor: tokens.colors.brand,
      backgroundColor: tokens.colors.brandMuted,
    },
    swipeAction: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.radii.lg,
    },
    swipeActionRequest: {
      backgroundColor: tokens.colors.brand,
      alignItems: 'flex-start',
    },
    swipeActionSetAside: {
      backgroundColor: tokens.colors.surfaceAlt,
      alignItems: 'flex-end',
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
    },
    swipeActionText: {
      fontWeight: '700',
    },
    swipeActionTextOnBrand: {
      color: tokens.colors.onBrand,
    },
    swipeActionTextSecondary: {
      color: tokens.colors.textSecondary,
    },
    main: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: tokens.spacing.lg,
    },
    textGroup: {
      flex: 1,
      gap: tokens.spacing.xs / 2,
    },
    name: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    secondary: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.textSecondary,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      marginTop: tokens.spacing.xs,
    },
    metaIcon: {
      width: tokens.iconSizes.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metaChip: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs2,
      borderRadius: tokens.radii.sm,
      backgroundColor: tokens.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
    },
    metaChipText: {
      fontSize: tokens.fontSizes.xs,
      color: tokens.colors.textSecondary,
      textTransform: 'capitalize',
      fontWeight: '600',
    },
    trailing: {
      alignItems: 'flex-end',
      gap: tokens.spacing.sm,
    },
    selectedBadge: {
      width: tokens.iconSizes.md,
      height: tokens.iconSizes.md,
      borderRadius: tokens.iconSizes.md / 2,
      backgroundColor: tokens.colors.brand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionRow: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    actionButton: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.radii.sm,
      borderWidth: 1,
    },
    actionButtonPrimary: {
      backgroundColor: tokens.colors.brand,
      borderColor: tokens.colors.brand,
    },
    actionButtonSecondary: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderColor: tokens.colors.borderLight,
    },
    actionText: {
      fontSize: tokens.fontSizes.xs,
      fontWeight: '600',
    },
    actionTextPrimary: {
      color: tokens.colors.onBrand,
    },
    actionTextSecondary: {
      color: tokens.colors.textSecondary,
    },
  });
