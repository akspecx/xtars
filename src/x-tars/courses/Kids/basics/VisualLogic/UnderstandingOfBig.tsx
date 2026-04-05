import React from 'react';
import SizeGame from './SizeGameBase';

interface Props { onBack?: () => void; }
export default function UnderstandingOfBig({ onBack }: Props) {
  return <SizeGame target="big" moduleId="big" onBack={onBack} />;
}
