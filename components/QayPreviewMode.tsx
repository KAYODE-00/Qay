'use client';

import { useEffect } from 'react';

export default function QayPreviewMode() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return null;
}
