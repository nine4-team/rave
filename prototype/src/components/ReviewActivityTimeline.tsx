import React, { useState } from 'react';
import type { MessageSequence, Outcome, ReviewFeedback, RequestStatus } from '../types';
import { CheckCircle, Send, Smile, Meh, Frown, Star, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewActivityTimelineProps {
  sequence: MessageSequence;
  feedback?: ReviewFeedback;
  outcome?: Outcome;
  status: RequestStatus;
}

type ActivityItem = {
  id: string;
  timestamp: Date;
  title?: string;
  body?: React.ReactNode;
  icon: React.ReactNode;
};

const getRatingIcon = (value: number, className: string) => {
  switch (value) {
    case 1:
    case 2:
      return <Frown className={className} />;
    case 3:
      return <Meh className={className} />;
    case 4:
    case 5:
      return <Smile className={className} />;
    default:
      return <Meh className={className} />;
  }
};

export const ReviewActivityTimeline: React.FC<ReviewActivityTimelineProps> = ({
  sequence,
  feedback,
  outcome,
  status,
}) => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const items: ActivityItem[] = [];
  const iconClassName = 'w-5 h-5 text-[#987e55]';
  const feedbackIconClassName = 'w-5 h-5 text-[#4A7C59]';
  const upcomingMessages = sequence.messages
    .filter((msg) => msg.status === 'unsent' && !msg.sentAt)
    .sort((a, b) => a.orderInSequence - b.orderInSequence);
  const nextMessage = upcomingMessages[0];

  sequence.messages
    .filter((msg) => msg.sentAt)
    .forEach((msg) => {
      items.push({
        id: `message-${msg.id}`,
        timestamp: msg.sentAt ?? msg.generatedAt,
        title: 'Message Sent',
        body: msg.content,
        icon: <Send className={iconClassName} />,
      });
    });

  if (feedback?.emojiRating || feedback?.feedbackText) {
    const feedbackTimestamp = feedback?.feedbackText?.submittedAt ?? feedback?.emojiRating?.submittedAt;
    if (feedbackTimestamp) {
      items.push({
        id: `feedback-${feedbackTimestamp.toISOString()}`,
        timestamp: feedbackTimestamp,
        title: 'Feedback Received',
        body: (
          <div className="space-y-3">
            {feedback?.emojiRating && (
              <div className="flex items-center gap-3">
                {getRatingIcon(feedback.emojiRating.value, feedbackIconClassName)}
                <p className="text-sm text-[#666666] dark:text-[#B0B0B0]">
                  {feedback.emojiRating.value}/5
                </p>
              </div>
            )}
            {feedback?.feedbackText && (
              <div className={feedback?.emojiRating ? 'border-t border-[#eeeeee] dark:border-[#38383A] pt-3' : ''}>
                <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">
                  {feedback.feedbackText.text}
                </p>
              </div>
            )}
          </div>
        ),
        icon: <CheckCircle className={iconClassName} />,
      });
    }
  }

  if (outcome?.reviewOutcome?.submittedAt) {
    items.push({
      id: `review-posted-${outcome.reviewOutcome.submittedAt.toISOString()}`,
      timestamp: outcome.reviewOutcome.submittedAt,
      title: 'Google Review Posted',
      icon: <Star className={iconClassName} />,
    });
  }

  const timeline = items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const formatTimestamp = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const showGoogleReplyAction = status === 'reviewed' && outcome?.reviewOutcome?.googleReviewSubmitted;
  const nextActionLabel = showGoogleReplyAction ? 'Reply on Google' : 'Text Message';
  const showReferralRequestAction = status === 'replied';

  return (
    <div className="space-y-4">
      {showReferralRequestAction && (
        <div className="bg-white dark:bg-[#2E2E2E] border border-[#eeeeee] dark:border-[#38383A] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#fafafa] dark:bg-[#323232] font-semibold text-[#111111] dark:text-[#E0E0E0]">
            Next
          </div>
          <div className="p-4">
            <div className="bg-[#fafafa] dark:bg-[#323232] p-3 rounded mb-3">
              <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">
                Request a referral next.
              </p>
              <p className="text-xs text-[#999999] dark:text-[#888888] mt-2">
                They just left a positive review — this is a great time to ask.
              </p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-[#987e55] hover:bg-[#6B5D47] text-white text-sm font-medium py-2 rounded transition-colors">
              Request a Referral
            </button>
          </div>
        </div>
      )}

      {!showReferralRequestAction && nextMessage && (
        <div className="bg-white dark:bg-[#2E2E2E] border border-[#eeeeee] dark:border-[#38383A] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#fafafa] dark:bg-[#323232] font-semibold text-[#111111] dark:text-[#E0E0E0]">
            Next
          </div>
          <div className="p-4">
            <div>
              <p className="text-xs text-[#999999] dark:text-[#888888] mb-2">{nextActionLabel}</p>
              <div className="bg-[#fafafa] dark:bg-[#323232] p-3 rounded mb-3">
                <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">{nextMessage.content}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#987e55] hover:bg-[#6B5D47] text-white text-sm font-medium py-2 rounded transition-colors">
                  <Send className="w-4 h-4" />
                  Send
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#f0f0f0] hover:bg-[#e0e0e0] dark:bg-[#333333] dark:hover:bg-[#444444] text-[#333333] dark:text-[#E0E0E0] text-sm font-medium py-2 rounded transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Revise
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#f0f0f0] hover:bg-[#e0e0e0] dark:bg-[#333333] dark:hover:bg-[#444444] text-[#333333] dark:text-[#E0E0E0] p-2 rounded transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#2E2E2E] border border-[#eeeeee] dark:border-[#38383A] rounded-lg overflow-hidden">
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="w-full px-4 py-3 bg-[#fafafa] dark:bg-[#323232] hover:bg-[#f0f0f0] dark:hover:bg-[#3a3a3c] flex items-center justify-between font-semibold text-[#111111] dark:text-[#E0E0E0] transition-colors"
        >
          <span>History</span>
          {isHistoryExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#999999] dark:text-[#888888]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#999999] dark:text-[#888888]" />
          )}
        </button>

        {isHistoryExpanded && (
          <div className="divide-y dark:divide-[#38383A]">
            {timeline.length === 0 ? (
              <div className="p-4 text-sm text-[#999999] dark:text-[#888888]">
                No activity yet.
              </div>
            ) : (
              timeline.map((item) => (
                <div key={item.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        {item.icon}
                      </div>
                      {item.title && (
                        <p className="text-sm font-medium text-[#666666] dark:text-[#B0B0B0]">
                          {item.title}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-[#999999] dark:text-[#888888] self-center">
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </div>
                  {item.body && (
                    <div className="bg-[#fafafa] dark:bg-[#323232] p-4 rounded">
                      {typeof item.body === 'string' ? (
                        <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">{item.body}</p>
                      ) : (
                        item.body
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
