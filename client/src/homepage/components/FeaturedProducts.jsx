import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from 'store/slices/stockSlice';
import { useNavigate } from 'react-router-dom';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stockState = useSelector(state => state.stock) || { products: [], status: 'idle' };
  const products = Array.isArray(stockState.products) ? stockState.products : [];
  const status = stockState.status || 'idle';

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (status === 'loading' && products.length === 0) {
    return (
      <section id="collections" className="py-20 bg-background text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500">Loading collection...</p>
      </section>
    );
  }

  if (status === 'failed') {
    const errorMessage = stockState.error || 'Could not reach the database. Please check if the server is running.';
    return (
      <div className="bg-red-50 p-10 rounded-lg text-center border border-red-100">
        <h3 className="text-xl font-bold text-red-800">Connection Error</h3>
        <p className="text-red-600 mt-2">{errorMessage}</p>
        <Button onClick={() => window.location.reload()} className="mt-6" variant="danger">Retry Refresh</Button>
      </div>
    );
  }

  return (
    <section id="collections" className="py-4 md:py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="text-center mb-6 md:mb-10 scroll-reveal">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Collections
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our complete inventory, updated in real-time.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-[12px] gap-y-[12px] md:gap-8">
            {products.map((product, index) => (
              <div
                key={product._id || product.id}
                className="product-card scroll-reveal cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleProductClick(product._id || product.id)}>

                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  {product.isBestseller && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-accent text-accent-foreground text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                        <Icon name="Star" size={12} fill="currentColor" />
                        BESTSELLER
                      </div>
                    </div>
                  )}
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={800}
                      height={800}
                      className="product-card-image hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Icon name="Image" size={48} />
                    </div>
                  )}
                </div>

                <div className="product-card-content p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Tag" size={14} color="var(--color-muted-foreground)" />
                    <span className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wide">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="product-card-title text-sm md:text-base line-clamp-2 mb-3">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="product-card-price text-sm md:text-lg font-bold">
                      ₹{Number(product.price || 0).toLocaleString('en-IN')}
                    </span>
                    <button
                      className="flex items-center gap-1 text-xs md:text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleProductClick(product._id || product.id);
                      }}>
                      View
                      <Icon name="ArrowRight" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;