import React, { useState } from 'react';
import type { MessageSequence } from '../types';
import { Edit2, Trash2, Send, ChevronDown, ChevronUp } from 'lucide-react';

interface MessagesSectionProps {
  sequence: MessageSequence;
}

export const MessagesSection: React.FC<MessagesSectionProps> = ({ sequence }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const upcomingMessages = sequence.messages
    .filter((msg) => msg.status === 'unsent' && !msg.sentAt)
    .sort((a, b) => a.orderInSequence - b.orderInSequence);
  const nextMessage = upcomingMessages[0];
  const timelineMessages = sequence.messages
    .filter((msg) => msg.sentAt)
    .sort((a, b) => {
      const aTimestamp = (a.sentAt ?? a.generatedAt).getTime();
      const bTimestamp = (b.sentAt ?? b.generatedAt).getTime();
      return bTimestamp - aTimestamp;
    });
  const formatTimestamp = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const isScheduled = (messageDate: Date) => messageDate.getTime() > Date.now();
  const getStageLabel = (message: MessageSequence['messages'][number]) => {
    if (message.sentAt) {
      return 'Sent';
    }
    if (message.status === 'archived') {
      return 'Deleted';
    }
    return 'Scheduled';
  };

  return (
    <div className="bg-white dark:bg-[#2E2E2E] border border-[#eeeeee] dark:border-[#38383A] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-[#fafafa] dark:bg-[#323232] hover:bg-[#f0f0f0] dark:hover:bg-[#3a3a3c] flex items-center justify-between font-semibold text-[#111111] dark:text-[#E0E0E0] transition-colors"
      >
        <span>Messages</span>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="divide-y dark:divide-[#38383A]">
          {nextMessage && (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3 text-xs text-[#999999] dark:text-[#888888]">
                <div className="h-px flex-1 bg-[#eeeeee] dark:bg-[#38383A]" />
                <span className="uppercase tracking-wide">Next</span>
                <div className="h-px flex-1 bg-[#eeeeee] dark:bg-[#38383A]" />
              </div>
              <div>
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
          )}

          {timelineMessages.map((msg, index) => {
            const timestamp = msg.sentAt ?? msg.generatedAt;
            const stageLabel = getStageLabel(msg);
            const prevStageLabel = index > 0 ? getStageLabel(timelineMessages[index - 1]) : null;
            const showDivider = index === 0 || stageLabel !== prevStageLabel;

            return (
              <div key={msg.id} className="p-4">
                {showDivider && (
                  <div className="flex items-center gap-3 mb-3 text-xs text-[#999999] dark:text-[#888888]">
                    <div className="h-px flex-1 bg-[#eeeeee] dark:bg-[#38383A]" />
                    <span className="uppercase tracking-wide">{stageLabel}</span>
                    <div className="h-px flex-1 bg-[#eeeeee] dark:bg-[#38383A]" />
                  </div>
                )}
                <div className="flex items-center justify-end mb-2">
                  <div className="text-xs text-[#999999] dark:text-[#888888]">
                    {formatTimestamp(timestamp)}
                  </div>
                </div>
                <div className="bg-[#fafafa] dark:bg-[#323232] p-3 rounded">
                  <p className="text-sm text-[#111111] dark:text-[#E0E0E0]">{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
