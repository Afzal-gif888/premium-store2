import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize data between backend (single image) and mock (multiple images)
  const productId = product._id || product.id;

  // Backend uses 'image', Mock uses 'images' array
  const hasImagesArray = Array.isArray(product?.images) && product.images.length > 0;
  const mainImage = hasImagesArray ? product.images[currentImageIndex]?.url : product.image;
  const imageAlt = hasImagesArray ? product.images[currentImageIndex]?.alt : product.name;
  const imageCount = hasImagesArray ? product.images.length : 1;

  const getAvailabilityBadge = () => {
    const totalStock = Array.isArray(product?.sizes)
      ? product.sizes.reduce((sum, size) => sum + size.stock, 0)
      : 0;

    if (totalStock === 0) {
      return {
        text: 'Out of Stock',
        className: 'availability-badge out-of-stock'
      };
    } else if (totalStock <= 5) {
      return {
        text: 'Low Stock',
        className: 'availability-badge low-stock'
      };
    } else {
      return {
        text: 'In Stock',
        className: 'availability-badge in-stock'
      };
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    if (!hasImagesArray) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    if (!hasImagesArray) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const badge = getAvailabilityBadge();

  return (
    <div
      className="product-card cursor-pointer group"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-muted rounded-t-lg">
        <Image
          src={mainImage}
          alt={imageAlt}
          width={800}
          height={800}
          className="product-card-image transition-transform duration-500 group-hover:scale-110"
        />

        <div className={badge.className}>
          {badge.text}
        </div>

        {product.isBestseller && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-black text-[10px] md:text-xs font-black px-2 py-1 rounded shadow-sm z-10">
            BESTSELLER
          </div>
        )}

        {hasImagesArray && imageCount > 1 && isHovered && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all z-20"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all z-20"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </>
        )}

        {hasImagesArray && imageCount > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-primary px-2' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-card-content p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="Tag" size={12} className="text-muted-foreground" />
          <span className="text-[10px] md:text-xs text-muted-foreground uppercase font-bold tracking-widest">
            {product.category || 'Collection'}
          </span>
        </div>

        <h3 className="product-card-title text-sm md:text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-1">
          <p className="product-card-price text-lg font-black text-primary">
            ₹{Number(product.price || 0).toLocaleString('en-IN')}
          </p>

          <button
            className="flex items-center gap-1.5 text-xs font-bold text-accent hover:gap-2 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <span>VIEW</span>
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;