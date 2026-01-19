import React from 'react';
import type { Request } from '../types';
import { X, Archive } from 'lucide-react';
import { MessageSequenceSection } from './MessageSequenceSection';
import { ReviewActivityTimeline } from './ReviewActivityTimeline';
import { ReferralDataSection } from './ReferralDataSection';

interface RequestDetailProps {
  request: Request;
  onClose: () => void;
}

const getStatusLabel = (request: Request) => {
  switch (request.status) {
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
      return request.status;
  }
};

export const RequestDetail: React.FC<RequestDetailProps> = ({ request, onClose }) => {
  const contactName = request.contactSnapshot?.displayName ?? request.contactId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-stretch justify-end z-50 animate-fade-in">
      <div className="bg-white dark:bg-[#2E2E2E] w-full h-full shadow-lg overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#2E2E2E] border-b border-[#eeeeee] dark:border-[#38383A] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-[#E0E0E0]">{contactName}</h2>
            <p className="text-sm text-[#999999] dark:text-[#888888]">
              Created {request.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              title="Archive"
              className="p-2 hover:bg-[#f0f0f0] dark:hover:bg-[#333333] rounded-lg transition-colors text-[#666666] dark:text-[#B0B0B0]"
            >
              <Archive className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#f0f0f0] dark:hover:bg-[#333333] rounded-lg transition-colors text-[#111111] dark:text-[#E0E0E0]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-4 bg-[#fafafa] dark:bg-[#323232] border-b border-[#eeeeee] dark:border-[#38383A]">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-[#999999] dark:text-[#888888]">Status:</span>
              <span className="text-[#111111] dark:text-[#E0E0E0] font-semibold">
                {getStatusLabel(request)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#999999] dark:text-[#888888]">Type:</span>
              <span className="text-[#111111] dark:text-[#E0E0E0] font-semibold capitalize">
                {request.type}
              </span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 py-6 space-y-4">
          {request.type === 'review' ? (
            <ReviewActivityTimeline
              sequence={request.messageSequence}
              feedback={request.feedback}
              outcome={request.outcome}
              status={request.status}
            />
          ) : (
            <MessageSequenceSection sequence={request.messageSequence} />
          )}

          {/* Referral Data (if referral request) */}
          {request.type === 'referral' && request.referralData && (
            <ReferralDataSection referralData={request.referralData} />
          )}
        </div>

        {/* Footer spacing */}
        <div className="h-6" />
      </div>
    </div>
  );
};
