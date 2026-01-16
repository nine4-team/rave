import React, { useState } from 'react';
import type { ReviewFeedback } from '../types';
import { ChevronDown, ChevronUp, CheckCircle, Frown, Meh, Smile } from 'lucide-react';

interface ReviewFeedbackSectionProps {
  feedback: ReviewFeedback;
}

const getRatingIcon = (value: number) => {
  switch (value) {
    case 1:
    case 2:
      return <Frown className="w-8 h-8 text-[#C5221F]" />;
    case 3:
      return <Meh className="w-8 h-8 text-[#FFC107]" />;
    case 4:
    case 5:
      return <Smile className="w-8 h-8 text-[#4A7C59]" />;
    default:
      return <Meh className="w-8 h-8 text-[#999999]" />;
  }
};

export const ReviewFeedbackSection: React.FC<ReviewFeedbackSectionProps> = ({ feedback }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-[#2E2E2E] border border-[#eeeeee] dark:border-[#38383A] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-[#fafafa] dark:bg-[#323232] hover:bg-[#f0f0f0] dark:hover:bg-[#3a3a3c] flex items-center justify-between font-semibold text-[#111111] dark:text-[#E0E0E0] transition-colors"
      >
        <span className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Feedback
        </span>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="divide-y dark:divide-[#38383A]">
          {/* Feedback */}
          {(feedback.emojiRating || feedback.feedbackText) && (
            <div className="p-4">
              <div className="bg-[#fafafa] dark:bg-[#323232] p-4 rounded border border-[#eeeeee] dark:border-[#38383A] space-y-3">
                {/* Emoji Rating */}
                {feedback.emojiRating && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRatingIcon(feedback.emojiRating.value)}
                      <p className="text-sm text-[#666666] dark:text-[#B0B0B0]">{feedback.emojiRating.value}/5</p>
                    </div>
                    <p className="text-xs text-[#999999] dark:text-[#888888]">
                      {feedback.emojiRating.submittedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}

                {/* Feedback Text */}
                {feedback.feedbackText && (
                  <div>
                    {feedback.emojiRating && <div className="border-t border-[#eeeeee] dark:border-[#38383A] pt-3" />}
                    <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">{feedback.feedbackText.text}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Google Review Submitted */}
          {feedback.feedbackText?.googleReviewSubmitted && (
            <div className="p-4">
              <div className="flex items-center gap-2 bg-[#fafafa] dark:bg-[#323232] border border-[#eeeeee] dark:border-[#38383A] text-[#666666] dark:text-[#B0B0B0] px-4 py-3 rounded">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Google review submitted</span>
              </div>
            </div>
          )}

          {/* Google Review Detected */}
          {feedback.linkedGoogleReview && (
            <div className="p-4">
              <div className="bg-[#fafafa] dark:bg-[#323232] border border-[#eeeeee] dark:border-[#38383A] px-4 py-3 rounded">
                <h4 className="font-semibold text-[#111111] dark:text-[#E0E0E0] mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Google Review Detected
                </h4>
                <p className="text-sm text-[#666666] dark:text-[#B0B0B0]">
                  Confirmed: {feedback.linkedGoogleReview.confirmedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
