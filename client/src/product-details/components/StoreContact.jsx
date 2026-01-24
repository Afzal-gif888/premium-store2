import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import StoreLocationModal from 'components/StoreLocationModal';
import { STORE_LOCATION, getStoreStatus } from 'utils/locationUtils';

const StoreContact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const status = getStoreStatus();

  const contactInfo = [
    {
      icon: 'MapPin',
      title: 'Visit Our Store',
      content: STORE_LOCATION.address,
      action: 'Check Distance & Directions',
      onClick: () => setIsModalOpen(true)
    },
    {
      icon: 'Phone',
      title: 'Call Us',
      content: STORE_LOCATION.phone,
      action: 'Call Now',
      link: `tel:${STORE_LOCATION.phone}`
    },
    {
      icon: 'Clock',
      title: 'Store Hours',
      content: 'Mon-Sat: 10AM-8PM • Sun: 10AM-6PM',
      statusBadge: status.label,
      isOpen: status.isOpen
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Store" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-display">
            In-Store Pick Up
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visit us to try on your favorites
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {contactInfo.map((info, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <Icon name={info.icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-foreground">
                  {info.title}
                </h3>
                {info.statusBadge && (
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${info.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                    {info.statusBadge}
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground whitespace-pre-line mb-3 leading-relaxed">
                {info.content}
              </p>
              {info.action && (
                info.onClick ? (
                  <button
                    onClick={info.onClick}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                  >
                    <span>{info.action}</span>
                    <Icon name="ArrowRight" size={12} />
                  </button>
                ) : (
                  <a
                    href={info.link}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                  >
                    <span>{info.action}</span>
                    <Icon name="ArrowRight" size={12} />
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Icon name="Info" size={18} className="text-primary flex-shrink-0" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              Store Preview
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              We are an offline retail showcase. Check product availability before visiting. Our staff is ready to help you find the perfect fit.
            </p>
          </div>
        </div>
      </div>

      <StoreLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StoreContact;