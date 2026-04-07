import HeightGame from './HeightGameBase';

interface Props { onBack?: () => void; onNext?: () => void; }

export default function UnderstandingOfShort({ onBack, onNext }: Props) {
  return <HeightGame target="short" moduleId="short" onBack={onBack} onNext={onNext} />;
}
