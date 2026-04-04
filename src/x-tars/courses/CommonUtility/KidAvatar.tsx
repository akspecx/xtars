/**
 * KidAvatar.tsx
 * Renders either the green bird SVG (avatar === 'bird' or undefined)
 * or any emoji avatar string.
 */
import React from 'react';
import { motion } from 'framer-motion';

interface KidAvatarProps {
  /** Avatar id — 'bird' for SVG bird, anything else rendered as emoji */
  avatar?: string;
  size?: number;
  /** When true, bird flies off to the right */
  flying?: boolean;
  className?: string;
}

/** Green bird SVG — matches the attached reference */
const BirdSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg
    viewBox="0 0 200 220"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: 'visible' }}
  >
    <ellipse cx="100" cy="208" rx="42" ry="10" fill="rgba(0,0,0,0.22)" />
    <ellipse cx="100" cy="130" rx="66" ry="76" fill="#5cba3c" />
    <ellipse cx="100" cy="76" rx="60" ry="62" fill="#5cba3c" />
    <ellipse cx="76" cy="74" rx="22" ry="24" fill="white" />
    <ellipse cx="124" cy="74" rx="22" ry="24" fill="white" />
    <circle cx="80" cy="78" r="13" fill="#1a1a1a" />
    <circle cx="120" cy="78" r="13" fill="#1a1a1a" />
    <circle cx="75" cy="72" r="4.5" fill="white" />
    <circle cx="115" cy="72" r="4.5" fill="white" />
    <polygon points="100,94 85,108 115,108" fill="#e87d1e" />
    <ellipse cx="82" cy="202" rx="14" ry="8" fill="#e87d1e" />
    <ellipse cx="118" cy="202" rx="14" ry="8" fill="#e87d1e" />
    <ellipse cx="44" cy="140" rx="14" ry="20" fill="#4aaa2f" />
    <ellipse cx="156" cy="140" rx="14" ry="20" fill="#4aaa2f" />
  </svg>
);

const KidAvatar: React.FC<KidAvatarProps> = ({
  avatar = 'bird',
  size = 56,
  flying = false,
  className = '',
}) => {
  const isBird = !avatar || avatar === 'bird';

  return (
    <motion.div
      className={`select-none pointer-events-none flex items-center justify-center ${className}`}
      animate={flying
        ? { x: 120, y: -30, rotate: -20, scale: 1.25, opacity: 0 }
        : { x: 0,   y: 0,   rotate: 0,   scale: 1,    opacity: 1 }
      }
      transition={{ duration: 0.38, ease: 'easeIn' }}
      style={{ width: size, height: size }}
    >
      {isBird
        ? <BirdSVG size={size} />
        : <span style={{ fontSize: size * 0.78, lineHeight: 1 }}>{avatar}</span>
      }
    </motion.div>
  );
};

export default KidAvatar;

