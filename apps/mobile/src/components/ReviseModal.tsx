import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../theme/theme';
import { reviseMessage } from '../utils/revise';

type ReviseModalProps = {
  visible: boolean;
  originalMessage: string;
  messageId: string;
  onClose: () => void;
  onReviseComplete: (revisedContent: string, revisionInstructions: string) => void;
};

export const ReviseModal: React.FC<ReviseModalProps> = ({
  visible,
  originalMessage,
  messageId,
  onClose,
  onReviseComplete,
}) => {
  const { tokens } = useTheme();
  const styles = createStyles(tokens);
  const [revisionInstructions, setRevisionInstructions] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleRevise = async () => {
    if (!revisionInstructions.trim()) {
      setError('Please provide revision instructions');
      return;
    }

    setIsRevising(true);
    setError(null);

    try {
      const revisedContent = await reviseMessage(
        originalMessage,
        revisionInstructions,
        messageId,
      );
      onReviseComplete(revisedContent, revisionInstructions);
      setRevisionInstructions('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revise message');
    } finally {
      setIsRevising(false);
    }
  };

  const handleClose = () => {
    if (!isRevising) {
      setRevisionInstructions('');
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Revise Message</Text>
            <Pressable
              onPress={handleClose}
              disabled={isRevising}
              style={styles.closeButton}
              accessibilityLabel="Close modal"
            >
              <X size={tokens.iconSizes.lg} color={tokens.colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.originalMessageContainer}>
              <Text style={styles.label}>Original Message</Text>
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{originalMessage}</Text>
              </View>
            </View>

            <View style={styles.instructionsContainer}>
              <Text style={styles.label}>
                How would you like to revise it?
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isFocused && styles.textInputFocused,
                ]}
                placeholder="e.g., Make it more casual, Add urgency, Shorten it..."
                placeholderTextColor={tokens.colors.textMuted}
                selectionColor={tokens.colors.brand}
                underlineColorAndroid={tokens.colors.brand}
                value={revisionInstructions}
                onChangeText={(text) => {
                  setRevisionInstructions(text);
                  setError(null);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
                numberOfLines={4}
                editable={!isRevising}
                autoFocus
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            {isRevising ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={tokens.colors.brand} />
                <Text style={styles.loadingText}>Revising message...</Text>
              </View>
            ) : (
              <View style={styles.actions}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.reviseButton]}
                  onPress={handleRevise}
                >
                  <Text style={styles.reviseButtonText}>Revise</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.spacing.xl,
    },
    modal: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radii.lg,
      width: '100%',
      maxWidth: 500,
      maxHeight: '80%',
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.borderLight,
    },
    title: {
      fontSize: tokens.fontSizes.xl,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
    },
    closeButton: {
      padding: tokens.spacing.xs2,
      borderRadius: tokens.radii.sm,
    },
    content: {
      padding: tokens.spacing.xl,
      gap: tokens.spacing.xl,
    },
    originalMessageContainer: {
      gap: tokens.spacing.sm,
    },
    label: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
      marginBottom: tokens.spacing.xs,
    },
    messageBox: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
    },
    messageText: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
      lineHeight: tokens.fontSizes.base * 1.5,
    },
    instructionsContainer: {
      gap: tokens.spacing.sm,
    },
    textInput: {
      backgroundColor: tokens.colors.surfaceAlt,
      borderRadius: tokens.radii.sm,
      padding: tokens.spacing.lg,
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
      minHeight: 100,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
    },
    textInputFocused: {
      borderColor: tokens.colors.brand,
    },
    errorText: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.error || '#ef4444',
      marginTop: tokens.spacing.xs,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.sm,
      paddingVertical: tokens.spacing.lg,
    },
    loadingText: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
      justifyContent: 'flex-end',
    },
    button: {
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.radii.sm,
      minWidth: 100,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: tokens.colors.actionBackground,
    },
    cancelButtonText: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
      color: tokens.colors.textDark,
    },
    reviseButton: {
      backgroundColor: tokens.colors.brand,
    },
    reviseButtonText: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '600',
      color: tokens.colors.onBrand,
    },
  });
