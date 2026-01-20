import React from 'react';
import type { NextStep } from '../utils/requestDetail';
import { NextStepCard } from './NextStepCard';

type NextStepSectionProps = {
  step: NextStep | null;
  onSend?: () => void;
  onRevise?: () => void;
  onDelete?: () => void;
  onRequestReferral?: () => void;
};

export const NextStepSection: React.FC<NextStepSectionProps> = ({
  step,
  onSend,
  onRevise,
  onDelete,
  onRequestReferral,
}) => {
  if (!step) {
    return null;
  }

  return (
    <NextStepCard
      step={step}
      onSend={onSend}
      onRevise={onRevise}
      onDelete={onDelete}
      onRequestReferral={onRequestReferral}
    />
  );
};
