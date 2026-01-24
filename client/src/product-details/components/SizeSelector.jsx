import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SizeSelector = ({ sizes, onSizeSelect }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleSizeClick = (size) => {
    if (size?.available) {
      setSelectedSize(size?.size);
      onSizeSelect(size);
    }
  };

  const getAvailabilityBadge = (stock) => {
    if (stock === 0) {
      return { text: 'Out of Stock', className: 'availability-badge out-of-stock' };
    } else if (stock <= 3) {
      return { text: `Only ${stock} left`, className: 'availability-badge low-stock' };
    } else {
      return { text: 'In Stock', className: 'availability-badge in-stock' };
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Size Selection Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          Select Size
        </h2>
        <button
          onClick={() => setShowSizeGuide(!showSizeGuide)}
          className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          <Icon name="Ruler" size={16} />
          <span>Size Guide</span>
        </button>
      </div>
      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="bg-muted rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-semibold text-foreground">
              Size Guide
            </h3>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors"
              aria-label="Close size guide"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-semibold">US Size</th>
                  <th className="text-left py-2 px-3 font-semibold">UK Size</th>
                  <th className="text-left py-2 px-3 font-semibold">EU Size</th>
                  <th className="text-left py-2 px-3 font-semibold">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">7</td>
                  <td className="py-2 px-3">6</td>
                  <td className="py-2 px-3">40</td>
                  <td className="py-2 px-3">25.0</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">8</td>
                  <td className="py-2 px-3">7</td>
                  <td className="py-2 px-3">41</td>
                  <td className="py-2 px-3">25.7</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">9</td>
                  <td className="py-2 px-3">8</td>
                  <td className="py-2 px-3">42</td>
                  <td className="py-2 px-3">26.4</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">10</td>
                  <td className="py-2 px-3">9</td>
                  <td className="py-2 px-3">43</td>
                  <td className="py-2 px-3">27.1</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">11</td>
                  <td className="py-2 px-3">10</td>
                  <td className="py-2 px-3">44</td>
                  <td className="py-2 px-3">27.8</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">12</td>
                  <td className="py-2 px-3">11</td>
                  <td className="py-2 px-3">45</td>
                  <td className="py-2 px-3">28.5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-background rounded-lg p-3 md:p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              How to Measure Your Foot
            </h4>
            <ol className="text-xs md:text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Stand on a piece of paper with your heel against a wall</li>
              <li>Mark the longest part of your foot on the paper</li>
              <li>Measure the distance from the wall to the mark</li>
              <li>Compare your measurement with the chart above</li>
              <li>If between sizes, we recommend sizing up</li>
            </ol>
          </div>
        </div>
      )}
      {/* Size Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
        {sizes?.map((size) => {
          const badge = getAvailabilityBadge(size?.stock);
          const isSelected = selectedSize === size?.size;
          const isAvailable = size?.available;

          return (
            <button
              key={size?.size}
              onClick={() => handleSizeClick(size)}
              disabled={!isAvailable}
              className={`relative aspect-square rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-accent bg-accent/10 scale-105'
                  : isAvailable
                  ? 'border-border hover:border-accent/50 hover:bg-muted' :'border-border bg-muted opacity-50 cursor-not-allowed'
              }`}
              aria-label={`Size ${size?.size} ${!isAvailable ? '(Out of stock)' : ''}`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-base md:text-lg font-bold ${
                    isSelected ? 'text-accent' : 'text-foreground'
                  }`}
                >
                  {size?.size}
                </span>
                {!isAvailable && (
                  <span className="text-xs text-error mt-1">Out</span>
                )}
              </div>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="Check" size={12} color="var(--color-accent-foreground)" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {/* Selected Size Info */}
      {selectedSize && (
        <div className="bg-muted rounded-lg p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                Size {selectedSize} Selected
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {sizes?.find((s) => s?.size === selectedSize)?.fitNote}
              </p>
              <div className="flex items-center gap-2">
                {(() => {
                  const selectedSizeData = sizes?.find((s) => s?.size === selectedSize);
                  const badge = getAvailabilityBadge(selectedSizeData?.stock);
                  return (
                    <span className={badge?.className}>
                      {badge?.text}
                    </span>
                  );
                })()}
              </div>
            </div>
            <Icon name="CheckCircle2" size={32} color="var(--color-accent)" />
          </div>
        </div>
      )}
      {/* Fit Recommendation */}
      <div className="bg-background border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
              Fit Recommendation
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              This style runs true to size. We recommend ordering your regular size. For half sizes, we suggest sizing up for the best fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeSelector;