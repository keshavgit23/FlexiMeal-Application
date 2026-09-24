import React, { useEffect } from 'react';
import { SuccessState } from '../shared/StateView';

export interface PublishSuccessProps {
  onContinue: () => void;
}

export const PublishSuccess: React.FC<PublishSuccessProps> = ({
  onContinue,
}) => {
  useEffect(() => {
    // Auto transition after 2.8s if user doesn't click
    const timer = setTimeout(() => {
      onContinue();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
      <SuccessState
        icon="fa-solid fa-circle-check"
        title="Your mess is now live!"
        description="Students can now discover your mess and subscribe to your daily shifts. Welcome to your kitchen command center."
        primaryAction={{
          label: 'Enter Kitchen Operations',
          onClick: onContinue,
          variant: 'primary',
        }}
      />
    </div>
  );
};
