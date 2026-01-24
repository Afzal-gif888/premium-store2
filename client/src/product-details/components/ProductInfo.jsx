import React from 'react';
import Icon from 'components/AppIcon';

const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/homepage" className="hover:text-foreground transition-colors">
          Home
        </a>
        <Icon name="ChevronRight" size={16} />
        <a href="/collection" className="hover:text-foreground transition-colors">
          Collection
        </a>
        <Icon name="ChevronRight" size={16} />
        <span className="text-foreground font-medium">{product?.name}</span>
      </nav>
      {/* Product Name */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          {product?.name}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">{product?.category}</p>
      </div>
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
          ₹{Number(product?.price || 0).toLocaleString('en-IN')}
        </span>
        {product?.originalPrice && (
          <span className="text-lg md:text-xl text-muted-foreground line-through">
            ₹{Number(product?.originalPrice || 0).toLocaleString('en-IN')}
          </span>
        )}
      </div>
      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)]?.map((_, index) => (
            <Icon
              key={index}
              name={index < Math.floor(product?.rating) ? 'Star' : 'Star'}
              size={20}
              color={index < Math.floor(product?.rating) ? 'var(--color-accent)' : 'var(--color-border)'}
              className={index < Math.floor(product?.rating) ? 'fill-accent' : ''}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product?.rating} ({product?.reviewCount} reviews)
        </span>
      </div>
      {/* Description */}
      <div className="border-t border-border pt-4 md:pt-6">
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">
          Product Description
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {product?.description}
        </p>
      </div>
      {/* Key Features */}
      <div className="border-t border-border pt-4 md:pt-6">
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">
          Key Features
        </h2>
        <ul className="space-y-2">
          {product?.features?.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Icon name="Check" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Materials & Construction */}
      <div className="border-t border-border pt-4 md:pt-6">
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">
          Materials & Construction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3">
            <Icon name="Package" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Upper Material</p>
              <p className="text-sm text-muted-foreground">{product?.materials?.upper}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="Layers" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Sole Material</p>
              <p className="text-sm text-muted-foreground">{product?.materials?.sole}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="Sparkles" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Lining</p>
              <p className="text-sm text-muted-foreground">{product?.materials?.lining}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="Shield" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Insole</p>
              <p className="text-sm text-muted-foreground">{product?.materials?.insole}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Care Instructions */}
      <div className="border-t border-border pt-4 md:pt-6">
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">
          Care Instructions
        </h2>
        <ul className="space-y-2">
          {product?.careInstructions?.map((instruction, index) => (
            <li key={index} className="flex items-start gap-3">
              <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base text-muted-foreground">{instruction}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;