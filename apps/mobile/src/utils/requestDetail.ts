import type { Request, TextDraft } from '../../../../packages/shared/src/types';

export type NextStepKind = 'message' | 'reply-google' | 'request-referral';

export type ActionButton = {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'ghost';
  onPress?: () => void;
};

export type NextStep = {
  id: string;
  kind: NextStepKind;
  label: string;
  message?: string;
  subtext?: string;
  actions: ActionButton[];
  messageDraft?: TextDraft; // Include the draft for sending
};

export type HistoryItem = {
  id: string;
  icon: 'send' | 'feedback' | 'review-posted' | 'referrer-input' | 'intro-sent' | 'intro-success';
  title: string;
  timestamp: Date;
  body?: string;
  rating?: number;
  feedbackText?: string;
};

const getUpcomingMessages = (messages: TextDraft[]) =>
  messages
    .filter((message) => message.status === 'unsent' && !message.sentAt)
    .sort((a, b) => a.orderInSequence - b.orderInSequence);

const getFeedbackDetails = (request: Request) => {
  const rating = request.feedback?.emojiRating?.value;
  const feedbackText = request.feedback?.feedbackText?.text;
  if (!rating && !feedbackText) {
    return null;
  }
  return { rating, feedbackText };
};

export const getNextStep = (request: Request): NextStep | null => {
  if (request.type === 'review' && request.status === 'replied') {
    return {
      id: `next-${request.id}`,
      kind: 'request-referral',
      label: 'Request a Referral',
      message: 'Request a referral next.',
      subtext: 'They just left a positive review - this is a great time to ask.',
      actions: [
        {
          id: 'request-referral',
          label: 'Request a Referral',
          variant: 'primary',
        },
      ],
    };
  }

  const nextMessage = getUpcomingMessages(request.messageSequence.messages)[0];
  if (!nextMessage) {
    return null;
  }

  const shouldReplyOnGoogle =
    request.type === 'review' &&
    request.status === 'reviewed' &&
    request.outcome?.reviewOutcome?.googleReviewSubmitted;

  return {
    id: `next-${nextMessage.id}`,
    kind: shouldReplyOnGoogle ? 'reply-google' : 'message',
    label: shouldReplyOnGoogle ? 'Reply on Google' : 'Send a text',
    message: nextMessage.content,
    messageDraft: nextMessage, // Include the draft for sending
    actions: [
      {
        id: 'send',
        label: 'Send',
        variant: 'primary',
      },
      {
        id: 'revise',
        label: 'Revise',
        variant: 'secondary',
      },
      {
        id: 'delete',
        label: 'Delete',
        variant: 'ghost',
      },
    ],
  };
};

export const buildHistoryItems = (request: Request): HistoryItem[] => {
  const items: HistoryItem[] = [];

  request.messageSequence.messages
    .filter((message) => message.sentAt)
    .forEach((message) => {
      items.push({
        id: `message-${message.id}`,
        icon: 'send',
        title: 'Message Sent',
        timestamp: message.sentAt ?? message.generatedAt,
        body: message.content,
      });
    });

  const feedbackTimestamp =
    request.feedback?.feedbackText?.submittedAt ?? request.feedback?.emojiRating?.submittedAt;
  const feedbackDetails = getFeedbackDetails(request);
  if (feedbackTimestamp && feedbackDetails) {
    items.push({
      id: `feedback-${feedbackTimestamp.toISOString()}`,
      icon: 'feedback',
      title: 'Feedback Received',
      timestamp: feedbackTimestamp,
      rating: feedbackDetails.rating,
      feedbackText: feedbackDetails.feedbackText,
    });
  }

  if (request.outcome?.reviewOutcome?.submittedAt) {
    items.push({
      id: `review-posted-${request.outcome.reviewOutcome.submittedAt.toISOString()}`,
      icon: 'review-posted',
      title: 'Google Review Posted',
      timestamp: request.outcome.reviewOutcome.submittedAt,
    });
  }

  if (request.referralData?.referrerInput?.submittedAt) {
    items.push({
      id: `referrer-input-${request.referralData.referrerInput.submittedAt.toISOString()}`,
      icon: 'referrer-input',
      title: 'Referrer Input',
      timestamp: request.referralData.referrerInput.submittedAt,
      body: request.referralData.referrerInput.rawInput,
    });
  }

  if (request.referralData?.sentAt) {
    items.push({
      id: `intro-sent-${request.referralData.sentAt.toISOString()}`,
      icon: 'intro-sent',
      title: 'Intro Sent',
      timestamp: request.referralData.sentAt,
      body: request.referralData.messageVariants?.finalMessage,
    });
  }

  if (request.outcome?.referralOutcome?.markedByUserAt) {
    items.push({
      id: `intro-success-${request.outcome.referralOutcome.markedByUserAt.toISOString()}`,
      icon: 'intro-success',
      title: 'Intro Marked Successful',
      timestamp: request.outcome.referralOutcome.markedByUserAt,
      body: request.outcome.referralOutcome.noteFromUser,
    });
  }

  return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
