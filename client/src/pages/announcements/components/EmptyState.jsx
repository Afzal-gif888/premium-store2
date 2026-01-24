import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ category, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name="Search" size={48} color="var(--color-muted-foreground)" />
      </div>
      
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 text-center" style={{ fontFamily: 'var(--font-headline)' }}>
        No Announcements Found
      </h3>
      
      <p className="text-base md:text-lg text-muted-foreground mb-6 text-center max-w-md">
        {category === 'All' 
          ? "We don't have any announcements at the moment. Check back soon for exciting updates!" : `No announcements found in the"${category}" category. Try selecting a different category.`}
      </p>
      
      {category !== 'All' && (
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          iconName="RotateCcw"
          iconPosition="left"
        >
          View All Announcements
        </Button>
      )}
    </div>
  );
};

export default EmptyState;