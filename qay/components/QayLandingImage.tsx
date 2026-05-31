'use client';

import { useState } from 'react';

type QayLandingImageProps = {
  className?: string;
};

export function QayLandingImage({ className = '' }: QayLandingImageProps) {
  const [src, setSrc] = useState('/qay.png');

  return (
    <img
      src={src}
      alt="QAY website builder preview"
      className={className}
      onError={() => setSrc('/qayDark.svg')}
    />
  );
}
