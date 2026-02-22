/**
 * Image Optimization Utilities
 *
 * This module provides utilities for optimized image handling in Next.js.
 * It includes WebP conversion, responsive sizing, and lazy loading strategies.
 */

import { useState, useRef, useEffect } from 'react';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Convert image path to WebP format
 */
export const getWebpSrc = (src: string): string => {
  if (typeof window !== 'undefined') {
    // Check if browser supports WebP
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      ? src.replace(/\.(jpe?g|png)$/, '.webp')
      : src;
  }
  return src.replace(/\.(jpe?g|png)$/, '.webp');
};

/**
 * Get responsive sizes based on breakpoints
 */
export const getResponsiveSizes = (
  defaultWidth: number = 300,
  breakpoints: string[] = ['640px', '750px', '828px', '1080px', '1200px', '1920px']
): string => {
  return breakpoints.map(bp => `(max-width: ${bp}) ${Math.round(defaultWidth * 0.7)}`).join(', ') + `, ${defaultWidth}px`;
};

/**
 * Predefined optimized image configurations
 */
export const optimizedImages = {
  profile: {
    src: '/pranav_amara.jpg',
    width: 300,
    height: 300,
    sizes: getResponsiveSizes(300),
    priority: true,
    className: 'w-full h-full object-cover object-top',
  },
  icon: {
    width: 192,
    height: 192,
    sizes: '192px',
  },
  appleTouch: {
    width: 180,
    height: 180,
    sizes: '180px',
  },
};

/**
 * Image optimization helper component
 */
export function OptimizedImage({
  src,
  alt,
  width = 300,
  height = 300,
  priority = false,
  className = '',
  sizes = getResponsiveSizes()
}: OptimizedImageProps) {
  const webpSrc = getWebpSrc(src);

  // In a real implementation, you'd use this with Next.js Image
  // This is a utility function for reference
  return {
    src: webpSrc,
    alt,
    width,
    height,
    priority,
    className,
    sizes,
    loading: priority ? 'eager' : 'lazy',
  };
}

/**
 * Lazy image loading hook
 */
export const useLazyImage = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

// Browser compatibility check
export const isWebpSupported = (): boolean => {
  try {
    return (
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
    );
  } catch {
    return false;
  }
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};