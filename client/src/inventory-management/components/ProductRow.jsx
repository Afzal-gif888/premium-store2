import React, { useState } from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import Select from '../../components/ui/Select';

const ProductRow = ({ product, onUpdate, onDelete, isEditing, onToggleEdit }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [showVariants, setShowVariants] = useState(false);

  const handleFieldChange = (field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVariantChange = (variantId, field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      variants: prev?.variants?.map(v => 
        v?.id === variantId ? { ...v, [field]: value } : v
      )
    }));
  };

  const handleSave = () => {
    onUpdate(editedProduct);
    onToggleEdit(product?.id);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    onToggleEdit(product?.id);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-error' };
    if (stock <= 5) return { label: 'Low Stock', color: 'text-warning' };
    return { label: 'In Stock', color: 'text-success' };
  };

  const categoryOptions = [
    { value: 'sneakers', label: 'Sneakers' },
    { value: 'boots', label: 'Boots' },
    { value: 'sandals', label: 'Sandals' },
    { value: 'formal', label: 'Formal Shoes' },
    { value: 'casual', label: 'Casual Shoes' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 md:p-6">
        {/* Product Image & Basic Info */}
        <div className="lg:col-span-4 flex items-start gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image 
              src={product?.image} 
              alt={product?.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={editedProduct?.name}
                  onChange={(e) => handleFieldChange('name', e?.target?.value)}
                  placeholder="Product name"
                  className="mb-2"
                />
                <Input
                  type="text"
                  value={editedProduct?.sku}
                  onChange={(e) => handleFieldChange('sku', e?.target?.value)}
                  placeholder="SKU"
                />
              </div>
            ) : (
              <>
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 truncate">
                  {product?.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">SKU: {product?.sku}</p>
              </>
            )}
          </div>
        </div>

        {/* Category & Price */}
        <div className="lg:col-span-3 space-y-2">
          {isEditing ? (
            <>
              <Select
                options={categoryOptions}
                value={editedProduct?.category}
                onChange={(value) => handleFieldChange('category', value)}
                placeholder="Select category"
              />
              <Input
                type="number"
                value={editedProduct?.price}
                onChange={(e) => handleFieldChange('price', parseFloat(e?.target?.value))}
                placeholder="Price"
              />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Icon name="Tag" size={16} color="var(--color-muted-foreground)" />
                <span className="text-sm text-foreground capitalize">{product?.category}</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-primary">
                ${product?.price?.toFixed(2)}
              </div>
            </>
          )}
        </div>

        {/* Total Stock */}
        <div className="lg:col-span-2 flex flex-col justify-center">
          {isEditing ? (
            <Input
              type="number"
              value={editedProduct?.totalStock}
              onChange={(e) => handleFieldChange('totalStock', parseInt(e?.target?.value))}
              placeholder="Total stock"
            />
          ) : (
            <>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {product?.totalStock}
              </div>
              <div className={`text-xs md:text-sm font-medium ${getStockStatus(product?.totalStock)?.color}`}>
                {getStockStatus(product?.totalStock)?.label}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="lg:col-span-3 flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                iconName="Check"
                iconPosition="left"
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVariants(!showVariants)}
                iconName={showVariants ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
              >
                Variants
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleEdit(product?.id)}
                iconName="Edit"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(product?.id)}
                iconName="Trash2"
              />
            </>
          )}
        </div>
      </div>
      {/* Variants Section */}
      {showVariants && (
        <div className="border-t border-border bg-muted/30 p-4 md:p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Package" size={16} />
            Size & Color Variants
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {product?.variants?.map((variant) => (
              <div key={variant?.id} className="bg-card rounded-lg border border-border p-3">
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={variant?.size}
                        onChange={(e) => handleVariantChange(variant?.id, 'size', e?.target?.value)}
                        placeholder="Size"
                        className="flex-1"
                      />
                      <Input
                        type="text"
                        value={variant?.color}
                        onChange={(e) => handleVariantChange(variant?.id, 'color', e?.target?.value)}
                        placeholder="Color"
                        className="flex-1"
                      />
                    </div>
                    <Input
                      type="number"
                      value={variant?.stock}
                      onChange={(e) => handleVariantChange(variant?.id, 'stock', parseInt(e?.target?.value))}
                      placeholder="Stock"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Size {variant?.size}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {variant?.color}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">{variant?.stock}</span>
                      <span className={`text-xs font-medium ${getStockStatus(variant?.stock)?.color}`}>
                        {getStockStatus(variant?.stock)?.label}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRow;