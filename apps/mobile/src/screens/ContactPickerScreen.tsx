import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { Handshake, Star, X } from 'lucide-react-native';
import type { Request, RequestType } from '../../../../packages/shared/src/types';
import { ContactPickerRow } from '../components/ContactPickerRow';
import { useTheme } from '../theme/theme';
import {
  buildPickerContact,
  buildRequestMetaLookup,
  normalizeEmail,
  normalizePhone,
  type PickerContact,
} from '../utils/contactPicker';

type ContactPickerTab = 'not-requested' | 'requested' | 'set-aside';

type ContactPickerScreenProps = {
  requestType: RequestType;
  requests: Request[];
  onClose: () => void;
  onContinue: (contacts: PickerContact[]) => void;
  title?: string;
};

const CONTACT_TABS: ContactPickerTab[] = ['not-requested', 'requested', 'set-aside'];

const TAB_LABELS: Record<ContactPickerTab, string> = {
  'not-requested': 'Not Requested',
  'requested': 'Requested',
  'set-aside': 'Set Aside',
};

export const ContactPickerScreen: React.FC<ContactPickerScreenProps> = ({
  requestType,
  requests,
  onClose,
  onContinue,
  title = 'Select Contacts',
}) => {
  const { tokens, resolvedTheme } = useTheme();
  const styles = createStyles(tokens);
  const statusBarStyle = resolvedTheme === 'dark' ? 'light-content' : 'dark-content';
  const [permission, setPermission] = useState<Contacts.PermissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<PickerContact[]>([]);
  const [activeTab, setActiveTab] = useState<ContactPickerTab>('not-requested');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [setAsideIds, setSetAsideIds] = useState<Set<string>>(new Set());
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [showHidden, setShowHidden] = useState(false);
  const [swipeNotice, setSwipeNotice] = useState<string | null>(null);
  const [swipeNoticeVisible, setSwipeNoticeVisible] = useState(false);
  const swipeNoticeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeNoticeOpacity = useRef(new Animated.Value(0)).current;
  const swipeNoticeTranslate = useRef(new Animated.Value(6)).current;

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const result = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        pageSize: 1000,
      });

      const normalized = result.data
        .map((contact) => {
          const displayName =
            contact.name ||
            [contact.firstName, contact.lastName].filter(Boolean).join(' ') ||
            'Unnamed contact';
          const primaryPhone = contact.phoneNumbers?.[0]?.number;
          const primaryEmail = contact.emails?.[0]?.email;

          return buildPickerContact({
            id: contact.id,
            name: displayName,
            primaryPhone,
            primaryEmail,
          });
        })
        .filter((contact) => contact.name.trim().length > 0);

      setContacts(normalized);
    } catch (error) {
      Alert.alert(
        'Contacts Error',
        error instanceof Error ? error.message : 'Unable to load contacts.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadPermissions = async () => {
    const current = await Contacts.getPermissionsAsync();
    setPermission(current);
    if (current.status === 'granted') {
      await loadContacts();
    }
  };

  const requestPermission = async () => {
    const response = await Contacts.requestPermissionsAsync();
    setPermission(response);
    if (response.status === 'granted') {
      await loadContacts();
    }
  };

  useEffect(() => {
    void loadPermissions();
  }, []);

  useEffect(
    () => () => {
      if (swipeNoticeTimeout.current) {
        clearTimeout(swipeNoticeTimeout.current);
      }
    },
    [],
  );

  const requestMetaLookup = useMemo(
    () => buildRequestMetaLookup(contacts, requests, requestType),
    [contacts, requests, requestType],
  );

  const filteredContacts = useMemo(() => {
    const searchValue = searchQuery.trim().toLowerCase();
    const matchesSearch = (contact: PickerContact) => {
      if (!searchValue) {
        return true;
      }
      const searchHaystack = [
        contact.name.toLowerCase(),
        contact.primaryPhone ? normalizePhone(contact.primaryPhone) : '',
        contact.primaryEmail ? normalizeEmail(contact.primaryEmail) : '',
      ]
        .filter(Boolean)
        .join(' ');
      return searchHaystack.includes(searchValue) || contact.normalizedName.includes(searchValue);
    };

    return contacts
      .filter(matchesSearch)
      .filter((contact) => {
        const meta = requestMetaLookup[contact.id];
        const hasExisting = Boolean(meta);
        const isRequested = hasExisting || requestedIds.has(contact.id);
        const isSetAside = setAsideIds.has(contact.id);
        const isHidden = hiddenIds.has(contact.id);

        if (activeTab === 'requested') {
          return isRequested;
        }
        if (activeTab === 'set-aside') {
          if (!isSetAside) {
            return false;
          }
          return showHidden || !isHidden;
        }
        return !isRequested && !isSetAside && !isHidden;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    activeTab,
    contacts,
    hiddenIds,
    requestMetaLookup,
    requestedIds,
    searchQuery,
    setAsideIds,
    showHidden,
  ]);

  const toggleSelected = (contactId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(contactId)) {
        next.delete(contactId);
      } else {
        next.add(contactId);
      }
      return next;
    });
  };

  const handleSetAside = (contactId: string) => {
    setSetAsideIds((prev) => new Set(prev).add(contactId));
    setRequestedIds((prev) => {
      const next = new Set(prev);
      next.delete(contactId);
      return next;
    });
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(contactId);
      return next;
    });
  };

  const handleRestore = (contactId: string) => {
    setSetAsideIds((prev) => {
      const next = new Set(prev);
      next.delete(contactId);
      return next;
    });
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.delete(contactId);
      return next;
    });
    const contact = contacts.find((item) => item.id === contactId);
    if (contact) {
      showSwipeNotice(`${contact.name} restored`);
    }
  };

  const handleHide = (contactId: string) => {
    setHiddenIds((prev) => new Set(prev).add(contactId));
    const contact = contacts.find((item) => item.id === contactId);
    if (contact) {
      showSwipeNotice(`${contact.name} hidden`);
    }
  };

  const handleUnhide = (contactId: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.delete(contactId);
      return next;
    });
  };

  const handleContinue = () => {
    const selected = contacts.filter((contact) => selectedIds.has(contact.id));
    const selectedCount = selected.length;
    if (selectedCount > 0) {
      const requestLabel = requestType === 'review' ? 'Review request' : 'Referral request';
      showSwipeNotice(
        selectedCount === 1
          ? `${requestLabel} created for ${selected[0].name}`
          : `${selectedCount} ${requestLabel.toLowerCase()}s generated`,
      );
    }
    onContinue(selected);
  };

  const handleSetAsideSelected = () => {
    if (selectedIds.size === 0) {
      return;
    }
    setSetAsideIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
    const setAsideCount = selectedIds.size;
    setSelectedIds(new Set());
    showSwipeNotice(
      `${setAsideCount} contact${setAsideCount === 1 ? '' : 's'} set aside`,
    );
  };

  const handleRestoreSelected = () => {
    if (selectedIds.size === 0) {
      return;
    }
    setSetAsideIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.delete(id));
      return next;
    });
    setHiddenIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.delete(id));
      return next;
    });
    const restoredCount = selectedIds.size;
    setSelectedIds(new Set());
    showSwipeNotice(`${restoredCount} contact${restoredCount === 1 ? '' : 's'} restored`);
  };

  const handleHideSelected = () => {
    if (selectedIds.size === 0) {
      return;
    }
    setHiddenIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
    const hiddenCount = selectedIds.size;
    setSelectedIds(new Set());
    showSwipeNotice(`${hiddenCount} contact${hiddenCount === 1 ? '' : 's'} hidden`);
  };

  const showSwipeNotice = (message: string) => {
    setSwipeNotice(message);
    setSwipeNoticeVisible(true);
    swipeNoticeOpacity.setValue(0);
    swipeNoticeTranslate.setValue(6);
    Animated.parallel([
      Animated.timing(swipeNoticeOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(swipeNoticeTranslate, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
    if (swipeNoticeTimeout.current) {
      clearTimeout(swipeNoticeTimeout.current);
    }
    swipeNoticeTimeout.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(swipeNoticeOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(swipeNoticeTranslate, {
          toValue: -6,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setSwipeNoticeVisible(false);
        }
      });
    }, 1400);
  };

  const handleSwipeRequest = (contact: PickerContact) => {
    const requestLabel = requestType === 'review' ? 'Review request' : 'Referral request';
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(contact.id);
      return next;
    });
    setSetAsideIds((prev) => {
      const next = new Set(prev);
      next.delete(contact.id);
      return next;
    });
    setRequestedIds((prev) => new Set(prev).add(contact.id));
    showSwipeNotice(`${requestLabel} created for ${contact.name}`);
  };

  const handleSwipeSetAside = (contact: PickerContact) => {
    handleSetAside(contact.id);
    showSwipeNotice(`${contact.name} set aside`);
  };

  const permissionStatus = permission?.status ?? 'undetermined';
  const canAskAgain = permission?.canAskAgain ?? true;
  const isReviewRequest = requestType === 'review';

  const renderPermissionState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Allow contacts access</Text>
      <Text style={styles.emptyDescription}>
        We use your contacts to help you quickly send requests.
      </Text>
      <Pressable
        style={styles.primaryButton}
        onPress={canAskAgain ? requestPermission : Contacts.openSettings}
      >
        <Text style={styles.primaryButtonText}>{canAskAgain ? 'Allow Contacts' : 'Open Settings'}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={tokens.colors.surface} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>{title}</Text>
          <Pressable style={styles.headerIconButton} onPress={onClose} accessibilityLabel="Close">
            <X size={tokens.iconSizes.lg} color={tokens.colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search contacts"
              placeholderTextColor={tokens.colors.textSubtle}
              autoCapitalize="none"
            />
            {swipeNotice && swipeNoticeVisible ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.swipeNotice,
                  {
                    opacity: swipeNoticeOpacity,
                    transform: [{ translateY: swipeNoticeTranslate }],
                  },
                ]}
              >
                <Text style={styles.swipeNoticeText}>{swipeNotice}</Text>
              </Animated.View>
            ) : null}
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stageTabs}>
          {CONTACT_TABS.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.stageTab, activeTab === tab && styles.stageTabActive]}
            >
              <Text style={[styles.stageTabText, activeTab === tab && styles.stageTabTextActive]}>
                {TAB_LABELS[tab]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {permissionStatus !== 'granted' ? (
          <View style={styles.body}>
            {isLoading ? <ActivityIndicator color={tokens.colors.brand} /> : renderPermissionState()}
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.list}>
              {isLoading ? (
                <ActivityIndicator color={tokens.colors.brand} />
              ) : filteredContacts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>
                    {searchQuery ? 'No matches' : 'No contacts found'}
                  </Text>
                  <Text style={styles.emptyDescription}>
                    {searchQuery
                      ? 'Try a different name, phone number, or email.'
                      : 'Your contacts will show up here once available.'}
                  </Text>
                </View>
              ) : (
                filteredContacts.map((contact) => {
                  const requestMeta = requestMetaLookup[contact.id];
                  const isSelected = selectedIds.has(contact.id);
                  const isHidden = hiddenIds.has(contact.id);
                  const actions =
                    activeTab === 'set-aside'
                      ? [
                          {
                            label: 'Restore',
                            onPress: () => handleRestore(contact.id),
                            tone: 'primary' as const,
                          },
                          {
                            label: isHidden ? 'Unhide' : 'Hide',
                            onPress: () =>
                              isHidden ? handleUnhide(contact.id) : handleHide(contact.id),
                            tone: 'secondary' as const,
                          },
                        ]
                      : [];

                  const secondaryLabel = contact.primaryPhone || contact.primaryEmail || '';

                  return (
                    <ContactPickerRow
                      key={contact.id}
                      contact={contact}
                      secondaryLabel={secondaryLabel}
                      isSelected={isSelected}
                      requestMeta={requestMeta}
                      onPress={() => toggleSelected(contact.id)}
                      actions={actions}
                      onSwipeLeft={
                        activeTab === 'not-requested'
                          ? () => handleSwipeSetAside(contact)
                          : undefined
                      }
                      onSwipeRight={
                        activeTab === 'not-requested' ? () => handleSwipeRequest(contact) : undefined
                      }
                    />
                  );
                })
              )}
            </ScrollView>
            {activeTab === 'set-aside' ? (
              <View style={styles.toggleRow}>
                <Pressable onPress={() => setShowHidden((prev) => !prev)}>
                  <Text style={[styles.toggleText, showHidden && styles.toggleTextActive]}>
                    {showHidden ? 'Hide hidden' : 'Show hidden'}
                  </Text>
                </Pressable>
              </View>
            ) : null}
            <View style={styles.footer}>
              <View style={styles.footerActions}>
                {activeTab === 'set-aside' ? (
                  <>
                    <Pressable
                      style={[
                        styles.secondaryButton,
                        selectedIds.size === 0 && styles.secondaryButtonDisabled,
                      ]}
                      onPress={handleRestoreSelected}
                      disabled={selectedIds.size === 0}
                    >
                      <Text
                        style={[
                          styles.secondaryButtonText,
                          selectedIds.size === 0 && styles.secondaryButtonTextDisabled,
                        ]}
                      >
                        Restore
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.primaryButton,
                        selectedIds.size === 0 && styles.primaryButtonDisabled,
                      ]}
                      onPress={handleHideSelected}
                      disabled={selectedIds.size === 0}
                    >
                      <Text style={styles.primaryButtonText}>Hide</Text>
                    </Pressable>
                  </>
                ) : null}
                {activeTab === 'not-requested' ? (
                  <Pressable
                    style={[
                      styles.secondaryButton,
                      selectedIds.size === 0 && styles.secondaryButtonDisabled,
                    ]}
                    onPress={handleSetAsideSelected}
                    disabled={selectedIds.size === 0}
                  >
                    <Text
                      style={[
                        styles.secondaryButtonText,
                        selectedIds.size === 0 && styles.secondaryButtonTextDisabled,
                      ]}
                    >
                      Set Aside
                    </Text>
                  </Pressable>
                ) : null}
                {activeTab !== 'set-aside' ? (
                  <Pressable
                    style={[
                      styles.primaryButton,
                      selectedIds.size === 0 && styles.primaryButtonDisabled,
                    ]}
                    onPress={handleContinue}
                    disabled={selectedIds.size === 0}
                  >
                    <View style={styles.primaryButtonContent}>
                      {isReviewRequest ? (
                        <Star size={tokens.iconSizes.sm} color={tokens.colors.onBrand} />
                      ) : (
                        <Handshake size={tokens.iconSizes.sm} color={tokens.colors.onBrand} />
                      )}
                      <Text style={styles.primaryButtonText}>
                        {selectedIds.size > 0 ? `Request (${selectedIds.size})` : 'Request'}
                      </Text>
                    </View>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (tokens: ReturnType<typeof useTheme>['tokens']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.actionBackgroundSubtle,
      position: 'relative',
    },
    header: {
      backgroundColor: tokens.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.borderLight,
      paddingBottom: tokens.spacing.lg,
      position: 'relative',
    },
    content: {
      flex: 1,
      position: 'relative',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: tokens.spacing.xxxl,
      paddingVertical: tokens.spacing.xl,
    },
    headerTitle: {
      fontSize: tokens.fontSizes.lg,
      fontWeight: '700',
      color: tokens.colors.textPrimary,
    },
    headerSpacer: {
      width: tokens.iconSizes.lg,
    },
    headerIconButton: {
      padding: tokens.spacing.xs2,
      borderRadius: tokens.radii.sm,
    },
    searchContainer: {
      paddingHorizontal: tokens.spacing.xxxl,
      paddingBottom: tokens.spacing.lg,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.md,
    },
    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      borderRadius: tokens.radii.md,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textPrimary,
      backgroundColor: tokens.colors.surfaceAlt,
    },
    stageTabs: {
      paddingHorizontal: tokens.spacing.xl,
    },
    stageTab: {
      paddingHorizontal: tokens.spacing.xl,
      paddingVertical: tokens.spacing.lg,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    stageTabActive: {
      borderBottomColor: tokens.colors.brand,
    },
    stageTabText: {
      fontSize: tokens.fontSizes.base,
      fontWeight: '500',
      color: tokens.colors.textSecondary,
    },
    stageTabTextActive: {
      color: tokens.colors.brand,
      fontWeight: '700',
    },
    body: {
      flex: 1,
      paddingHorizontal: tokens.spacing.xxxl,
      paddingVertical: tokens.spacing.huge,
      justifyContent: 'center',
      alignItems: 'center',
    },
    list: {
      paddingHorizontal: tokens.spacing.xxxl,
      paddingVertical: tokens.spacing.huge,
      gap: tokens.spacing.xl,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: tokens.spacing.xxxl,
      paddingVertical: tokens.spacing.lg,
      backgroundColor: tokens.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.borderLight,
    },
    toggleLabel: {
      fontSize: tokens.fontSizes.sm,
      color: tokens.colors.textSecondary,
    },
    toggleButton: {
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.radii.sm,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surfaceAlt,
    },
    toggleButtonActive: {
      backgroundColor: tokens.colors.brand,
      borderColor: tokens.colors.brand,
    },
    toggleText: {
      fontSize: tokens.fontSizes.xs,
      fontWeight: '600',
      color: tokens.colors.textSecondary,
    },
    toggleTextActive: {
      color: tokens.colors.brand,
    },
    emptyState: {
      paddingVertical: 48,
      paddingHorizontal: tokens.spacing.xxxl,
      borderRadius: tokens.radii.xl,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: tokens.colors.borderMedium,
      backgroundColor: tokens.colors.surface,
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    emptyTitle: {
      fontSize: tokens.fontSizes.lg,
      fontWeight: '600',
      color: tokens.colors.textPrimary,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: tokens.fontSizes.base,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      marginBottom: tokens.spacing.lg,
    },
    footer: {
      paddingHorizontal: tokens.spacing.xxxl,
      paddingVertical: tokens.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.borderLight,
      backgroundColor: tokens.colors.surface,
    },
    swipeNotice: {
      flexShrink: 1,
      alignItems: 'flex-start',
      backgroundColor: tokens.colors.actionBackgroundSubtle,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.radii.md,
    },
    swipeNoticeText: {
      color: tokens.colors.brand,
      fontSize: tokens.fontSizes.xs,
      fontWeight: '500',
    },
    footerActions: {
      flexDirection: 'row',
      gap: tokens.spacing.md,
    },
    primaryButton: {
      paddingVertical: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.radii.md,
      backgroundColor: tokens.colors.brand,
      alignItems: 'center',
      flex: 1,
    },
    primaryButtonDisabled: {
      backgroundColor: tokens.colors.borderMedium,
    },
    primaryButtonText: {
      color: tokens.colors.onBrand,
      fontWeight: '600',
      fontSize: tokens.fontSizes.base,
    },
    primaryButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    secondaryButton: {
      paddingVertical: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.radii.md,
      backgroundColor: tokens.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: tokens.colors.borderLight,
      alignItems: 'center',
      flex: 1,
    },
    secondaryButtonDisabled: {
      backgroundColor: tokens.colors.actionBackground,
    },
    secondaryButtonText: {
      color: tokens.colors.textSecondary,
      fontWeight: '600',
      fontSize: tokens.fontSizes.base,
    },
    secondaryButtonTextDisabled: {
      color: tokens.colors.textSubtle,
    },
  });
