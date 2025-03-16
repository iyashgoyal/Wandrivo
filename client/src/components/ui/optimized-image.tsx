import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderSrc?: string;
}

/**
 * OptimizedImage component that implements blur-up technique for loading images
 * - Shows a blurred placeholder while the main image loads
 * - Handles the loading state transitions with nice fades
 * - Supports custom classes
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderSrc,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  
  // Default low quality placeholder - blurred version
  const defaultPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIxAAAQMDBAIDAAAAAAAAAAAAAQIDBQAEBgcREjETIRQiQf/EABUBAQEAAAAAAAAAAAAAAAAAAAQI/8QAHBEAAgIDAQEAAAAAAAAAAAAAAQIAAxESQQRR/9oADAMBAAIRAxEAPwCl6WW7aayWKqRcyFpU3HaK1v2rbBQgJ9nZvkVE8fqFg1xZ3NlAmTdvJQtKVIS8FfYnYnwmoXRjP7e5w+JYx7y5upS1fWNs6sK8Tj7vJwHIgDcgEkAgnY7U1FxpNlZ2Tky+ekoLizxWqQt4k+tx1KRBPPkSfV0dYaKTRFG8Uii8nE0//9k=";
  
  useEffect(() => {
    // Preload the actual image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src]);
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {/* Low quality placeholder */}
      <img 
        src={placeholderSrc || defaultPlaceholder} 
        alt={alt}
        width={width}
        height={height}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100 blur-sm'}`}
      />
      
      {/* Main image */}
      <img 
        src={imgSrc || placeholderSrc || defaultPlaceholder} 
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export default OptimizedImage; 