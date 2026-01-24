import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from 'components/Header';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import CallToAction from './components/CallToAction';

const Homepage = () => {
  const location = useLocation();
  const { status: productsStatus } = useSelector(state => state.stock);
  const { status: announcementsStatus } = useSelector(state => state.announcements);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        // Clear state to prevent scrolling on subsequent renders
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
      scrollRevealElements.forEach(el => observer.observe(el));
    };

    observeElements();
    const timeoutId = setTimeout(observeElements, 500);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [productsStatus, announcementsStatus]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="main-content">
        <HeroSection />
        <FeaturedProducts />
        <CallToAction />
      </main>
    </div>
  );
};

export default Homepage;