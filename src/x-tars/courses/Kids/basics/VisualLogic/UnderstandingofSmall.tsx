import React from 'react';
import SizeGame from './SizeGameBase';

interface Props { onBack?: () => void; }
export default function UnderstandingofSmall({ onBack }: Props) {
  return <SizeGame target="small" moduleId="small" onBack={onBack} />;
}
