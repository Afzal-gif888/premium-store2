import React from 'react';
import Select from 'components/ui/Select';

const SortDropdown = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'availability', label: 'Availability' }
  ];

  return (
    <div className="w-full md:w-48 lg:w-56">
      <Select
        options={sortOptions}
        value={sortBy}
        onChange={onSortChange}
        placeholder="Sort by"
      />
    </div>
  );
};

export default SortDropdown;