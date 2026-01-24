import React from 'react';
import Icon from 'components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      id: 1,
      icon: "CheckCircle2",
      title: "Real-Time Availability",
      description: "Know exactly what\'s in stock before you visit. No more wasted trips or disappointments."
    },
    {
      id: 2,
      icon: "Shield",
      title: "Premium Quality Guaranteed",
      description: "Every product meets our strict quality standards. Your satisfaction is our priority."
    },
    {
      id: 3,
      icon: "Clock",
      title: "Save Your Time",
      description: "Browse, check availability, and plan your visit efficiently. Your time is valuable."
    },
    {
      id: 4,
      icon: "Award",
      title: "Expert Curation",
      description: "Handpicked selection of premium footwear from trusted brands and designers."
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="text-center mb-8 md:mb-12 lg:mb-16 scroll-reveal">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Why Choose Premium Store
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your smart retail companion that enhances the shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustFeatures?.map((feature, index) => (
            <div 
              key={feature?.id}
              className="scroll-reveal bg-card rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 mb-4 md:mb-6">
                <Icon 
                  name={feature?.icon} 
                  size={32} 
                  color="var(--color-accent)" 
                  strokeWidth={2}
                />
              </div>

              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-3 md:mb-4">
                {feature?.title}
              </h3>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustSignals;