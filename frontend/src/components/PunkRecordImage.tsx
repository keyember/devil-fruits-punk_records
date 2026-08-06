import React, { useState } from 'react';

interface PunkRecordImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const PUNK_RECORD_PLACEHOLDER = '/image/placeholders/akuma-no-mi-placeholder.png';

export const PunkRecordImage: React.FC<PunkRecordImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
}) => {
  const [hasError, setHasError] = useState(false);

  const displaySrc = hasError || !src ? PUNK_RECORD_PLACEHOLDER : src;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setHasError(true)}
    />
  );
};
