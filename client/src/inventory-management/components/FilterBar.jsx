import React from 'react';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  categoryFilter, 
  onCategoryChange, 
  stockFilter, 
  onStockChange,
  onClearFilters 
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'sneakers', label: 'Sneakers' },
    { value: 'boots', label: 'Boots' },
    { value: 'sandals', label: 'Sandals' },
    { value: 'formal', label: 'Formal Shoes' },
    { value: 'casual', label: 'Casual Shoes' }
  ];

  const stockOptions = [
    { value: 'all', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || stockFilter !== 'all';

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              color="var(--color-muted-foreground)" 
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <Input
              type="search"
              placeholder="Search by name, SKU, or barcode..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-48">
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={onCategoryChange}
            placeholder="Category"
          />
        </div>

        {/* Stock Filter */}
        <div className="w-full lg:w-48">
          <Select
            options={stockOptions}
            value={stockFilter}
            onChange={onStockChange}
            placeholder="Stock Level"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            className="w-full lg:w-auto"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;