import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityItem = ({ type, title, description, timestamp, status }) => {
  const getActivityIcon = () => {
    switch (type) {
      case 'sale':
        return { name: 'ShoppingCart', color: 'var(--color-success)' };
      case 'inventory':
        return { name: 'Package', color: 'var(--color-accent)' };
      case 'announcement':
        return { name: 'Megaphone', color: 'var(--color-primary)' };
      case 'alert':
        return { name: 'AlertTriangle', color: 'var(--color-warning)' };
      default:
        return { name: 'Activity', color: 'var(--color-muted-foreground)' };
    }
  };

  const getStatusBadge = () => {
    if (!status) return null;
    
    const statusConfig = {
      completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
      urgent: { bg: 'bg-error/10', text: 'text-error', label: 'Urgent' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`${config?.bg} ${config?.text} text-xs font-medium px-2 py-1 rounded-full`}>
        {config?.label}
      </span>
    );
  };

  const activityIcon = getActivityIcon();

  return (
    <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 hover:bg-muted/50 rounded-lg transition-colors duration-200">
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${activityIcon?.color}15` }}
      >
        <Icon name={activityIcon?.name} size={16} color={activityIcon?.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h5 className="text-sm md:text-base font-medium text-foreground">{title}</h5>
          {getStatusBadge()}
        </div>
        <p className="text-xs md:text-sm text-muted-foreground mb-1 line-clamp-2">{description}</p>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  );
};

export default ActivityItem;