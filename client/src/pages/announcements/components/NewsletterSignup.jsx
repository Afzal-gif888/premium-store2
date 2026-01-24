import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e?.preventDefault();
    setError('');

    if (!email) {
      setError('Email address is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex?.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-accent rounded-full mb-4 md:mb-6">
          <Icon name="Bell" size={32} color="var(--color-accent-foreground)" />
        </div>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 md:mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
          Never Miss an Update
        </h2>
        
        <p className="text-base md:text-lg text-primary-foreground/90 mb-6 md:mb-8">
          Subscribe to our newsletter and be the first to know about exclusive sales, new arrivals, and special events at Premium Store.
        </p>
        
        {isSubscribed ? (
          <div className="flex items-center justify-center gap-3 p-4 bg-success/20 rounded-lg">
            <Icon name="CheckCircle" size={24} color="var(--color-success)" />
            <span className="text-lg font-semibold text-primary-foreground">
              Successfully subscribed! Check your inbox.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
                error={error}
                className="bg-white"
              />
            </div>
            
            <Button
              type="submit"
              variant="default"
              size="lg"
              iconName="Send"
              iconPosition="right"
              className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap"
            >
              Subscribe Now
            </Button>
          </form>
        )}
        
        <p className="text-xs md:text-sm text-primary-foreground/70 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;