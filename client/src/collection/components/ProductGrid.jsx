import React from 'react';
import ProductCard from './ProductCard';
import Icon from 'components/AppIcon';

const ProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)]?.map((_, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm">
            <div className="w-full aspect-square skeleton skeleton-shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-5 skeleton skeleton-shimmer rounded" />
              <div className="h-4 skeleton skeleton-shimmer rounded w-2/3" />
              <div className="h-6 skeleton skeleton-shimmer rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6">
          <Icon name="SearchX" size={32} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
          No Products Found
        </h3>
        <p className="text-sm md:text-base text-muted-foreground text-center max-w-md" style={{ fontFamily: 'var(--font-body)' }}>
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products?.map((product) => (
        <ProductCard key={product?._id || product?.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;