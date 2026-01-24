import React, { useState } from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';

const CustomerReviews = ({ reviews, averageRating, totalReviews }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const ratingDistribution = [
    { stars: 5, count: 124, percentage: 68 },
    { stars: 4, count: 38, percentage: 21 },
    { stars: 3, count: 12, percentage: 7 },
    { stars: 2, count: 5, percentage: 3 },
    { stars: 1, count: 2, percentage: 1 },
  ];

  const filteredReviews =
    selectedFilter === 'all'
      ? reviews
      : reviews?.filter((review) => review?.rating === parseInt(selectedFilter));

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Reviews Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
          Customer Reviews
        </h2>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Overall Rating */}
          <div className="bg-muted rounded-lg p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
                {averageRating?.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)]?.map((_, index) => (
                  <Icon
                    key={index}
                    name="Star"
                    size={24}
                    color={index < Math.floor(averageRating) ? 'var(--color-accent)' : 'var(--color-border)'}
                    className={index < Math.floor(averageRating) ? 'fill-accent' : ''}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {ratingDistribution?.map((item) => (
              <button
                key={item?.stars}
                onClick={() => setSelectedFilter(item?.stars?.toString())}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  selectedFilter === item?.stars?.toString()
                    ? 'bg-accent/10' :'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{item?.stars}</span>
                  <Icon name="Star" size={14} color="var(--color-accent)" className="fill-accent" />
                </div>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${item?.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {item?.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === 'all' ?'bg-accent text-accent-foreground' :'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1]?.map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedFilter(rating?.toString())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === rating?.toString()
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {rating} Stars
            </button>
          ))}
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-4 md:space-y-6">
        {filteredReviews?.map((review) => (
          <div
            key={review?.id}
            className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Image
                  src={review?.customerImage}
                  alt={review?.customerImageAlt}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm md:text-base font-semibold text-foreground">
                      {review?.customerName}
                    </h3>
                    {review?.verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                        <Icon name="CheckCircle2" size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {[...Array(5)]?.map((_, index) => (
                        <Icon
                          key={index}
                          name="Star"
                          size={14}
                          color={index < review?.rating ? 'var(--color-accent)' : 'var(--color-border)'}
                          className={index < review?.rating ? 'fill-accent' : ''}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review?.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-3">
              <p className="text-sm md:text-base text-foreground leading-relaxed">
                {review?.comment}
              </p>

              {/* Review Images */}
              {review?.images && review?.images?.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {review?.images?.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <Image
                        src={img?.url}
                        alt={img?.alt}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Size & Fit Info */}
              {review?.sizeOrdered && (
                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground">
                  <span>Size ordered: {review?.sizeOrdered}</span>
                  <span>•</span>
                  <span>Fit: {review?.fit}</span>
                </div>
              )}
            </div>

            {/* Helpful Section */}
            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <span className="text-xs md:text-sm text-muted-foreground">
                Was this helpful?
              </span>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-xs md:text-sm">
                <Icon name="ThumbsUp" size={14} />
                <span>{review?.helpfulCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Load More Button */}
      {filteredReviews?.length < totalReviews && (
        <div className="flex justify-center pt-4">
          <button className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;