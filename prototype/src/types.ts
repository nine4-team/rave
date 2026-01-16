// TextDraft - Individual message in a sequence
export interface TextDraft {
  id: string;
  sequenceId: string;
  orderInSequence: number;
  content: string;
  generatedAt: Date;
  sentAt?: Date;
  status: "unsent" | "sent" | "archived";
  revisions?: {
    originalContent: string;
    userRevisions: string[];
    aiRevisions: string[];
  };
  channel: "sms" | "email";
  metadata?: {
    customContext?: string;
  };
}

// MessageSequence - Container for messages in a cadence
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

// ReviewFeedback - For review requests only
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

// ReferralData - For referral requests only
export interface ReferralData {
  id: string;
  requestId: string;
  referrerId: string;
  targetContactIds: string[];
  referrerInput?: {
    rawInput: string;
    inputMethod: "voice" | "text";
    submittedAt: Date;
  };
  messageVariants?: {
    variants: {
      tone: "casual" | "professional" | "warm";
      text: string;
      generatedAt: Date;
    }[];
    selectedVariant: "casual" | "professional" | "warm" | "custom";
    customMessage?: string;
    customizationContext?: string;
    finalMessage: string;
  };
  sentAt?: Date;
}

// Outcome - Unified tracking
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

export type RequestStatus = 
  | "new"                // Milestone 1: Created but not yet sent
  | "requested"          // Milestone 2: User clicked send (Review/Referral)
  | "feedback-received"  // Milestone 3 (Review): Feedback form submitted
  | "referral-drafted"   // Milestone 3 (Referral): Referrer used tool to draft intro
  | "reviewed"           // Milestone 4 (Review): Google review submitted
  | "replied"            // Milestone 5 (Review): Follow-up sent after review
  | "introduced"         // Milestone 4 (Referral): Intro group text made
  | "thanked";           // Milestone 5 (Referral): Thank-you sent

// Request - Root entity
export interface Request {
  id: string;
  type: "review" | "referral";
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  ownerId: string;
  createdAt: Date;
  status: RequestStatus;
  messageSequence: MessageSequence;
  feedback?: ReviewFeedback;
  referralData?: ReferralData;
  outcome?: Outcome;
  tags?: string[];
  archivedAt?: Date;
}
