import React from 'react';

interface SpiceLevelIndicatorProps {
  level: 1 | 2 | 3 | 4 | 5;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Custom authentic Chili Pepper SVG icon.
 * Designed with curved pod and stem for unmistakable culinary recognition.
 */
export const ChiliPepperIcon: React.FC<{
  className?: string;
  filled?: boolean;
  color?: string;
}> = ({ className = 'h-3.5 w-3.5', filled = true, color }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? color || 'currentColor' : 'none'}
    stroke={filled ? color || 'currentColor' : 'currentColor'}
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} shrink-0 transition-colors`}
    aria-hidden="true"
  >
    {/* Chili Pod Curved Body */}
    <path d="M13.5 3C13.5 3 14 5 11.5 6.5C8.8 8.1 6.5 11 6 14C5 18.5 8 21.5 11.5 22C15.5 22.5 18 19 17.5 15C17 11 14.5 8.5 14.5 8.5" />
    {/* Chili Stem */}
    <path d="M14 3C15.5 2 17.5 2.5 18.5 4" />
  </svg>
);

export const getSpiceInfo = (level: 1 | 2 | 3 | 4 | 5) => {
  switch (level) {
    case 1:
      return {
        label: 'Mild',
        category: 'mild' as const,
        color: '#FFD60A',
        textColor: 'text-[#FFD60A]',
        bgColor: 'bg-[#FFD60A]/10',
        borderColor: 'border-[#FFD60A]/30',
        description: 'Warm gentle spice with aromatic herbs',
      };
    case 2:
      return {
        label: 'Mild',
        category: 'mild' as const,
        color: '#F59E0B',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        description: 'Mild warmth with fragrant street masalas',
      };
    case 3:
      return {
        label: 'Medium',
        category: 'medium' as const,
        color: '#FB923C',
        textColor: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        description: 'Balanced authentic street spice punch',
      };
    case 4:
      return {
        label: 'Hot',
        category: 'hot' as const,
        color: '#F87171',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        description: 'Fiery chili heat with thecha kick',
      };
    case 5:
      return {
        label: 'Hot (5/5)',
        category: 'hot' as const,
        color: '#EF4444',
        textColor: 'text-red-500',
        bgColor: 'bg-red-500/15',
        borderColor: 'border-red-500/40',
        description: 'Scorching Guntur & Kolhapuri lavangi heat',
      };
  }
};

/**
 * SpiceLevelIndicator component displaying 1 to 5 chili icons with optional heat label.
 */
export const SpiceLevelIndicator: React.FC<SpiceLevelIndicatorProps> = ({
  level,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const info = getSpiceInfo(level);

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={`Spice Level: ${level}/5 (${info.label}) - ${info.description}`}
      aria-label={`Spice level ${level} of 5, ${info.label} heat`}
    >
      {/* 5 Chili Icons */}
      <div className="flex items-center gap-0.5" role="img" aria-hidden="true">
        {([1, 2, 3, 4, 5] as const).map((num) => {
          const isActive = num <= level;
          return (
            <ChiliPepperIcon
              key={num}
              className={`${iconSizes[size]} transition-all ${
                isActive ? '' : 'text-[#333333] opacity-40'
              }`}
              filled={isActive}
              color={isActive ? info.color : undefined}
            />
          );
        })}
      </div>

      {/* Heat Preference Label */}
      {showLabel && (
        <span
          className={`font-mono font-bold uppercase tracking-wider ${textSizes[size]} ${info.textColor}`}
        >
          {info.label}
        </span>
      )}
    </div>
  );
};

export default SpiceLevelIndicator;
