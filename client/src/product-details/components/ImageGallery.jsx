import React, { useState } from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';

const ImageGallery = ({ images, productName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images?.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images?.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="w-full">
      {/* Main Image Display */}
      <div className="relative bg-muted rounded-lg overflow-hidden mb-4 md:mb-6">
        <div className="aspect-square relative">
          <Image
            src={images?.[selectedImageIndex]?.url}
            alt={images?.[selectedImageIndex]?.alt}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={toggleZoom}
          />
          
          {/* Navigation Arrows */}
          {images?.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <Icon name="ChevronLeft" size={24} color="var(--color-foreground)" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-lg"
                aria-label="Next image"
              >
                <Icon name="ChevronRight" size={24} color="var(--color-foreground)" />
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
            <Icon name={isZoomed ? 'ZoomOut' : 'ZoomIn'} size={16} color="var(--color-foreground)" />
            <span className="text-xs font-medium">
              {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
            </span>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium">
              {selectedImageIndex + 1} / {images?.length}
            </span>
          </div>
        </div>
      </div>
      {/* Thumbnail Gallery */}
      {images?.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
          {images?.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-accent shadow-lg scale-105'
                  : 'border-border hover:border-accent/50'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image?.url}
                alt={image?.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;