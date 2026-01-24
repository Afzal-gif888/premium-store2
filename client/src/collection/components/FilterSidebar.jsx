import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { Checkbox } from 'components/ui/Checkbox';
import Select from 'components/ui/Select';

const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  isMobileFilterOpen,
  onCloseMobileFilter
}) => {


  const sizes = ['6', '7', '8', '9', '10', '11', '12', '13'];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-100', label: 'Under ₹2,000' },
    { value: '100-200', label: '₹2,000 - ₹5,000' },
    { value: '200-300', label: '₹5,000 - ₹10,000' },
    { value: '300-500', label: '₹10,000 - ₹20,000' },
    { value: '500+', label: 'Over ₹20,000' }
  ];

  const availabilityOptions = [
    { id: 'in-stock', label: 'In Stock', color: 'success' },
    { id: 'low-stock', label: 'Low Stock', color: 'warning' },
    { id: 'out-of-stock', label: 'Out of Stock', color: 'error' }
  ];



  const handleSizeToggle = (size) => {
    const newSizes = filters?.sizes?.includes(size)
      ? filters?.sizes?.filter(s => s !== size)
      : [...filters?.sizes, size];
    onFilterChange('sizes', newSizes);
  };

  const handlePriceChange = (value) => {
    onFilterChange('priceRange', value);
  };

  const handleAvailabilityToggle = (availabilityId) => {
    const newAvailability = filters?.availability?.includes(availabilityId)
      ? filters?.availability?.filter(a => a !== availabilityId)
      : [...filters?.availability, availabilityId];
    onFilterChange('availability', newAvailability);
  };

  const FilterContent = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-foreground" style={{ fontFamily: 'var(--font-headline)' }}>
          Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          iconName="RotateCcw"
          iconSize={16}
        >
          Clear All
        </Button>
      </div>



      <div className="space-y-4">
        <h3 className="text-sm md:text-base font-semibold text-foreground" style={{ fontFamily: 'var(--font-cta)' }}>
          Size
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {sizes?.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`
                px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm md:text-base font-medium transition-all duration-200
                ${filters?.sizes?.includes(size)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm md:text-base font-semibold text-foreground" style={{ fontFamily: 'var(--font-cta)' }}>
          Price Range
        </h3>
        <Select
          options={priceRanges}
          value={filters?.priceRange}
          onChange={handlePriceChange}
          placeholder="Select price range"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm md:text-base font-semibold text-foreground" style={{ fontFamily: 'var(--font-cta)' }}>
          Availability
        </h3>
        <div className="space-y-3">
          {availabilityOptions?.map((option) => (
            <Checkbox
              key={option?.id}
              label={option?.label}
              checked={filters?.availability?.includes(option?.id)}
              onChange={() => handleAvailabilityToggle(option?.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 xl:w-80 flex-shrink-0">
        <div className="sticky top-20 bg-card rounded-lg p-6 shadow-sm">
          <FilterContent />
        </div>
      </aside>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onCloseMobileFilter}
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-card shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-4 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-headline)' }}>
                Filters
              </h2>
              <button
                onClick={onCloseMobileFilter}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                aria-label="Close filters"
              >
                <Icon name="X" size={20} color="var(--color-foreground)" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;