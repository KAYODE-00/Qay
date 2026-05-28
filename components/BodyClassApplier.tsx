'use client';

import { useLayoutEffect } from 'react';

export default function BodyClassApplier({ classes }: { classes: string }) {
  useLayoutEffect(() => {
    const classList = (classes || 'bg-white').split(/\s+/).filter(Boolean);
    document.body.classList.add(...classList);
    document.body.classList.remove('ycode-body-applied');
    document.body.classList.add('qay-body-applied');
    return () => {
      document.body.classList.remove(...classList);
      document.body.classList.remove('qay-body-applied');
    };
  }, [classes]);

  return null;
}
