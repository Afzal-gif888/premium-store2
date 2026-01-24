import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const InventoryAlertCard = ({ product, currentStock, threshold, severity }) => {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-error/10',
          border: 'border-error/20',
          icon: 'AlertCircle',
          iconColor: 'var(--color-error)',
          label: 'Critical',
          labelBg: 'bg-error/90',
          labelText: 'text-error-foreground'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          icon: 'AlertTriangle',
          iconColor: 'var(--color-warning)',
          label: 'Low Stock',
          labelBg: 'bg-warning/90',
          labelText: 'text-warning-foreground'
        };
      default:
        return {
          bg: 'bg-muted',
          border: 'border-border',
          icon: 'Info',
          iconColor: 'var(--color-muted-foreground)',
          label: 'Notice',
          labelBg: 'bg-muted',
          labelText: 'text-muted-foreground'
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div className={`${config?.bg} border ${config?.border} rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image 
            src={product?.image} 
            alt={product?.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h5 className="text-sm md:text-base font-semibold text-foreground line-clamp-1">{product?.name}</h5>
            <span className={`${config?.labelBg} ${config?.labelText} text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
              {config?.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Icon name={config?.icon} size={14} color={config?.iconColor} />
            <span className="text-xs md:text-sm text-foreground">
              Only <span className="font-bold">{currentStock}</span> units remaining
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Package" size={12} color="var(--color-muted-foreground)" />
            <span>Threshold: {threshold} units</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlertCard;