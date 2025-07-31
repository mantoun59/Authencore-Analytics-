import React, { useEffect, useState } from 'react';

interface ImagePathFixerProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ImagePathFixer: React.FC<ImagePathFixerProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/placeholder.svg' 
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      
      // Try different path variations
      if (src.startsWith('./')) {
        setImgSrc(src.replace('./', '/'));
      } else if (!src.startsWith('/') && !src.startsWith('http')) {
        setImgSrc('/' + src);
      } else {
        setImgSrc(fallbackSrc);
      }
    } else {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImagePathFixer;