import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Handshake, Settings, Star, TrendingUp } from 'lucide-react-native';
import './src/firebase';
import { mockRequests } from './src/mockData';
import { ScorecardOverview } from './src/components/ScorecardOverview';
import { SettingsPanel } from './src/components/SettingsPanel';
import { RequestListScreen } from './src/screens/RequestListScreen';
import { RequestDetailScreen } from './src/screens/RequestDetailScreen';
import type { Request } from '../../packages/shared/src/types';
import { tokens } from './src/theme/tokens';

type Tab = 'scorecard' | 'reviews' | 'referrals' | 'settings';

type ReviewStage = 'new' | 'requested' | 'feedback-received' | 'reviewed' | 'replied';
type ReferralStage = 'new' | 'requested' | 'referral-drafted' | 'introduced' | 'thanked';

const REVIEW_STAGE_DEFINITIONS: Record<ReviewStage, string> = {
  'new': "Requests you've started but haven't sent yet.",
  'requested': 'Request sent! The next step is receiving internal feedback from the contact.',
  'feedback-received':
    "Feedback received! If positive, the next step is for them to leave a review on Google.",
  'reviewed': 'Google review posted! The next step is replying to the review.',
  'replied': '.',
};

const REVIEW_STAGE_LABELS: Record<ReviewStage, string> = {
  'new': 'New',
  'requested': 'Requested',
  'feedback-received': 'Feedback',
  'reviewed': 'Reviewed',
  'replied': 'Replied',
};

const REFERRAL_STAGE_DEFINITIONS: Record<ReferralStage, string> = {
  'new': "Requests you've started but haven't sent yet.",
  'requested': 'Request sent. The next step is completing the intro wizard to draft the message.',
  'referral-drafted': 'Intro drafted. Your referral will send the message to the contact.',
  'introduced': "Intro sent. You're connected with someone new.",
  'thanked': 'Thank-you sent. No further action needed.',
};

const REVIEW_STAGES: ReviewStage[] = ['new', 'requested', 'feedback-received', 'reviewed', 'replied'];
const REFERRAL_STAGES: ReferralStage[] = ['new', 'requested', 'referral-drafted', 'introduced', 'thanked'];

const formatStageLabel = (stage: string) =>
  stage
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default function App() {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('scorecard');
  const [activeReviewStage, setActiveReviewStage] = useState<ReviewStage>('new');
  const [activeReferralStage, setActiveReferralStage] = useState<ReferralStage>('new');

  const currentStage = activeTab === 'reviews' ? activeReviewStage : activeReferralStage;
  const stageDescription =
    activeTab === 'reviews'
      ? REVIEW_STAGE_DEFINITIONS[activeReviewStage]
      : activeTab === 'referrals'
        ? REFERRAL_STAGE_DEFINITIONS[activeReferralStage]
        : '';

  const filteredRequests = useMemo(() => {
    if (activeTab === 'reviews') {
      return mockRequests.filter(
        (request) =>
          request.type === 'review' &&
          request.status === activeReviewStage &&
          !request.archivedAt,
      );
    }
    if (activeTab === 'referrals') {
      return mockRequests.filter(
        (request) =>
          request.type === 'referral' &&
          request.status === activeReferralStage &&
          !request.archivedAt,
      );
    }
    return [];
  }, [activeReferralStage, activeReviewStage, activeTab]);

  if (selectedRequest) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.detailHeader}>
          <Pressable style={styles.backButton} onPress={() => setSelectedRequest(null)}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.detailTitle}>Request</Text>
          <View style={styles.backSpacer} />
        </View>
        <RequestDetailScreen request={selectedRequest} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>
            {activeTab === 'scorecard' && 'Scorecard'}
            {activeTab === 'reviews' && 'Reviews'}
            {activeTab === 'referrals' && 'Referrals'}
            {activeTab === 'settings' && 'Settings'}
          </Text>
        </View>

        {activeTab === 'reviews' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stageTabs}>
            {REVIEW_STAGES.map((stage) => (
              <Pressable
                key={stage}
                onPress={() => setActiveReviewStage(stage)}
                style={[styles.stageTab, currentStage === stage && styles.stageTabActive]}
              >
                <Text
                  style={[
                    styles.stageTabText,
                    currentStage === stage && styles.stageTabTextActive,
                  ]}
                >
                  {REVIEW_STAGE_LABELS[stage]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {activeTab === 'referrals' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stageTabs}>
            {REFERRAL_STAGES.map((stage) => (
              <Pressable
                key={stage}
                onPress={() => setActiveReferralStage(stage)}
                style={[styles.stageTab, currentStage === stage && styles.stageTabActive]}
              >
                <Text
                  style={[
                    styles.stageTabText,
                    currentStage === stage && styles.stageTabTextActive,
                  ]}
                >
                  {formatStageLabel(stage)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {(activeTab === 'reviews' || activeTab === 'referrals') && (
        <View style={styles.stageDefinition}>
          <Text style={styles.stageDefinitionText}>{stageDescription}</Text>
        </View>
      )}

      <View style={styles.body}>
        {activeTab === 'settings' ? (
          <ScrollView contentContainerStyle={styles.settingsContainer}>
            <SettingsPanel />
          </ScrollView>
        ) : activeTab === 'scorecard' ? (
          <ScrollView contentContainerStyle={styles.scorecardContainer}>
            <ScorecardOverview requests={mockRequests} />
          </ScrollView>
        ) : (
          <RequestListScreen
            requests={filteredRequests}
            onSelect={setSelectedRequest}
            emptyTitle={`No ${formatStageLabel(currentStage)} requests`}
            emptyDescription="Requests in this stage will appear here."
          />
        )}
      </View>

      {(activeTab === 'reviews' || activeTab === 'referrals') && (
        <View style={styles.newRequestBar}>
          <Pressable style={styles.newRequestButton}>
            <View style={styles.newRequestContent}>
              {activeTab === 'reviews' ? (
                <Star size={tokens.iconSizes.md} color={tokens.colors.surface} />
              ) : (
                <Handshake size={tokens.iconSizes.md} color={tokens.colors.surface} />
              )}
              <Text style={styles.newRequestText}>
                {activeTab === 'reviews' ? 'New Review Request' : 'New Referral Request'}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      <View style={styles.bottomNav}>
        {(['scorecard', 'reviews', 'referrals', 'settings'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const iconColor = isActive ? tokens.colors.brand : tokens.colors.textSubtle;

          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.bottomNavItem}
            >
              {tab === 'scorecard' && <TrendingUp size={tokens.iconSizes.md} color={iconColor} />}
              {tab === 'reviews' && <Star size={tokens.iconSizes.md} color={iconColor} />}
              {tab === 'referrals' && <Handshake size={tokens.iconSizes.md} color={iconColor} />}
              {tab === 'settings' && <Settings size={tokens.iconSizes.md} color={iconColor} />}
              <Text style={[styles.bottomNavLabel, isActive && styles.bottomNavLabelActive]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.actionBackgroundSubtle,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borderLight,
    backgroundColor: tokens.colors.surface,
  },
  backButton: {
    paddingVertical: tokens.spacing.xs2,
    paddingHorizontal: tokens.spacing.sm,
  },
  backText: {
    fontSize: tokens.fontSizes.base,
    fontWeight: '600',
    color: tokens.colors.brand,
  },
  detailTitle: {
    fontSize: tokens.fontSizes.xl,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  backSpacer: {
    width: 48,
  },
  header: {
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borderLight,
  },
  headerTitleRow: {
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: tokens.fontSizes.xl,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  stageTabs: {
    paddingHorizontal: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borderLight,
  },
  stageTab: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  stageTabActive: {
    borderBottomColor: tokens.colors.brand,
  },
  stageTabText: {
    fontSize: tokens.fontSizes.sm,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
  },
  stageTabTextActive: {
    color: tokens.colors.brand,
  },
  stageDefinition: {
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
  },
  stageDefinitionText: {
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  body: {
    flex: 1,
  },
  scorecardContainer: {
    padding: tokens.spacing.xxl,
    paddingBottom: tokens.spacing.huge,
  },
  settingsContainer: {
    padding: tokens.spacing.xxl,
    paddingBottom: tokens.spacing.huge,
  },
  newRequestBar: {
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borderLight,
    backgroundColor: tokens.colors.surface,
  },
  newRequestButton: {
    paddingVertical: tokens.spacing.lg,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.brand,
    alignItems: 'center',
  },
  newRequestContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  newRequestText: {
    color: tokens.colors.surface,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borderLight,
    backgroundColor: tokens.colors.surface,
    paddingVertical: tokens.spacing.md,
  },
  bottomNavItem: {
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
  bottomNavLabel: {
    fontSize: tokens.fontSizes.sm,
    textTransform: 'capitalize',
    color: tokens.colors.textSubtle,
  },
  bottomNavLabelActive: {
    color: tokens.colors.brand,
    fontWeight: '600',
  },
});
