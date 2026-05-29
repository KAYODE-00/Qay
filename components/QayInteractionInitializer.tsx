'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

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

    const hoverTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-qay-hover]'));

    hoverTargets.forEach((target) => {
      const type = target.getAttribute('data-qay-hover');
      if (!type) return;
      if (type !== 'img-zoom' && type !== 'border-gold') return;

      const duration = Number(target.getAttribute('data-qay-hover-duration') || '0.3');
      const safeDuration = Number.isFinite(duration) ? Math.min(Math.max(duration, 0.05), 2) : 0.3;
      const ease = target.getAttribute('data-qay-ease') || 'power2.out';
      const animatedTarget = type === 'img-zoom'
        ? target.querySelector('img') as HTMLElement | null
        : target;

      if (!animatedTarget) return;

      const to = type === 'img-zoom' ? { scale: 1.06 } : null;

      const handleEnter = () => {
        if (type === 'border-gold') {
          gsap.to(target, { borderColor: '#C9A84C', duration: safeDuration, ease });
          return;
        }
        gsap.to(animatedTarget, { ...to, duration: safeDuration, ease });
      };

      const handleLeave = () => {
        if (type === 'border-gold') {
          gsap.to(target, { clearProps: 'borderColor', duration: safeDuration, ease });
          return;
        }

        const reset: Record<string, number> = {};
        Object.keys(to || {}).forEach((key) => {
          reset[key] = key === 'scale' ? 1 : 0;
        });
        gsap.to(animatedTarget, { ...reset, duration: safeDuration, ease });
      };

      target.addEventListener('mouseenter', handleEnter);
      target.addEventListener('mouseleave', handleLeave);
      cleanups.push(() => {
        target.removeEventListener('mouseenter', handleEnter);
        target.removeEventListener('mouseleave', handleLeave);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
