import React from 'react';
import SizeGame from './SizeGameBase';

interface Props { onBack?: () => void; onNext?: () => void; }
export default function UnderstandingOfBig({ onBack, onNext }: Props) {
  return <SizeGame target="big" moduleId="big" onBack={onBack} onNext={onNext} />;
}
