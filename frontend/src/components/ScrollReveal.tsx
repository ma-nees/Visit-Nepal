'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // delay in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number; // duration in milliseconds
  distance?: number; // translation distance in pixels
  threshold?: number;
  once?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 650,
  distance = 28,
  threshold = 0.12,
  once = true,
  as: Component = 'div',
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = domRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    // Check if initially in viewport (e.g. above-the-fold or already scrolled)
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Compute directional transform offset
  let initialTransform = '';
  switch (direction) {
    case 'up':
      initialTransform = `translate3d(0, ${distance}px, 0)`;
      break;
    case 'down':
      initialTransform = `translate3d(0, -${distance}px, 0)`;
      break;
    case 'left':
      initialTransform = `translate3d(${distance}px, 0, 0)`;
      break;
    case 'right':
      initialTransform = `translate3d(-${distance}px, 0, 0)`;
      break;
    case 'none':
    default:
      initialTransform = 'none';
      break;
  }

  const Tag = Component as any;

  return (
    <Tag
      ref={domRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : initialTransform,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
