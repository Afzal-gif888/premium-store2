import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnnouncementCard = ({ announcement, onViewDetails }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Sale': 'bg-error/10 text-error',
      'New Arrivals': 'bg-success/10 text-success',
      'Events': 'bg-warning/10 text-warning',
      'Store Updates': 'bg-primary/10 text-primary'
    };
    return colors?.[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden">
        <Image
          src={announcement?.image}
          alt={announcement?.imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${getCategoryColor(announcement?.category)}`}>
            {announcement?.category}
          </span>
        </div>
      </div>
      <div className="p-4 md:p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-3 text-xs md:text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
          <span>{new Date(announcement.date)?.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}</span>
        </div>
        
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-headline)' }}>
          {announcement?.title}
        </h3>
        
        <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-3">
          {announcement?.excerpt}
        </p>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(announcement?.id)}
          iconName="ArrowRight"
          iconPosition="right"
          fullWidth
        >
          Read More
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementCard;