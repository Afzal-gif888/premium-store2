import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnnouncementHero = ({ announcement, onViewDetails }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
      <Image
        src={announcement?.heroImage}
        alt={announcement?.heroImageAlt}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-accent text-accent-foreground text-xs md:text-sm font-bold rounded-full uppercase tracking-wide">
              {announcement?.category}
            </span>
            <span className="text-white/80 text-xs md:text-sm flex items-center gap-2">
              <Icon name="Calendar" size={16} color="white" />
              {new Date(announcement.date)?.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            {announcement?.title}
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 line-clamp-2">
            {announcement?.excerpt}
          </p>
          
          <Button
            variant="default"
            size="lg"
            onClick={() => onViewDetails(announcement?.id)}
            iconName="ArrowRight"
            iconPosition="right"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Read Full Announcement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementHero;