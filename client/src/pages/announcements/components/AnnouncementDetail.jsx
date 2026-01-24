import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnnouncementDetail = ({ announcement, onClose, onShare }) => {
  const shareOptions = [
    { name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
    { name: 'Twitter', icon: 'Twitter', color: '#1DA1F2' },
    { name: 'Instagram', icon: 'Instagram', color: '#E4405F' },
    { name: 'Link', icon: 'Link', color: 'var(--color-primary)' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 bg-card shadow-md">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Announcements
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(announcement)}
              iconName="Share2"
              iconPosition="left"
            >
              Share
            </Button>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <span className="inline-block px-4 py-2 bg-accent text-accent-foreground text-sm font-bold rounded-full uppercase tracking-wide mb-4">
              {announcement?.category}
            </span>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight" style={{ fontFamily: 'var(--font-headline)' }}>
              {announcement?.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm md:text-base text-muted-foreground">
              <span className="flex items-center gap-2">
                <Icon name="Calendar" size={18} color="var(--color-muted-foreground)" />
                {new Date(announcement.date)?.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="Clock" size={18} color="var(--color-muted-foreground)" />
                {announcement?.readTime} min read
              </span>
            </div>
          </div>
          
          <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-8 md:mb-12">
            <Image
              src={announcement?.detailImage}
              alt={announcement?.detailImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="text-base md:text-lg text-foreground leading-relaxed space-y-6">
              {announcement?.content?.split('\n')?.map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {announcement?.relatedProducts && announcement?.relatedProducts?.length > 0 && (
            <div className="mt-12 md:mt-16 pt-8 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
                Featured Products
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {announcement?.relatedProducts?.map((product) => (
                  <div key={product?.id} className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={product?.image}
                        alt={product?.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
                        {product?.name}
                      </h3>
                      <p className="text-xl font-bold text-primary">
                        ${product?.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-12 md:mt-16 pt-8 border-t border-border">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
              Share This Announcement
            </h3>
            
            <div className="flex flex-wrap gap-3 md:gap-4">
              {shareOptions?.map((option) => (
                <button
                  key={option?.name}
                  onClick={() => onShare(announcement, option?.name)}
                  className="flex items-center gap-2 px-4 md:px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-200"
                >
                  <Icon name={option?.icon} size={20} color={option?.color} />
                  <span className="text-sm md:text-base font-medium text-foreground">
                    {option?.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;