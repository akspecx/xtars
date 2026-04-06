import React from 'react';
import SizeGame from './SizeGameBase';

interface Props { onBack?: () => void; onNext?: () => void; }
export default function UnderstandingofSmall({ onBack, onNext }: Props) {
  return <SizeGame target="small" moduleId="small" onBack={onBack} onNext={onNext} />;
}
