import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Archive, X } from 'lucide-react-native';
import type { Request } from '../../../../packages/shared/src/types';
import { HistorySection } from '../components/HistorySection';
import { NextStepSection } from '../components/NextStepSection';
import { ReviseModal } from '../components/ReviseModal';
import { useTheme } from '../theme/theme';
import { buildHistoryItems, getNextStep } from '../utils/requestDetail';
import { sendMessage } from '../utils/messaging';
import { updateDraftWithRevision } from '../utils/revise';

type RequestDetailScreenProps = {
  request: Request;
  onClose: () => void;
  onArchive: () => void;
  onRequestUpdate?: (updatedRequest: Request) => void;
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
  onRequestUpdate,
}) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const contactName = request.contactSnapshot?.displayName ?? request.contactId;
  const [localRequest, setLocalRequest] = useState(request);
  const [reviseModalVisible, setReviseModalVisible] = useState(false);
  const [revisingMessageId, setRevisingMessageId] = useState<string | null>(null);
  const [revisingOriginalMessage, setRevisingOriginalMessage] = useState('');

  // Use local request state if available, otherwise fall back to prop
  const currentRequest = localRequest || request;
  const nextStep = getNextStep(currentRequest);
  const historyItems = buildHistoryItems(currentRequest);

  const handleSend = async () => {
    const draft = nextStep?.messageDraft;
    const nextStepKind = nextStep?.kind ?? null;

    if (!draft) {
      return;
    }

    if (nextStepKind === 'reply-google') {
      Alert.alert(
        'Reply on Google',
        'Google Business Profile replies will be supported once the account is connected.',
      );
      return;
    }

    try {
      await sendMessage(draft, currentRequest.contactSnapshot);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to open message composer',
      );
    }
  };

  const handleRevise = () => {
    const draft = nextStep?.messageDraft;
    const targetMessageId = draft?.id || '';

    if (!draft) {
      Alert.alert('Error', 'No message found to revise');
      return;
    }

    setRevisingMessageId(targetMessageId);
    setRevisingOriginalMessage(draft.content);
    setReviseModalVisible(true);
  };

  const handleReviseComplete = (revisedContent: string, revisionInstructions: string) => {
    if (!revisingMessageId) {
      return;
    }

    const draft = currentRequest.messageSequence.messages.find(
      m => m.id === revisingMessageId,
    );

    if (!draft) {
      Alert.alert('Error', 'Message not found');
      return;
    }

    // Update the draft with revised content
    const updatedDraft = updateDraftWithRevision(
      draft,
      revisedContent,
      revisionInstructions,
    );

    // Update the message sequence
    const updatedMessages = currentRequest.messageSequence.messages.map((m) =>
      m.id === revisingMessageId ? updatedDraft : m,
    );

    const updatedRequest: Request = {
      ...currentRequest,
      messageSequence: {
        ...currentRequest.messageSequence,
        messages: updatedMessages,
      },
    };

    setLocalRequest(updatedRequest);
    onRequestUpdate?.(updatedRequest);

    setReviseModalVisible(false);
    setRevisingMessageId(null);
    setRevisingOriginalMessage('');
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    Alert.alert('Delete', 'Delete functionality coming soon');
  };

  const handleRequestReferral = () => {
    // TODO: Implement referral request generation
    Alert.alert('Request a Referral', 'Referral request generation coming soon');
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={[0]}>
        <View style={styles.stickyHeader}>
          <View style={styles.headerText}>
            <Text style={styles.contactName}>{contactName}</Text>
            <Text style={styles.subtext}>Created {formatDate(currentRequest.createdAt)}</Text>
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
            <Text style={styles.statusValue}>{getStatusLabel(currentRequest.status)}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Type:</Text>
            <Text style={styles.statusValue}>{currentRequest.type}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <NextStepSection
            step={nextStep}
            onSend={handleSend}
            onRevise={handleRevise}
            onDelete={handleDelete}
            onRequestReferral={handleRequestReferral}
          />
          <HistorySection items={historyItems} />
        </View>
      </View>
    </ScrollView>

    <ReviseModal
      visible={reviseModalVisible}
      originalMessage={revisingOriginalMessage}
      messageId={revisingMessageId || ''}
      onClose={() => {
        setReviseModalVisible(false);
        setRevisingMessageId(null);
        setRevisingOriginalMessage('');
      }}
      onReviseComplete={handleReviseComplete}
    />
    </>
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
