import type { TextDraft } from '../../../../packages/shared/src/types';

/**
 * Revises a message using AI while preserving intent and length.
 * This is a placeholder implementation that simulates an AI revision.
 * In production, this would call a Cloud Function or API endpoint.
 */
export async function reviseMessage(
  originalContent: string,
  revisionInstructions: string,
  messageId: string,
): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Placeholder: In production, this would call a Cloud Function like:
  // const response = await fetch(`${FUNCTIONS_URL}/reviseMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     originalContent,
  //     revisionInstructions,
  //     messageId,
  //   }),
  // });
  // const { revisedContent } = await response.json();
  // return revisedContent;

  // Mock revision: Apply simple transformations based on instructions
  let revised = originalContent;

  const instructions = revisionInstructions.toLowerCase();

  if (instructions.includes('shorter') || instructions.includes('shorten')) {
    // Make it shorter by removing some words
    const words = revised.split(' ');
    if (words.length > 10) {
      revised = words.slice(0, Math.floor(words.length * 0.8)).join(' ') + '...';
    }
  }

  if (instructions.includes('casual') || instructions.includes('more casual')) {
    // Make it more casual
    revised = revised.replace(/I would like to/g, "I'd love to");
    revised = revised.replace(/I would be/g, "I'd be");
    revised = revised.replace(/Thank you very much/g, "Thanks so much");
  }

  if (instructions.includes('professional') || instructions.includes('more professional')) {
    // Make it more professional
    revised = revised.replace(/Thanks/g, "Thank you");
    revised = revised.replace(/I'd/g, "I would");
  }

  if (instructions.includes('urgent') || instructions.includes('urgency')) {
    // Add urgency
    if (!revised.includes('soon') && !revised.includes('asap')) {
      revised = revised.replace(/\.$/, ' - would love to hear from you soon!');
    }
  }

  if (instructions.includes('warmer') || instructions.includes('friendly')) {
    // Make it warmer
    if (!revised.includes('😊') && !revised.includes('!')) {
      revised = revised.replace(/\.$/, ' 😊');
    }
  }

  // Ensure we don't return the exact same content (unless no meaningful changes were requested)
  if (revised === originalContent && instructions.length > 5) {
    // Add a subtle variation
    revised = revised.replace(/\.$/, '!');
  }

  return revised;
}

/**
 * Updates a TextDraft with revised content, preserving revision history.
 */
export function updateDraftWithRevision(
  draft: TextDraft,
  revisedContent: string,
  revisionInstructions: string,
): TextDraft {
  const originalContent = draft.revisions?.originalContent || draft.content;

  return {
    ...draft,
    content: revisedContent,
    revisions: {
      originalContent,
      userRevisions: [
        ...(draft.revisions?.userRevisions || []),
        revisionInstructions,
      ],
      aiRevisions: [
        ...(draft.revisions?.aiRevisions || []),
        revisedContent,
      ],
    },
  };
}
