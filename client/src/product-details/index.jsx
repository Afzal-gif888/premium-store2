import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from 'store/slices/stockSlice';
import Header from 'components/Header';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stockState = useSelector(state => state.stock) || {};
  const products = Array.isArray(stockState.products) ? stockState.products : [];
  const status = stockState.status || 'idle';
  const [selectedSize, setSelectedSize] = useState(null);
  const [storeButtonClicked, setStoreButtonClicked] = useState(false);

  // Fetch products if not already loaded or idle
  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Move find inside useMemo or ensure products is an array
  const product = Array.isArray(products) ? products.find(p => (p._id === id) || (p.id === id)) : null;

  // Handle Loading State
  if (status === 'loading' && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-white text-center p-20">
        <Header />
        <h2 className="text-2xl font-bold text-red-600">Connection Error</h2>
        <p className="mt-4">Please check your internet and refresh.</p>
      </div>
    );
  }

  // If product not found (or deleted)
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center p-20">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you are looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-2 rounded-lg font-bold">
            Return to Home
          </button>
        </div>
      </div>
    );
  }


  // Handle array format from backend: [{ size: "US 7", stock: 10 }]
  const SIZES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

  const sizeList = SIZES.map(sizeNum => {
    const sizeLabel = `SIZE ${sizeNum}`;
    const stockEntry = Array.isArray(product.sizes)
      ? product.sizes.find(s => s.size === sizeLabel || s.size === `US ${sizeNum}`)
      : null;

    const stockCount = stockEntry ? stockEntry.stock : 0;

    return {
      size: sizeLabel,
      stock: stockCount,
      available: stockCount > 0,
      fitNote: stockCount > 0 ? `${stockCount} pairs available` : 'Out of Stock'
    };
  });

  // Single image from backend
  const productImage = product.image || 'https://via.placeholder.com/400';
  const productPrice = Number(product.price || 0);

  const handleRelatedClick = (relatedId) => {
    navigate(`/product/${relatedId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">

        {/* Back Button */}
        <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-black mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" /> Back to Collection
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={productImage}
                alt={product.name || 'Product Image'}
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-2">
              <span className="text-sm text-gray-500 uppercase tracking-widest">{product.category || 'Uncategorized'}</span>
              {product.isBestseller && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-bold">BESTSELLER</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name || 'Unnamed Product'}</h1>
            <p className="text-2xl text-gray-900 font-medium mb-8">₹{productPrice.toLocaleString('en-IN')}</p>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Select Size</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {sizeList.map((item) => (
                  <button
                    key={item.size}
                    disabled={!item.available}
                    onClick={() => {
                      setSelectedSize(item);
                      setStoreButtonClicked(false);
                    }}
                    className={`
                                            py-3 text-sm font-bold rounded-md border
                                            ${selectedSize?.size === item.size
                        ? 'bg-black text-white border-black'
                        : item.available
                          ? 'bg-white text-gray-900 border-gray-200 hover:border-gray-900'
                          : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'}
                                        `}
                  >
                    {item.size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  In Stock: {selectedSize.stock} pairs left
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="flex items-start gap-4">
                <Icon name="Store" size={24} className="text-gray-900 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Visit Premium Store</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    We are an offline retail showcase. Please visit our physical location to purchase this item.
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Beside Bharath Theatre Street,</p>
                    <p>Upstairs Of RI Fashion</p>
                    <p>Mydukur</p>
                    <p>Mon-Sat: 10am - 9pm</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              className={`w-full py-4 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${storeButtonClicked
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-black text-white hover:bg-gray-800'
                }`}
              disabled={!selectedSize}
              onClick={() => setStoreButtonClicked(true)}
            >
              {!selectedSize
                ? 'Select a Size'
                : storeButtonClicked
                  ? '✓ Please Visit the Store'
                  : 'Available at Store'}
            </button>
          </div>
        </div>

        {/* --- Related Products Section --- */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Related Products</h2>
            <div className="h-px flex-grow bg-gray-100 mx-8 hidden md:block"></div>
            <span className="text-sm text-gray-500 font-medium">From {product.category || 'this category'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-[12px] gap-y-[12px] md:gap-8">
            {products
              .filter(p => p.category === product.category && (p._id || p.id) !== id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <div
                  key={relatedProduct._id || relatedProduct.id}
                  className="product-card cursor-pointer"
                  onClick={() => handleRelatedClick(relatedProduct._id || relatedProduct.id)}
                >
                  <div className="relative overflow-hidden aspect-square bg-gray-100">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      width={500}
                      height={500}
                      className="product-card-image hover:scale-110 transition-transform duration-500"
                    />
                    {relatedProduct.isBestseller && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-sm">
                        BESTSELLER
                      </div>
                    )}
                  </div>

                  <div className="product-card-content p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Tag" size={14} color="var(--color-muted-foreground)" />
                      <span className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wide">
                        {relatedProduct.category}
                      </span>
                    </div>

                    <h3 className="product-card-title text-sm md:text-base line-clamp-2 mb-3">
                      {relatedProduct.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="product-card-price text-sm md:text-lg font-bold">
                        ₹{Number(relatedProduct.price || 0).toLocaleString('en-IN')}
                      </span>
                      <button
                        className="flex items-center gap-1 text-xs md:text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRelatedClick(relatedProduct._id || relatedProduct.id);
                        }}>
                        View
                        <Icon name="ArrowRight" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {products.filter(p => p.category === product.category && (p._id || p.id) !== id).length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl">
                <p className="text-gray-500">No other products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;