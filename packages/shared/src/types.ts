export type RequestType = 'review' | 'referral';

export type RequestStatus =
  | 'new'
  | 'requested'
  | 'feedback-received'
  | 'reviewed'
  | 'replied'
  | 'referral-drafted'
  | 'introduced'
  | 'thanked';

export interface ContactSnapshot {
  id: string;
  displayName: string;
  avatarUrl?: string;
  initials?: string;
}

export interface TextDraft {
  id: string;
  sequenceId: string;
  orderInSequence: number;
  content: string;
  generatedAt: Date;
  sentAt?: Date;
  status: 'unsent' | 'sent' | 'archived';
  revisions?: {
    originalContent: string;
    userRevisions: string[];
    aiRevisions: string[];
  };
  channel: 'sms' | 'email';
  metadata?: {
    customContext?: string;
  };
}

export interface MessageSequence {
  id: string;
  stage: 1 | 2;
  messages: TextDraft[];
  cadenceSettings: {
    intervalDays: number;
    maxAttempts: number;
    lastMessageSentAt?: Date;
    nextScheduledAt?: Date;
  };
}

export interface ReviewFeedback {
  id: string;
  requestId: string;
  emojiRating?: {
    value: 1 | 2 | 3 | 4 | 5;
    submittedAt: Date;
    meetsThreshold: boolean;
  };
  feedbackText?: {
    text: string;
    submittedAt: Date;
    userCopiedToClipboard?: boolean;
    googleReviewSubmitted?: boolean;
  };
  linkedGoogleReview?: {
    googleReviewId: string;
    confirmedAt: Date;
  };
}

export interface ReferralData {
  id: string;
  requestId: string;
  referrerId: string;
  targetContactIds: string[];
  referrerInput?: {
    rawInput: string;
    inputMethod: 'voice' | 'text';
    submittedAt: Date;
  };
  messageVariants?: {
    variants: {
      tone: 'casual' | 'professional' | 'warm';
      text: string;
      generatedAt: Date;
    }[];
    selectedVariant: 'casual' | 'professional' | 'warm' | 'custom';
    customMessage?: string;
    customizationContext?: string;
    finalMessage: string;
  };
  sentAt?: Date;
}

export interface Outcome {
  id: string;
  requestId: string;
  reviewOutcome?: {
    completed: boolean;
    googleReviewSubmitted: boolean;
    submittedAt?: Date;
  };
  referralOutcome?: {
    introSuccessful: boolean;
    markedByUserAt?: Date;
    noteFromUser?: string;
  };
  abandonedAt?: Date;
  abandonReason?: string;
}

export interface Request {
  id: string;
  type: RequestType;
  contactId: string;
  contactSnapshot?: ContactSnapshot;
  ownerId: string;
  createdAt: Date;
  status: RequestStatus;
  messageSequence: MessageSequence;
  feedback?: ReviewFeedback;
  referralData?: ReferralData;
  outcome?: Outcome;
  tags?: string[];
  actionRequired?: boolean;
  archivedAt?: Date;
}
