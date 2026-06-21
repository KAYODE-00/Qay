'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/* ── Mobile Navigation Menu ──────────────────────────────────────────── */
export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current || !overlayRef.current) return;
    if (open) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        panelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      );
      // Stagger child links
      const items = panelRef.current.querySelectorAll('[data-nav-item]');
      gsap.fromTo(
        items,
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, stagger: 0.06, duration: 0.35, ease: 'power2.out', delay: 0.15 }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' });
      gsap.to(panelRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' });
    }
  }, [open]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      {/* Hamburger button - visible on mobile */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative z-50 flex size-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-card transition hover:bg-accent md:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
        id="mobile-menu-toggle"
      >
        <span
          className="block h-0.5 w-5 rounded-full bg-foreground transition-all duration-300"
          style={{
            transform: open ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none',
          }}
        />
        <span
          className="block h-0.5 w-5 rounded-full bg-foreground transition-all duration-300"
          style={{
            opacity: open ? 0 : 1,
            transform: open ? 'scaleX(0)' : 'scaleX(1)',
          }}
        />
        <span
          className="block h-0.5 w-5 rounded-full bg-foreground transition-all duration-300"
          style={{
            transform: open ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none',
          }}
        />
      </button>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        style={{ opacity: 0, pointerEvents: open ? 'auto' : 'none' }}
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        className="fixed inset-y-0 right-0 z-50 flex w-[min(320px,85vw)] flex-col bg-card/95 backdrop-blur-xl shadow-2xl md:hidden"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="text-sm font-semibold tracking-wide text-foreground">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label="Close menu"
          >
            <svg
              width="16" height="16"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <line
                x1="18" y1="6"
                x2="6" y2="18"
              />
              <line
                x1="6" y1="6"
                x2="18" y2="18"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4" onClick={() => setOpen(false)}>
          {children}
        </nav>
      </div>
    </>
  );
}

/* Individual link for mobile navigation */
export function MobileNavLink({
  href,
  children,
  variant = 'default',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'outline';
}) {
  const base = 'flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200';
  const styles = {
    default: `${base} text-foreground hover:bg-accent hover:pl-5`,
    primary: `${base} bg-foreground text-background justify-center mt-2 hover:bg-foreground/90`,
    outline: `${base} border border-border text-muted-foreground justify-center hover:bg-accent hover:text-foreground`,
  };

  return (
    <a
      href={href} data-nav-item
      className={styles[variant]}
    >
      {children}
    </a>
  );
}

/* ── GSAP Scroll Animations ──────────────────────────────────────────── */
export function LandingScrollAnimations() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector((anchor as HTMLAnchorElement).getAttribute('href') || '');
          if (target) {
            gsap.to(window, {
              scrollTo: { y: target as Element, offsetY: 80 },
              duration: 0.9,
              ease: 'power3.inOut',
            });
          }
        });
      });

      // ── Section headers: slide up + fade ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // ── Stagger children cards ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-stagger]').forEach((container) => {
        const items = container.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 36, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // ── Parallax elements ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.gsapParallax || '0.3');
        gsap.to(el, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // ── Scale in from small ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-scale]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.88, borderRadius: '24px' },
          {
            opacity: 1,
            scale: 1,
            borderRadius: '12px',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // ── Scrub scale (expands as you scroll, reverses on scroll back) ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-scrub-scale]').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.9, opacity: 0.85 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'top 40%',
              scrub: true,
            },
          }
        );
      });

      // ── On-load shrink (e.g. hero image/bg size decreases with ease) ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-onload-shrink]').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.15, opacity: 0.75 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: 'power4.out',
          }
        );
      });

      // ── Horizontal text slide (ticker effect) ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-ticker]').forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      // ── Fade in/out on scroll ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-fade-scroll]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.3 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 40%',
              scrub: true,
            },
          }
        );
      });

      // ── Hover lift effect on cards ──
      gsap.utils.toArray<HTMLElement>('[data-gsap-hover-lift]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          gsap.to(el, {
            y: -6,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            y: 0,
            scale: 1,
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });

      // ── Navbar reveal on scroll ──
      const header = document.querySelector('[data-gsap-header]');
      if (header) {
        let lastScrollY = 0;
        ScrollTrigger.create({
          start: 'top -80',
          onUpdate: (self) => {
            const scrollY = self.scroll();
            if (scrollY > 100) {
              (header as HTMLElement).classList.add(
                'backdrop-blur-xl',
                'bg-background/80',
                'shadow-[0_1px_0_rgba(0,0,0,0.06)]'
              );
            } else {
              (header as HTMLElement).classList.remove(
                'backdrop-blur-xl',
                'bg-background/80',
                'shadow-[0_1px_0_rgba(0,0,0,0.06)]'
              );
            }
            if (scrollY > lastScrollY && scrollY > 400) {
              gsap.to(header, { y: -100, duration: 0.3, ease: 'power2.in' });
            } else {
              gsap.to(header, { y: 0, duration: 0.3, ease: 'power2.out' });
            }
            lastScrollY = scrollY;
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
