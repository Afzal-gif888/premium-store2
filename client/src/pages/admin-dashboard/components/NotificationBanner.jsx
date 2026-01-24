import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NotificationBanner = ({ type, title, message, actionLabel, onAction, dismissible = true }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success/10',
          border: 'border-success/20',
          icon: 'CheckCircle',
          iconColor: 'var(--color-success)',
          textColor: 'text-success'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          icon: 'AlertTriangle',
          iconColor: 'var(--color-warning)',
          textColor: 'text-warning'
        };
      case 'error':
        return {
          bg: 'bg-error/10',
          border: 'border-error/20',
          icon: 'AlertCircle',
          iconColor: 'var(--color-error)',
          textColor: 'text-error'
        };
      default:
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/20',
          icon: 'Info',
          iconColor: 'var(--color-primary)',
          textColor: 'text-primary'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div className={`${config?.bg} border ${config?.border} rounded-lg p-4 md:p-5 mb-4 md:mb-6`}>
      <div className="flex items-start gap-3 md:gap-4">
        <div className="flex-shrink-0">
          <Icon name={config?.icon} size={20} color={config?.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm md:text-base font-semibold ${config?.textColor} mb-1`}>{title}</h4>
          <p className="text-xs md:text-sm text-foreground mb-3">{message}</p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={`${config?.textColor} text-xs md:text-sm font-medium hover:underline`}
            >
              {actionLabel} →
            </button>
          )}
        </div>
        {dismissible && (
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="Dismiss notification"
          >
            <Icon name="X" size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner;