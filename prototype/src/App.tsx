import React, { useMemo, useState } from 'react';
import type { Request } from './types';
import { mockRequests } from './mockData';
import { RequestCard } from './components/RequestCard';
import { RequestDetail } from './components/RequestDetail';
import { SettingsPanel } from './components/SettingsPanel';
import { Star, Share2, Settings, TrendingUp, Handshake } from 'lucide-react';

type Tab = 'scorecard' | 'reviews' | 'referrals' | 'settings';

type ReviewStage = 'new' | 'requested' | 'feedback-received' | 'reviewed' | 'replied';
type ReferralStage = 'new' | 'requested' | 'referral-drafted' | 'introduced' | 'thanked';

const REVIEW_STAGE_DEFINITIONS: Record<ReviewStage, string> = {
  'new': "Requests you've started but haven't sent yet.",
  'requested': "Request sent! The next step is receiving internal feedback from the contact.",
  'feedback-received': "Feedback received! If positive, the next step is for them to leave a review on Google.",
  'reviewed': "Google review posted! The next step is replying to the review.",
  'replied': ".",
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
  'requested': "Request sent. The next step is completing the intro wizard to draft the message.",
  'referral-drafted': "Intro drafted. Your referral will send the message to the contact.",
  'introduced': "Intro sent. You're connected with someone new.",
  'thanked': "Thank-you sent. No further action needed.",
};

const REVIEW_STAGES: ReviewStage[] = ['new', 'requested', 'feedback-received', 'reviewed', 'replied'];
const REFERRAL_STAGES: ReferralStage[] = ['new', 'requested', 'referral-drafted', 'introduced', 'thanked'];

export default function App() {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('scorecard');
  const [activeReviewStage, setActiveReviewStage] = useState<ReviewStage>('new');
  const [activeReferralStage, setActiveReferralStage] = useState<ReferralStage>('new');

  const currentStage = activeTab === 'reviews' ? activeReviewStage : activeReferralStage;
  const stageDescription = activeTab === 'reviews'
    ? REVIEW_STAGE_DEFINITIONS[activeReviewStage]
    : activeTab === 'referrals'
      ? REFERRAL_STAGE_DEFINITIONS[activeReferralStage]
      : '';

  const overviewMetrics = useMemo(() => {
    const activeRequests = mockRequests.filter((request) => !request.archivedAt);

    const reviewRequestsMade = activeRequests.filter(
      (request) => request.type === 'review' && request.status !== 'new',
    ).length;
    const reviewReviewsReceived = activeRequests.filter(
      (request) => request.type === 'review' && ['reviewed', 'replied'].includes(request.status),
    ).length;
    const reviewConversion = reviewRequestsMade
      ? Math.round((reviewReviewsReceived / reviewRequestsMade) * 100)
      : 0;

    const referralRequestsMade = activeRequests.filter(
      (request) => request.type === 'referral' && request.status !== 'new',
    ).length;
    const referralIntrosMade = activeRequests.filter(
      (request) => request.type === 'referral' && ['introduced', 'thanked'].includes(request.status),
    ).length;
    const referralConversion = referralRequestsMade
      ? Math.round((referralIntrosMade / referralRequestsMade) * 100)
      : 0;

    return [
      {
        title: 'Reviews',
        items: [
          { label: 'Requests', value: reviewRequestsMade },
          { label: 'Reviews', value: reviewReviewsReceived },
          { label: 'Conversion', value: `${reviewConversion}%` },
        ],
      },
      {
        title: 'Referrals',
        items: [
          { label: 'Requests', value: referralRequestsMade },
          { label: 'Intros', value: referralIntrosMade },
          { label: 'Conversion', value: `${referralConversion}%` },
        ],
      },
    ];
  }, []);

  const filteredRequests = mockRequests.filter((req) => {
    if (activeTab === 'reviews') {
      return req.type === 'review' && req.status === activeReviewStage && !req.archivedAt;
    }
    if (activeTab === 'referrals') {
      return req.type === 'referral' && req.status === activeReferralStage && !req.archivedAt;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#1E1E1E] flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-[#2E2E2E] border-b border-[#eeeeee] dark:border-[#38383A] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-center py-4">
            <h1 className="text-lg font-bold text-[#111111] dark:text-[#E0E0E0] tracking-tight">
              {activeTab === 'scorecard' && 'Scorecard'}
              {activeTab === 'reviews' && 'Reviews'}
              {activeTab === 'referrals' && 'Referrals'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>
          
          {/* Section Tabs (Granular Stages) */}
          {activeTab === 'reviews' && (
            <div className="flex items-center px-4 overflow-x-auto no-scrollbar border-b border-[#eeeeee] dark:border-[#38383A]">
              {REVIEW_STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setActiveReviewStage(stage)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-[3px] -mb-[1px] ${
                    currentStage === stage
                      ? 'border-[#987e55] text-[#987e55] font-bold'
                      : 'border-transparent text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#E0E0E0]'
                  }`}
                >
                  {REVIEW_STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
          )}
          {activeTab === 'referrals' && (
            <div className="flex items-center px-4 overflow-x-auto no-scrollbar border-b border-[#eeeeee] dark:border-[#38383A]">
              {REFERRAL_STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setActiveReferralStage(stage)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-[3px] -mb-[1px] ${
                    currentStage === stage
                      ? 'border-[#987e55] text-[#987e55] font-bold'
                      : 'border-transparent text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#E0E0E0]'
                  }`}
                >
                  {stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stage Definition */}
      {(activeTab === 'reviews' || activeTab === 'referrals') && (
        <div className="px-6 py-3 bg-white dark:bg-[#2E2E2E]">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-[#888888] dark:text-[#999999] leading-relaxed text-center">
              {stageDescription}
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Flexible */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto px-6 py-8 w-full">
        {activeTab === 'settings' ? (
          <SettingsPanel />
        ) : activeTab === 'scorecard' ? (
          <div className="grid gap-4">
            {overviewMetrics.map((row) => (
              <div
                key={row.title}
                className="bg-white dark:bg-[#2E2E2E] rounded-2xl border border-[#eeeeee] dark:border-[#38383A] p-5"
              >
                <div className="flex items-center gap-2 text-base font-semibold text-[#111111] dark:text-[#E0E0E0]">
                  {row.title === 'Reviews' ? (
                    <Star className="w-4 h-4 text-[#987e55]" />
                  ) : (
                    <Handshake className="w-4 h-4 text-[#987e55]" />
                  )}
                  {row.title}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {row.items.map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-sm uppercase tracking-wide text-[#888888] dark:text-[#999999]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-[#111111] dark:text-[#E0E0E0]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#2E2E2E] rounded-2xl border border-dashed border-[#dddddd] dark:border-[#444444]">
                <h3 className="text-lg font-semibold text-[#111111] dark:text-[#E0E0E0]">
                  No {currentStage.replace('-', ' ')} requests
                </h3>
                <p className="text-[#666666] dark:text-[#B0B0B0] mt-1">
                  Requests in this stage will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onExpand={setSelectedRequest}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* New Request Button - Persistent above bottom nav */}
      {(activeTab !== 'settings' && activeTab !== 'scorecard') && (
        <div className="bg-white dark:bg-[#2E2E2E] border-t border-[#eeeeee] dark:border-[#38383A] px-6 py-3">
          <div className="max-w-4xl mx-auto w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-[#987e55] hover:bg-[#6B5D47] text-white font-semibold px-4 py-3 rounded-lg transition-colors">
              {activeTab === 'reviews' && <Star className="w-5 h-5" />}
              {activeTab === 'referrals' && <Handshake className="w-5 h-5" />}
              {activeTab === 'reviews' && 'New Review Request'}
              {activeTab === 'referrals' && 'New Referral Request'}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white dark:bg-[#2E2E2E] border-t border-[#eeeeee] dark:border-[#38383A]">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-around px-6 py-4">
            {(['scorecard', 'reviews', 'referrals', 'settings'] as const).map((tab) => {
              const getIcon = (tabName: typeof tab) => {
                switch (tabName) {
                  case 'scorecard':
                    return <TrendingUp className="w-6 h-6" />;
                  case 'reviews':
                    return <Star className="w-6 h-6" />;
                  case 'referrals':
                    return <Handshake className="w-6 h-6" />;
                  case 'settings':
                    return <Settings className="w-6 h-6" />;
                }
              };

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                    activeTab === tab
                      ? 'text-[#987e55]'
                      : 'text-[#999999] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#E0E0E0]'
                  }`}
                >
                  {getIcon(tab)}
                  <span className={`text-xs font-medium capitalize ${
                    activeTab === tab ? 'font-semibold' : ''
                  }`}>
                    {tab}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetail
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
