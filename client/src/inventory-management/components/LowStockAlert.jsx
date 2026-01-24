import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const LowStockAlert = ({ products, onViewProduct }) => {
  if (products?.length === 0) return null;

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
        </div>
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
            Low Stock Alert
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {products?.length} {products?.length === 1 ? 'product needs' : 'products need'} restocking
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {products?.slice(0, 3)?.map((product) => (
          <div 
            key={product?.id} 
            className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                <Icon name="Package" size={16} color="var(--color-muted-foreground)" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{product?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Only {product?.totalStock} units left
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProduct(product?.id)}
              iconName="Eye"
            />
          </div>
        ))}
      </div>
      {products?.length > 3 && (
        <p className="text-xs text-center text-muted-foreground mt-3">
          +{products?.length - 3} more products need attention
        </p>
      )}
    </div>
  );
};

export default LowStockAlert;