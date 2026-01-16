import React, { useState } from 'react';
import type { ReferralData } from '../types';
import { ChevronDown, ChevronUp, Mic, Type, Users, Send, CheckCircle, Clock } from 'lucide-react';

interface ReferralDataSectionProps {
  referralData: ReferralData;
}

const getToneIcon = (tone: string) => {
  switch (tone) {
    case 'casual':
      return '😄';
    case 'professional':
      return '💼';
    case 'warm':
      return '🤝';
    default:
      return '•';
  }
};

export const ReferralDataSection: React.FC<ReferralDataSectionProps> = ({ referralData }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-[#2E2E2E] border border-[#eeeeee] dark:border-[#38383A] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-[#fafafa] dark:bg-[#323232] hover:bg-[#f0f0f0] dark:hover:bg-[#3a3a3c] flex items-center justify-between font-semibold text-[#111111] dark:text-[#E0E0E0] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Referral Data
        </span>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="divide-y dark:divide-[#38383A]">
          {/* Referrer Info */}
          <div className="p-4">
            <h4 className="font-semibold text-[#111111] dark:text-[#E0E0E0] mb-3">Referrer & Targets</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-[#666666] dark:text-[#B0B0B0]">Referrer ID:</span> <span className="font-medium text-[#111111] dark:text-[#E0E0E0]">{referralData.referrerId}</span></p>
              <p><span className="text-[#666666] dark:text-[#B0B0B0]">Target contacts:</span> <span className="font-medium text-[#111111] dark:text-[#E0E0E0]">{referralData.targetContactIds.join(', ')}</span></p>
            </div>
          </div>

          {/* Raw Input */}
          {referralData.referrerInput && (
            <div className="p-4">
              <h4 className="font-semibold text-[#111111] dark:text-[#E0E0E0] mb-2 flex items-center gap-2">
                {referralData.referrerInput.inputMethod === 'voice' ? (
                  <>
                    <Mic className="w-4 h-4" />
                    Voice Input
                  </>
                ) : (
                  <>
                    <Type className="w-4 h-4" />
                    Text Input
                  </>
                )}
              </h4>
              <div className="bg-[#fafafa] dark:bg-[#323232] p-3 rounded border border-[#eeeeee] dark:border-[#38383A]">
                <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">{referralData.referrerInput.rawInput}</p>
                <p className="text-xs text-[#999999] dark:text-[#888888] mt-1">
                  Submitted: {referralData.referrerInput.submittedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}

          {/* Message Variants */}
          {referralData.messageVariants && (
            <div className="p-4">
              <h4 className="font-semibold text-[#111111] dark:text-[#E0E0E0] mb-3">Message Variants</h4>
              <div className="space-y-3 mb-4">
                {referralData.messageVariants.variants.map((variant) => (
                  <div
                    key={variant.tone}
                    className={`p-3 rounded border-2 ${
                      referralData.messageVariants?.selectedVariant === variant.tone
                        ? 'border-[#987e55] bg-[#F5F3EF] dark:border-[#987e55] dark:bg-[#D4C4B0]'
                        : 'border-[#eeeeee] bg-[#fafafa] dark:border-[#38383A] dark:bg-[#323232]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#111111] dark:text-[#E0E0E0]">
                      {getToneIcon(variant.tone)} {variant.tone.charAt(0).toUpperCase() + variant.tone.slice(1)}
                    </span>
                      {referralData.messageVariants?.selectedVariant === variant.tone && (
                        <span className="text-xs bg-[#987e55] text-white px-2 py-1 rounded font-medium">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">{variant.text}</p>
                  </div>
                ))}
              </div>

              {referralData.messageVariants.customizationContext && (
                <div className="bg-[#FFF8E1] dark:bg-[#D4C4B0] border border-[#FFF0B5] dark:border-[#D4C4B0] p-3 rounded mb-4">
                  <p className="text-xs font-semibold text-[#B06E00] dark:text-[#6B5D47] mb-1 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Customization Applied:
                  </p>
                  <p className="text-sm text-[#B06E00] dark:text-[#6B5D47] italic">"{referralData.messageVariants.customizationContext}"</p>
                </div>
              )}

              <div className="bg-[#F5F3EF] dark:bg-[#D4C4B0] border border-[#D4C4B0] dark:border-[#D4C4B0] p-3 rounded">
                <p className="text-xs font-semibold text-[#987e55] dark:text-[#6B5D47] mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Final Message (Will Send):
                </p>
                <p className="text-sm text-[#987e55] dark:text-[#6B5D47]">{referralData.messageVariants.finalMessage}</p>
              </div>
            </div>
          )}

          {/* Send Status */}
          <div className="p-4 bg-[#F5F3EF] dark:bg-[#D4C4B0]">
            <h4 className="font-semibold text-[#111111] dark:text-[#6B5D47] mb-2">Send Status</h4>
            {referralData.sentAt ? (
              <p className="text-sm text-[#4A7C59] flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Sent: {referralData.sentAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            ) : (
              <p className="text-sm text-[#FFC107] dark:text-[#FFC107] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending send
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
