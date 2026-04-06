import React from 'react';
import SizeGame from './SizeGameBase';

interface Props { onBack?: () => void; onNext?: () => void; }
export default function UnderstandingOfBigAndSmallMix({ onBack, onNext }: Props) {
  return <SizeGame target="mix" moduleId="big-small-mix" onBack={onBack} onNext={onNext} />;
}
