import type { Request, RequestStatus, RequestType } from '../../../../packages/shared/src/types';

export type PickerContact = {
  id: string;
  name: string;
  normalizedName: string;
  primaryPhone?: string;
  primaryEmail?: string;
  recipientKeys: string[];
};

export type ContactRequestMeta = {
  hasExistingRequest: boolean;
  requestType: RequestType;
  stage: RequestStatus;
  stageLabel: string;
};

const normalizeSearchValue = (value: string) => value.toLowerCase().trim().replace(/\s+/g, ' ');

export const normalizePhone = (value: string) => value.replace(/[^\d+]/g, '');

export const normalizeEmail = (value: string) => value.toLowerCase().trim();

export const formatStageLabel = (stage: string) =>
  stage
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const buildPickerContact = (input: {
  id: string;
  name: string;
  primaryPhone?: string;
  primaryEmail?: string;
}): PickerContact => {
  const normalizedName = normalizeSearchValue(input.name);
  const recipientKeys = new Set<string>();

  recipientKeys.add(`name:${normalizedName}`);

  if (input.primaryPhone) {
    recipientKeys.add(`phone:${normalizePhone(input.primaryPhone)}`);
  }

  if (input.primaryEmail) {
    recipientKeys.add(`email:${normalizeEmail(input.primaryEmail)}`);
  }

  return {
    ...input,
    normalizedName,
    recipientKeys: Array.from(recipientKeys),
  };
};

const getRequestRecipientKeys = (request: Request) => {
  const keys = new Set<string>();
  const displayName = request.contactSnapshot?.displayName ?? '';

  if (displayName) {
    keys.add(`name:${normalizeSearchValue(displayName)}`);
  }

  if (request.contactId) {
    keys.add(`id:${normalizeSearchValue(request.contactId)}`);
  }

  return keys;
};

const isCompletedStatus = (status: RequestStatus, type: RequestType) => {
  if (type === 'review') {
    return status === 'reviewed' || status === 'replied';
  }
  return status === 'introduced' || status === 'thanked';
};

const chooseBestRequest = (requests: Request[], type: RequestType) => {
  return requests
    .slice()
    .sort((a, b) => {
      const aCompleted = isCompletedStatus(a.status, type);
      const bCompleted = isCompletedStatus(b.status, type);

      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    })[0];
};

export const buildRequestMetaLookup = (
  contacts: PickerContact[],
  requests: Request[],
  requestType: RequestType,
) => {
  const lookup: Record<string, ContactRequestMeta | null> = {};
  const relevantRequests = requests.filter((request) => request.type === requestType);

  contacts.forEach((contact) => {
    const matchingRequests = relevantRequests.filter((request) => {
      const requestKeys = getRequestRecipientKeys(request);
      return contact.recipientKeys.some((key) => requestKeys.has(key));
    });

    if (matchingRequests.length === 0) {
      lookup[contact.id] = null;
      return;
    }

    const bestRequest = chooseBestRequest(matchingRequests, requestType);
    lookup[contact.id] = {
      hasExistingRequest: true,
      requestType,
      stage: bestRequest.status,
      stageLabel: formatStageLabel(bestRequest.status),
    };
  });

  return lookup;
};
