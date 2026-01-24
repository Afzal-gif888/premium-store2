import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { useNavigate } from 'react-router-dom';
import StoreLocationModal from 'components/StoreLocationModal';
import { getStoreLinks } from '../../utils/locationUtils';

const CallToAction = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storeLinks = getStoreLinks();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: "Instagram", label: "Instagram", url: "https://www.instagram.com/premiumstore_2026?igsh=MXAzdTUwcHl0MnI1aQ==" },
    { icon: "MessageCircle", label: "WhatsApp", url: storeLinks.whatsappUrl },
  ];

  return (
    <section id="contact" className="py-4 md:py-8 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="gradient-mesh opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center scroll-reveal">



          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Visit Our Store Today
          </h2>

          <p className="text-base md:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto mb-8 md:mb-10 lg:mb-12">
            Experience premium quality footwear in person. Check our collection online, then visit us to try on your favorites with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Button
              variant="default"
              size="lg"
              onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
              iconName="ShoppingBag"
              iconPosition="left"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Check Collection
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              iconName="Navigation"
              iconPosition="left"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Visit Store
            </Button>
          </div>

          <div className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 border-t border-primary-foreground/10 pt-12">
            <a
              href={storeLinks.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Icon name="MapPin" size={32} color="var(--color-accent)" />
              <h3 className="text-lg md:text-xl font-semibold text-primary-foreground">Location</h3>
              <p className="text-sm md:text-base opacity-80 max-w-[200px] text-center">Beside Bharath Theatre Street, Upstairs Of RI Fashion Mydukur</p>
            </a>

            <div className="flex flex-col items-center gap-3">
              <Icon name="Clock" size={32} color="var(--color-accent)" />
              <h3 className="text-lg md:text-xl font-semibold text-primary-foreground">Open Hours</h3>
              <p className="text-sm md:text-base opacity-80 text-center">Mon-Sat: 10AM-8PM<br />Sun: 8:30AM-6PM</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <a
                href={storeLinks.callUrl}
                className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Icon name="Phone" size={32} color="var(--color-accent)" />
                <h3 className="text-lg md:text-xl font-semibold text-primary-foreground">Contact Us</h3>
                <p className="text-sm md:text-base opacity-80">+91 8074463123</p>
              </a>

              {/* Social Icons moved here */}
              <div className="flex items-center gap-4 mt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-200"
                  >
                    <Icon name={social.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-primary-foreground/5 text-center">
            <p className="text-xs opacity-50">
              &copy; {currentYear} Premium Store. All rights reserved.
            </p>
          </div>

        </div>
      </div>

      <StoreLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default CallToAction;