import HeightGame from './HeightGameBase';

interface Props { onBack?: () => void; onNext?: () => void; }

export default function UnderstandingOfTallAndShort({ onBack, onNext }: Props) {
  return <HeightGame target="mix" moduleId="tall-short" onBack={onBack} onNext={onNext} />;
}
