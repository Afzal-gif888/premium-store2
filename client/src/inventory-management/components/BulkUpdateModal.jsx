import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import Select from 'components/ui/Select';

const BulkUpdateModal = ({ isOpen, onClose, selectedProducts, onBulkUpdate }) => {
  const [updateType, setUpdateType] = useState('');
  const [updateValue, setUpdateValue] = useState('');

  if (!isOpen) return null;

  const updateTypeOptions = [
    { value: 'price', label: 'Update Price' },
    { value: 'stock', label: 'Update Stock' },
    { value: 'category', label: 'Update Category' },
    { value: 'discount', label: 'Apply Discount' }
  ];

  const categoryOptions = [
    { value: 'sneakers', label: 'Sneakers' },
    { value: 'boots', label: 'Boots' },
    { value: 'sandals', label: 'Sandals' },
    { value: 'formal', label: 'Formal Shoes' },
    { value: 'casual', label: 'Casual Shoes' }
  ];

  const handleApply = () => {
    if (!updateType || !updateValue) return;
    onBulkUpdate(updateType, updateValue);
    setUpdateType('');
    setUpdateValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Edit3" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Bulk Update</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                {selectedProducts?.length} products selected
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4">
          <Select
            label="Update Type"
            options={updateTypeOptions}
            value={updateType}
            onChange={setUpdateType}
            placeholder="Select update type"
            required
          />

          {updateType === 'category' ? (
            <Select
              label="New Category"
              options={categoryOptions}
              value={updateValue}
              onChange={setUpdateValue}
              placeholder="Select category"
              required
            />
          ) : updateType === 'discount' ? (
            <Input
              label="Discount Percentage"
              type="number"
              value={updateValue}
              onChange={(e) => setUpdateValue(e?.target?.value)}
              placeholder="Enter discount %"
              min="0"
              max="100"
              required
            />
          ) : updateType === 'price' ? (
            <Input
              label="New Price"
              type="number"
              value={updateValue}
              onChange={(e) => setUpdateValue(e?.target?.value)}
              placeholder="Enter new price"
              min="0"
              required
            />
          ) : updateType === 'stock' ? (
            <Input
              label="Stock Adjustment"
              type="number"
              value={updateValue}
              onChange={(e) => setUpdateValue(e?.target?.value)}
              placeholder="Enter stock quantity"
              required
            />
          ) : null}

          {updateType && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5" />
                <p className="text-xs md:text-sm text-muted-foreground">
                  {updateType === 'discount' && 'Discount will be applied to current prices'}
                  {updateType === 'stock' && 'Stock will be added to current inventory'}
                  {updateType === 'price' && 'All selected products will have the same price'}
                  {updateType === 'category' && 'All selected products will be moved to this category'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleApply}
            disabled={!updateType || !updateValue}
            iconName="Check"
            iconPosition="left"
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateModal;