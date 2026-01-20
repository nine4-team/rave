import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Archive, X } from 'lucide-react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { MessageSequenceSection } from '../components/MessageSequenceSection';
import { ReferralDataSection } from '../components/ReferralDataSection';
import { ReviewActivityTimeline } from '../components/ReviewActivityTimeline';
import { useTheme } from '../theme/theme';

type RequestDetailScreenProps = {
  request: Request;
  onClose: () => void;
  onArchive: () => void;
};

const getStatusLabel = (status: Request['status']) => {
  switch (status) {
    case 'new':
      return 'New';
    case 'requested':
      return 'Requested';
    case 'feedback-received':
      return 'Feedback In';
    case 'referral-drafted':
      return 'Referral Drafted';
    case 'reviewed':
      return 'Review Posted';
    case 'replied':
      return 'Replied';
    case 'introduced':
      return 'Intro Made';
    case 'thanked':
      return 'Thanked';
    default:
      return status;
  }
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({
  request,
  onClose,
  onArchive,
}) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const contactName = request.contactSnapshot?.displayName ?? request.contactId;

  return (
    <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={[0]}>
      <View style={styles.stickyHeader}>
        <View style={styles.headerText}>
          <Text style={styles.contactName}>{contactName}</Text>
          <Text style={styles.subtext}>Created {formatDate(request.createdAt)}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerIconButton}
            onPress={onArchive}
            accessibilityLabel="Archive request"
          >
            <Archive size={tokens.iconSizes.lg} color={tokens.colors.textSecondary} />
          </Pressable>
          <Pressable
            style={styles.headerIconButton}
            onPress={onClose}
            accessibilityLabel="Close request"
          >
            <X size={tokens.iconSizes.lg} color={tokens.colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={styles.statusValue}>{getStatusLabel(request.status)}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Type:</Text>
            <Text style={styles.statusValue}>{request.type}</Text>
          </View>
        </View>

        <View style={styles.section}>
          {request.type === 'review' ? (
            <ReviewActivityTimeline request={request} />
          ) : (
            <>
              <MessageSequenceSection sequence={request.messageSequence} />
              {request.referralData ? (
                <ReferralDataSection referralData={request.referralData} />
              ) : null}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    container: {
      paddingBottom: tokens.spacing.huge,
      backgroundColor: tokens.colors.surface,
    },
    stickyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.xxxl,
      paddingVertical: tokens.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surface,
    },
    headerText: {
      flex: 1,
      gap: tokens.spacing.xs2,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    headerIconButton: {
      padding: tokens.spacing.sm,
      borderRadius: tokens.radii.lg,
    },
    content: {
      paddingHorizontal: tokens.spacing.xxxl,
      paddingTop: tokens.spacing.xl,
      gap: tokens.spacing.xl,
    },
    contactName: {
      fontSize: 24,
      fontWeight: '700',
      color: tokens.colors.textPrimary,
    },
    subtext: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textSubtle,
      fontWeight: '300',
    },
    statusBar: {
      flexDirection: 'row',
      gap: tokens.spacing.xl,
      paddingVertical: tokens.spacing.xl,
      paddingHorizontal: tokens.spacing.xxxl,
      marginHorizontal: -tokens.spacing.xxxl,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surfaceAlt,
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.xs,
    },
    statusLabel: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textSubtle,
    },
    statusValue: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
      textTransform: 'capitalize',
    },
    section: {
      gap: tokens.spacing.xl,
    },
  });
