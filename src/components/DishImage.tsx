import React, { useState } from 'react';
import { getImagePath } from '../utils/getImagePath';

interface DishImageProps {
  slug?: string;
  name: string;
  category?: string;
  className?: string;
  width?: number;
  height?: number;
  isThumbnail?: boolean;
}

export const DishImage: React.FC<DishImageProps> = ({
  slug,
  name,
  category,
  className = '',
  width = 400,
  height = 300,
  isThumbnail = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageSrc = getImagePath(slug);
  const monogram = name ? name.trim().charAt(0).toUpperCase() : 'E';
  const altText = `Artisanal dish: ${name}`;

  // Clean Typography-Only Monogram Fallback
  if (hasError || !imageSrc) {
    if (isThumbnail) {
      return (
        <div
          className="flex h-full w-full items-center justify-center rounded-lg bg-[#141414] border border-[#262626] p-1 text-center select-none"
          title={name}
          role="img"
          aria-label={altText}
        >
          <span className="font-bebas text-lg font-bold text-[#FFD60A]">{monogram}</span>
        </div>
      );
    }

    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#141414] border border-[#262626] p-6 text-center select-none"
        role="img"
        aria-label={altText}
      >
        <span className="font-bebas text-6xl text-[#FFD60A] tracking-wider leading-none select-none">
          {monogram}
        </span>
        <h4 className="mt-3 font-sora text-sm font-bold text-[#F5F5F5] line-clamp-2 px-2">
          {name}
        </h4>
        {category && (
          <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#A3A3A3]">
            {category}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#141414]">
      {/* Shimmer skeleton with translateX pseudo-element (no background-position animation) */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#141414] skeleton-shimmer">
          <span className="font-bebas text-4xl text-[#262626] select-none">
            {monogram}
          </span>
        </div>
      )}

      <img
        src={imageSrc}
        alt={altText}
        loading="lazy"
        width={width}
        height={height}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setImageLoaded(true)}
        onError={() => setHasError(true)}
        className={`dish-img ${className} ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]`}
      />
    </div>
  );
};

export default DishImage;
