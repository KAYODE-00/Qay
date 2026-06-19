'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function setExpanded(trigger: Element, isOpen: boolean) {
  if (trigger.hasAttribute('aria-expanded')) {
    trigger.setAttribute('aria-expanded', String(isOpen));
  }
}

export default function QayInteractionInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const cleanups: Array<() => void> = [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const readNumber = (target: Element, attribute: string, fallback: number, min: number, max: number) => {
      const value = Number(target.getAttribute(attribute));
      if (!Number.isFinite(value)) return fallback;
      return Math.min(Math.max(value, min), max);
    };
    const readEase = (target: Element) => target.getAttribute('data-qay-ease') || 'power2.out';

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

    if (!prefersReducedMotion) {
      const entranceTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-qay-animate]'));

      entranceTargets.forEach((target) => {
        const type = target.getAttribute('data-qay-animate');
        if (!type) return;

        const duration = readNumber(target, 'data-qay-duration', 0.75, 0.1, 2);
        const ease = readEase(target);
        const y = readNumber(target, 'data-qay-y', 36, -120, 120);
        const x = readNumber(target, 'data-qay-x', 52, -160, 160);
        const start = target.getAttribute('data-qay-scroll-start') || 'top 88%';
        const animationConfig = {
          duration,
          ease,
          scrollTrigger: {
            trigger: target,
            start,
            toggleActions: 'play none none reverse',
          },
        };

        if (type === 'stagger-children') {
          const children = Array.from(target.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
          if (!children.length) return;
          const animation = gsap.from(children, {
            opacity: 0,
            y,
            duration,
            ease,
            stagger: 0.08,
            scrollTrigger: {
              trigger: target,
              start,
              toggleActions: 'play none none reverse',
            },
          });
          cleanups.push(() => animation.kill());
          return;
        }

        const fromVars: gsap.TweenVars = { opacity: 0 };
        const toVars: gsap.TweenVars = { opacity: 1, ...animationConfig };

        if (type === 'slide-up' || type === 'scroll-reveal' || type === 'luxe-reveal' || type === 'luxe-asym-reveal' || type === 'luxe-dock-reveal') {
          fromVars.y = y;
        } else if (type === 'slide-left') {
          fromVars.x = x;
        } else if (type === 'slide-right' || type === 'sidebar-slide') {
          fromVars.x = -Math.abs(x);
        } else if (type === 'scale-in' || type === 'pop-in') {
          fromVars.scale = 0.92;
          toVars.scale = 1;
        } else if (type === 'pop-out' || type === 'zoom-out') {
          fromVars.scale = 1.12;
          toVars.scale = 1;
        } else if (type === 'hero-shrink') {
          fromVars.scale = 1.08;
          fromVars.opacity = 1;
          toVars.scale = 1;
        } else if (type === 'line-grow') {
          fromVars.opacity = 1;
          fromVars.scaleX = 0;
          toVars.scaleX = 1;
          toVars.transformOrigin = 'left center';
        }

        const animation = gsap.fromTo(target, fromVars, toVars);
        cleanups.push(() => animation.kill());
      });

      const scrollTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-qay-scroll]'));

      scrollTargets.forEach((target) => {
        const type = target.getAttribute('data-qay-scroll');
        if (!type) return;

        const start = target.getAttribute('data-qay-scroll-start') || 'top bottom';
        const end = target.getAttribute('data-qay-scroll-end') || 'bottom top';
        const scrub = target.getAttribute('data-qay-scroll-scrub') === 'false' ? false : 0.45;
        const ease = readEase(target);
        const y = readNumber(target, 'data-qay-y', -64, -260, 260);
        const x = readNumber(target, 'data-qay-x', 80, -320, 320);
        const scale = readNumber(target, 'data-qay-scale', 0.9, 0.4, 1.6);
        const rotate = readNumber(target, 'data-qay-rotate', 5, -24, 24);

        if (type === 'pin') {
          const trigger = ScrollTrigger.create({
            trigger: target,
            start: target.getAttribute('data-qay-scroll-start') || 'top top',
            end: target.getAttribute('data-qay-scroll-end') || '+=80%',
            pin: true,
            pinSpacing: true,
          });
          cleanups.push(() => trigger.kill());
          return;
        }

        const scrollTrigger = { trigger: target, start, end, scrub };
        let animation: gsap.core.Tween | null = null;

        if (type === 'parallax') {
          animation = gsap.to(target, { y, ease: 'none', scrollTrigger });
        } else if (type === 'expand') {
          animation = gsap.fromTo(target, { scale, transformOrigin: 'center center' }, { scale: 1, ease, scrollTrigger });
        } else if (type === 'shrink') {
          animation = gsap.to(target, { scale, transformOrigin: 'center center', ease, scrollTrigger });
        } else if (type === 'fade-in' || type === 'fade') {
          animation = gsap.fromTo(target, { opacity: 0.35 }, { opacity: 1, ease, scrollTrigger });
        } else if (type === 'slide' || type === 'scrub') {
          animation = gsap.to(target, { x, ease: 'none', scrollTrigger });
        } else if (type === 'rotate') {
          animation = gsap.to(target, { rotate, ease: 'none', scrollTrigger });
        } else if (type === 'blur') {
          animation = gsap.fromTo(target, { opacity: 0.45, filter: 'blur(10px)' }, { opacity: 1, filter: 'blur(0px)', ease, scrollTrigger });
        }

        if (animation) {
          cleanups.push(() => animation?.kill());
        }
      });
    }

    const hoverTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-qay-hover]'));

    hoverTargets.forEach((target) => {
      const type = target.getAttribute('data-qay-hover');
      if (!type) return;

      const safeDuration = readNumber(target, 'data-qay-hover-duration', 0.3, 0.05, 2);
      const ease = readEase(target);
      const animatedTarget = type === 'img-zoom'
        ? target.querySelector('img') as HTMLElement | null
        : target;

      if (!animatedTarget) return;

      const to = type === 'img-zoom'
        ? { scale: 1.06 }
        : type === 'lift'
          ? { y: -8 }
          : type === 'scale'
            ? { scale: 1.035 }
            : type === 'scale-btn'
              ? { scale: 1.025 }
              : type === 'luxe-lift'
                ? { y: -12, scale: 1.015 }
                : type === 'glow'
                  ? { boxShadow: '0 22px 70px rgba(99, 102, 241, 0.22)' }
                  : null;

      const handleEnter = () => {
        if (prefersReducedMotion) return;
        if (type === 'border-gold') {
          gsap.to(target, { borderColor: '#C9A84C', duration: safeDuration, ease });
          return;
        }
        if (!to) return;
        gsap.to(animatedTarget, { ...to, duration: safeDuration, ease });
      };

      const handleLeave = () => {
        if (prefersReducedMotion) return;
        if (type === 'border-gold') {
          gsap.to(target, { clearProps: 'borderColor', duration: safeDuration, ease });
          return;
        }

        if (!to) return;

        const reset: Record<string, number | string> = {};
        Object.keys(to || {}).forEach((key) => {
          reset[key] = key === 'scale' ? 1 : key === 'boxShadow' ? 'none' : 0;
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
