import React from 'react';
import Icon from 'components/AppIcon';

const StatsCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{value}</h3>
          {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${colorClasses?.[color]} flex items-center justify-center flex-shrink-0`}>
          <Icon name={icon} size={20} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
            size={16} 
            color={`var(--color-${trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'muted-foreground'})`}
          />
          <span className={`text-xs md:text-sm font-medium ${trendColors?.[trend]}`}>
            {trendValue}
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;