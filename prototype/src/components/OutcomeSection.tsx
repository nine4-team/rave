import React, { useState } from 'react';
import type { Outcome } from '../types';
import { ChevronDown, ChevronUp, Check, X, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface OutcomeSectionProps {
  outcome?: Outcome;
}

export const OutcomeSection: React.FC<OutcomeSectionProps> = ({ outcome }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!outcome) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#2E2E2E] border border-[#eeeeee] dark:border-[#38383A] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-[#fafafa] dark:bg-[#323232] hover:bg-[#f0f0f0] dark:hover:bg-[#3a3a3c] flex items-center justify-between font-semibold text-[#111111] dark:text-[#E0E0E0] transition-colors"
      >
        <span className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Outcome
        </span>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="divide-y dark:divide-[#38383A]">
          {/* Review Outcome */}
          {outcome.reviewOutcome && (
            <div className="p-4">
              <h4 className="font-semibold text-[#111111] dark:text-[#E0E0E0] mb-3">Review Outcome</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-[#F5F3EF] dark:bg-[#D4C4B0] rounded border border-[#D4C4B0] dark:border-[#D4C4B0]">
                  <span className="text-sm text-[#111111] dark:text-[#6B5D47]">Review Completed</span>
                  <span className={outcome.reviewOutcome.completed ? 'text-[#4A7C59]' : 'text-[#C5221F] dark:text-[#EF5350]'}>
                    {outcome.reviewOutcome.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F5F3EF] dark:bg-[#D4C4B0] rounded border border-[#D4C4B0] dark:border-[#D4C4B0]">
                  <span className="text-sm text-[#111111] dark:text-[#6B5D47]">Google Review Submitted</span>
                  <span className={outcome.reviewOutcome.googleReviewSubmitted ? 'text-[#4A7C59]' : 'text-[#C5221F] dark:text-[#EF5350]'}>
                    {outcome.reviewOutcome.googleReviewSubmitted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </span>
                </div>
                {outcome.reviewOutcome.submittedAt && (
                  <p className="text-xs text-[#999999] dark:text-[#888888] mt-2">
                    Submitted: {outcome.reviewOutcome.submittedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Referral Outcome */}
          {outcome.referralOutcome && (
            <div className="p-4">
              <h4 className="font-semibold text-[#111111] dark:text-[#E0E0E0] mb-3">Referral Outcome</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-[#F5F3EF] dark:bg-[#D4C4B0] rounded border border-[#D4C4B0] dark:border-[#D4C4B0]">
                  <span className="text-sm text-[#111111] dark:text-[#6B5D47]">Intro Successful</span>
                  <span className={outcome.referralOutcome.introSuccessful ? 'text-[#4A7C59]' : 'text-[#FFC107]'}>
                    {outcome.referralOutcome.introSuccessful ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </span>
                </div>
                {outcome.referralOutcome.markedByUserAt && (
                  <>
                    <p className="text-xs text-[#999999] dark:text-[#888888]">
                      Marked: {outcome.referralOutcome.markedByUserAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    {outcome.referralOutcome.noteFromUser && (
                      <div className="bg-[#fafafa] dark:bg-[#323232] p-2 rounded border border-[#eeeeee] dark:border-[#38383A] mt-2">
                        <p className="text-xs font-semibold text-[#666666] dark:text-[#B0B0B0] mb-1">Note:</p>
                        <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">{outcome.referralOutcome.noteFromUser}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Abandoned */}
          {outcome.abandonedAt && (
            <div className="p-4 bg-[#FCE8E6] dark:bg-[#D4C4B0] border-t border-[#FCE8E6] dark:border-[#D4C4B0]">
              <h4 className="font-semibold text-[#C5221F] dark:text-[#6B5D47] mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Abandoned
              </h4>
              <p className="text-sm text-[#C5221F] dark:text-[#6B5D47] mb-1">
                {outcome.abandonedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              {outcome.abandonReason && (
                <p className="text-xs text-[#C5221F] dark:text-[#6B5D47] italic">Reason: {outcome.abandonReason}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
