import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnnouncements } from '../../store/slices/announcementSlice';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import AnnouncementHero from './components/AnnouncementHero';
import AnnouncementDetail from './components/AnnouncementDetail';
import NewsletterSignup from './components/NewsletterSignup';
import EmptyState from './components/EmptyState';

const Announcements = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);

  const { items: announcements, status } = useSelector(state => state.announcements);
  const isLoading = status === 'loading' || status === 'idle';

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Map backend announcement to component format
  const formatAnnouncement = (a) => {
    if (!a) return null;
    return {
      id: a._id,
      category: "Latest Update", // Default category
      title: a.title,
      excerpt: a.description,
      content: a.description,
      date: a.createdAt,
      readTime: 2, // Default read time
      heroImage: a.image,
      heroImageAlt: a.title,
      image: a.image,
      imageAlt: a.title,
      detailImage: a.image,
      detailImageAlt: a.title,
      relatedProducts: [] // Empty by default
    };
  };

  const featuredAnnouncement = announcements.length > 0 ? formatAnnouncement(announcements[0]) : null;

  const handleViewDetails = (id) => {
    const raw = announcements.find((a) => a._id === id);
    if (raw) {
      setSelectedAnnouncement(formatAnnouncement(raw));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCloseDetail = () => {
    setSelectedAnnouncement(null);
  };

  const handleShare = (announcement, platform = 'Link') => {
    const shareText = `Check out this announcement from Premium Store: ${announcement?.title}`;
    const shareUrl = `${window.location?.origin}/announcements/${announcement?.id}`;

    if (platform === 'Link') {
      navigator.clipboard?.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else {
      alert(`Sharing to ${platform}: ${shareText}`);
    }
  };

  const handleCategoryChange = (category) => {
    // setActiveCategory(category);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilter = () => {
    // setActiveCategory('All');
  };

  if (selectedAnnouncement) {
    return (
      <AnnouncementDetail
        announcement={selectedAnnouncement}
        onClose={handleCloseDetail}
        onShare={handleShare} />);


  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="main-content">
        <div className="relative">
          <div className="gradient-mesh" />

          <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                Latest Announcements
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
                Stay informed about exclusive sales, new arrivals, special events, and important store updates. Be the first to know about exciting opportunities at Premium Store.
              </p>
            </div>

            {isLoading ?
              <div className="space-y-8">
                <div className="skeleton skeleton-shimmer w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl" />
                <div className="skeleton skeleton-shimmer w-full h-32 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3]?.map((i) =>
                    <div key={i} className="skeleton skeleton-shimmer w-full h-96 rounded-xl" />
                  )}
                </div>
              </div> :

              <>
                <div className="mb-8 md:mb-12">
                  {featuredAnnouncement ? (
                    <AnnouncementHero
                      announcement={featuredAnnouncement}
                      onViewDetails={handleViewDetails} />
                  ) : (
                    <EmptyState
                      category="Announcements"
                      onReset={() => { }} />
                  )}
                </div>

                <div className="mb-12 md:mb-16">
                  <NewsletterSignup />
                </div>

                <div className="bg-card rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
                        Visit Our Store
                      </h2>
                      <p className="text-base md:text-lg text-muted-foreground mb-4">
                        Experience our full collection in person and receive expert assistance from our knowledgeable staff.
                      </p>
                      <div className="flex flex-col gap-3 text-sm md:text-base text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <Icon name="MapPin" size={20} color="var(--color-primary)" />
                          <span>Beside Bharath Theatre Street, Upstairs Of RI Fashion, Mydukur</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Icon name="Phone" size={20} color="var(--color-primary)" />
                          <span>+91 8074463123</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Icon name="Clock" size={20} color="var(--color-primary)" />
                          <span>Mon-Sat: 10 AM - 8 PM | Sun: 8:30 AM -6 PM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                      <button
                        onClick={() => navigate('/collection')}
                        className="cta-button cta-button-primary w-full md:w-auto">

                        Browse Collection
                      </button>
                      <button
                        onClick={() => window.location.href = 'tel:+918074463123'}
                        className="cta-button cta-button-secondary w-full md:w-auto">

                        Call Us Now
                      </button>
                    </div>
                  </div>
                </div>
              </>
            }
          </div>
        </div>
      </main>
      <footer className="bg-card border-t border-border mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                About Premium Store
              </h3>
              <p className="text-sm text-muted-foreground">
                Your trusted destination for premium footwear. We bridge digital convenience with physical retail excellence.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                Quick Links
              </h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => navigate('/homepage')} className="text-sm text-muted-foreground hover:text-primary text-left transition-colors">
                  Home
                </button>
                <button onClick={() => navigate('/collection')} className="text-sm text-muted-foreground hover:text-primary text-left transition-colors">
                  Collection
                </button>
                <button onClick={() => navigate('/announcements')} className="text-sm text-muted-foreground hover:text-primary text-left transition-colors">
                  Announcements
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                Connect With Us
              </h3>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                  <Icon name="Facebook" size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                  <Icon name="Instagram" size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                  <Icon name="Twitter" size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date()?.getFullYear()} Premium Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>);

};

export default Announcements;