import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';

const RelatedProducts = ({ products }) => {
  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'in-stock':
        return { text: 'In Stock', className: 'availability-badge in-stock' };
      case 'low-stock':
        return { text: 'Low Stock', className: 'availability-badge low-stock' };
      case 'out-of-stock':
        return { text: 'Out of Stock', className: 'availability-badge out-of-stock' };
      default:
        return { text: 'In Stock', className: 'availability-badge in-stock' };
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          You May Also Like
        </h2>
        <Link
          to="/collection"
          className="flex items-center gap-2 text-sm md:text-base text-accent hover:text-accent/80 transition-colors"
        >
          <span>View All</span>
          <Icon name="ArrowRight" size={20} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products?.map((product) => {
          const badge = getAvailabilityBadge(product?.availability);
          
          return (
            <Link
              key={product?.id}
              to="/product-details"
              className="product-card group"
            >
              <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                <Image
                  src={product?.image}
                  alt={product?.imageAlt}
                  className="product-card-image group-hover:scale-110 transition-transform duration-300"
                />
                <span className={badge?.className}>
                  {badge?.text}
                </span>
              </div>
              <div className="product-card-content">
                <h3 className="product-card-title line-clamp-2 mb-2">
                  {product?.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {product?.category}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="product-card-price">
                      ${product?.price?.toFixed(2)}
                    </span>
                    {product?.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product?.originalPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} color="var(--color-accent)" className="fill-accent" />
                    <span className="text-sm font-medium">{product?.rating}</span>
                  </div>
                </div>

                {product?.availability === 'in-stock' && (
                  <button className="w-full mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:bg-accent/90 transition-colors">
                    View Details
                  </button>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;