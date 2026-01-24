
import React from 'react';

/**
 * Helper to determine the backend API base URL.
 * In a local network dev environment, we need the computer's IP, 
 * not 'localhost', so mobile devices can reach the server.
 */
import { getImageUrl } from 'config/api';

function Image({
  src,
  alt = "Product Image",
  className = "",
  loading = "lazy",
  width,
  height,
  ...props
}) {
  // Resolve source using central config
  const resolvedSrc = React.useMemo(() => {
    return getImageUrl(src, { width, height });
  }, [src, width, height]);

  const handleImageError = (e) => {
    const currentHost = window.location.hostname;
    const originalSrc = e.target.src;

    // Resiliency: If image fails and it points to localhost/127.0.0.1, BUT we are on a different IP (mobile),
    // it means the backend URL generation might have missed the correct IP.
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
    const srcHasLocalhost = originalSrc.includes('localhost') || originalSrc.includes('127.0.0.1');

    if (!isLocalhost && srcHasLocalhost && !e.target.dataset.retried) {
      const newSrc = originalSrc.replace(/localhost|127\.0\.0\.1/, currentHost);
      console.warn(`[Mobile Fix] Redirecting localhost image to ${currentHost}: ${newSrc}`);

      e.target.dataset.retried = "true";
      e.target.src = newSrc;
      return;
    }

    // Simplified Fallback: Use reliable placeholder immediately
    // Simplified Fallback: Use reliable inline SVG immediately
    if (!e.target.dataset.fallback) {
      e.target.dataset.fallback = "true";
      // Inline SVG: Gray background with "No Image" text (Offline proof)
      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
      e.target.onerror = null; // Prevent infinite loop
    }
  };

  return (
    <img
      src={resolvedSrc || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E"}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleImageError}
      style={{ objectFit: 'cover', ...props.style }}
      {...props}
    />
  );
}

export default Image;
