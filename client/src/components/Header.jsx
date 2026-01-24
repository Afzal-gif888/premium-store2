import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from './AppIcon';
import { getImageUrl } from 'config/api';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (id) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'announcements', label: 'Announcements', icon: 'Bell' },
    { id: 'collections', label: 'Collections', icon: 'ShoppingBag' },
    { id: 'contact', label: 'Contact', icon: 'Phone' },
  ];

  return (
    <>
      <header className="header sticky top-0 z-50 bg-white shadow-sm">
        <div className="header-container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="header-logo flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-full border border-gray-100 shadow-sm bg-white shrink-0">
              <img
                src="/assets/images/logo.jpg"
                alt="Premium Store Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="header-logo-text font-bold text-xl text-primary">Premium Store</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="header-nav hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="header-nav-link"
              >
                {item.label}
              </button>
            ))}
            <Link to="/admin" className="admin-btn ml-2">
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="header-actions md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 transition-transform active:scale-90"
              aria-label="Toggle mobile menu"
            >
              <Icon
                name={isMobileMenuOpen ? 'X' : 'Menu'}
                size={24}
                color="var(--color-primary)"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay fixed inset-0 z-[60] bg-white pt-20 px-4">
          <nav className="mobile-menu-nav flex flex-col gap-3">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="mobile-menu-link group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon name={item.icon} size={20} className="text-slate-400 group-hover:text-primary" />
                </div>
                <span className="font-semibold text-slate-700">{item.label}</span>
              </button>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-bold"
            >
              <Icon name="LayoutDashboard" size={20} />
              <span>Admin Panel</span>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;