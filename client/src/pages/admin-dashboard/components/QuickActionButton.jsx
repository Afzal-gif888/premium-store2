import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActionButton = ({ title, description, icon, iconColor, route, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-card rounded-lg p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-200 text-left w-full group hover:-translate-y-1"
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div 
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon name={icon} size={20} color={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    </button>
  );
};

export default QuickActionButton;