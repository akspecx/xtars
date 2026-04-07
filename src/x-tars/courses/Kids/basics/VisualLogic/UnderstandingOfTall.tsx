import HeightGame from './HeightGameBase';

interface Props { onBack?: () => void; onNext?: () => void; }

export default function UnderstandingOfTall({ onBack, onNext }: Props) {
  return <HeightGame target="tall" moduleId="tall" onBack={onBack} onNext={onNext} />;
}
