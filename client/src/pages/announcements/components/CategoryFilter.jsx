import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-card rounded-xl shadow-md p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-headline)' }}>
        <Icon name="Filter" size={20} color="var(--color-primary)" />
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2 md:gap-3">
        <button
          onClick={() => onCategoryChange('All')}
          className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
            activeCategory === 'All' ?'bg-primary text-primary-foreground shadow-md' :'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All Announcements
        </button>
        
        {categories?.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;