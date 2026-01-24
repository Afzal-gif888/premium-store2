import React from 'react';
import Icon from 'components/AppIcon';
import { useNavigate, useLocation } from 'react-router-dom';

import { getStoreLinks } from '../../utils/locationUtils';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date()?.getFullYear();
  const storeLinks = getStoreLinks();

  const handleNavigation = (path) => {
    // If path is absolute/external or strict route (not part of single page scroll sections)
    if (!path.startsWith('#') && path !== '/') {
      navigate(path);
      return;
    }

    if (location.pathname === '/') {
      // On homepage
      if (path === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const elementId = path.replace('#', '');
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Not on homepage
      if (path === '/') {
        navigate('/');
      } else {
        navigate('/', { state: { scrollTo: path.replace('#', '') } });
      }
    }
  };

  const footerLinks = {
    shop: [
      { label: "Collection", path: "#collections" },
      { label: "New Arrivals", path: "#collections" },
      { label: "Sale Items", path: "#collections" },
      { label: "Gift Cards", path: "#" } // Placeholder
    ],
    company: [
      { label: "About Us", path: "/" },
      { label: "Announcements", path: "#announcements" },
      { label: "Store Locations", path: "#contact" },
      { label: "Contact", path: "#contact" }
    ],
    support: [
      { label: "Size Guide", path: "#" }, // Placeholder
      { label: "Care Instructions", path: "#" }, // Placeholder
      { label: "Returns Policy", path: "#" }, // Placeholder
      { label: "FAQ", path: "#" } // Placeholder
    ]
  };

  const socialLinks = [
    { icon: "Instagram", label: "Instagram", url: "https://www.instagram.com/premiumstore_2026?igsh=MXAzdTUwcHl0MnI1aQ==" },
    { icon: "MessageCircle", label: "WhatsApp", url: storeLinks.whatsappUrl },
  ];

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">

        {/* Contact Us + Socials Group */}
        <div className="flex items-center gap-8">
          {/* Contact Us */}
          <a
            href={storeLinks.callUrl}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Icon name="Phone" size={20} />
            </div>
            <span className="font-semibold hidden sm:inline">Contact Us</span>
          </a>

          {/* Divider */}
          <div className="h-8 w-px bg-border hidden sm:block"></div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socialLinks?.map((social) => (
              <a
                key={social?.label}
                href={social?.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social?.label}
                className="w-10 h-10 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-200"
              >
                <Icon name={social?.icon} size={20} />
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground opacity-60">
          &copy; {currentYear} Premium Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;