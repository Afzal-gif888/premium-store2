import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, iconColor }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{value}</h3>
        </div>
        <div 
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon name={icon} size={20} color={iconColor} />
        </div>
      </div>
      {change && (
        <div className={`flex items-center gap-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={14} />
          <span className="text-xs md:text-sm font-medium">{change}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;