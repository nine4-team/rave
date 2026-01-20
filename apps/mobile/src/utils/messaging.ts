import { Linking, Platform } from 'react-native';
import type { TextDraft, ContactSnapshot } from '../../../../packages/shared/src/types';

const getSmsUrl = (message: string, phoneNumber?: string) => {
  const encodedMessage = encodeURIComponent(message);
  const recipient = phoneNumber ? phoneNumber : '';
  const separator = Platform.OS === 'ios' ? '&' : '?';
  return `sms:${recipient}${separator}body=${encodedMessage}`;
};

/**
 * Opens the native SMS composer with the message pre-filled
 */
export const openSMSComposer = async (message: string, phoneNumber?: string): Promise<void> => {
  const smsUrl = getSmsUrl(message, phoneNumber);

  const canOpen = await Linking.canOpenURL(smsUrl);
  if (!canOpen) {
    throw new Error('SMS composer is not available on this device');
  }

  await Linking.openURL(smsUrl);
};

/**
 * Opens the native email composer with the message pre-filled
 */
export const openEmailComposer = async (subject: string, body: string, email?: string): Promise<void> => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const recipient = email ? email : '';
  const mailtoUrl = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

  const canOpen = await Linking.canOpenURL(mailtoUrl);
  if (canOpen) {
    await Linking.openURL(mailtoUrl);
  } else {
    throw new Error('Email composer is not available on this device');
  }
};

/**
 * Opens the appropriate native composer (SMS or Email) based on the message channel
 */
export const sendMessage = async (
  draft: TextDraft,
  contact: ContactSnapshot | undefined,
): Promise<void> => {
  const message = draft.content;
  
  if (draft.channel === 'sms') {
    // For SMS, we need a phone number. Since we don't have it in ContactSnapshot,
    // we'll open SMS app with message pre-filled (user can select contact)
    // In a real app, you'd fetch the phone number from the contact
    await openSMSComposer(message);
  } else if (draft.channel === 'email') {
    // For email, we need an email address. Since we don't have it in ContactSnapshot,
    // we'll open email app with message pre-filled (user can select contact)
    // In a real app, you'd fetch the email from the contact
    const subject = `Follow-up from ${contact?.displayName || 'me'}`;
    await openEmailComposer(subject, message);
  } else {
    throw new Error(`Unsupported message channel: ${draft.channel}`);
  }
};
