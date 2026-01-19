import React from 'react';
import type { Request } from '../types';
import { Archive } from 'lucide-react';

interface RequestCardProps {
  request: Request;
  onExpand: (request: Request) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onExpand }) => {
  const lastMessage = request.messageSequence.messages[request.messageSequence.messages.length - 1];
  const contactName = request.contactSnapshot?.displayName ?? request.contactId;
  const initials =
    request.contactSnapshot?.initials ??
    contactName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  
  return (
    <div className="card p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onExpand(request)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-[#D4C4B0] flex items-center justify-center text-[#6B5D47] font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary">{contactName}</h3>
            <p className="text-xs text-secondary">
              {request.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Archive logic here
            }}
            className="p-2 hover:bg-[#f0f0f0] dark:hover:bg-[#333333] rounded transition-colors text-[#666666] dark:text-[#B0B0B0]"
            title="Archive"
          >
            <Archive className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-[#fafafa] p-3 rounded dark:bg-[#323232]">
        <p className="text-sm text-primary line-clamp-2">{lastMessage?.content}</p>
        {lastMessage?.sentAt && (
          <p className="text-xs text-secondary mt-1">
            Sent: {lastMessage.sentAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
};
