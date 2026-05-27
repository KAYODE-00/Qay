'use client';

import { useEffect } from 'react';

function setExpanded(trigger: Element, isOpen: boolean) {
  if (trigger.hasAttribute('aria-expanded')) {
    trigger.setAttribute('aria-expanded', String(isOpen));
  }
}

export default function QayInteractionInitializer() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const triggers = Array.from(document.querySelectorAll('[data-qay-click="toggle"][data-qay-target]'));

    triggers.forEach((trigger) => {
      const targetSelector = trigger.getAttribute('data-qay-target');
      if (!targetSelector) return;

      const className = trigger.getAttribute('data-qay-class') || 'hidden';
      const target = document.querySelector(targetSelector);
      if (!target) return;

      const handleClick = (event: Event) => {
        const tagName = trigger.tagName.toLowerCase();
        if (tagName !== 'a') {
          event.preventDefault();
        }

        const isOpen = target.classList.toggle(className) === false;
        setExpanded(trigger, isOpen);
      };

      trigger.addEventListener('click', handleClick);
      cleanups.push(() => trigger.removeEventListener('click', handleClick));
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
