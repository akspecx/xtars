import React from 'react';
import SizeGame from './SizeGameBase';

interface Props { onBack?: () => void; }
export default function UnderstandingOfBigAndSmallMix({ onBack }: Props) {
  return <SizeGame target="mix" moduleId="big-small-mix" onBack={onBack} />;
}
