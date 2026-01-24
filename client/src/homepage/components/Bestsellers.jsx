import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from 'store/slices/stockSlice';
import { useNavigate } from 'react-router-dom';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const Bestsellers = () => {
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

    // Filter by bestseller flag
    const bestsellers = products.filter(p => p.isBestseller);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (status === 'loading' && products.length === 0) {
        return (
            <section id="bestsellers" className="py-20 bg-gray-50 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500">Loading bestsellers...</p>
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
        <section id="bestsellers" className="py-12 md:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-12 lg:mb-16 scroll-reveal">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
                        Bestsellers
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Customer favorites, verified by sales data.
                    </p>
                </div>

                {bestsellers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-[12px] gap-y-[12px] md:gap-8 overflow-hidden">
                        {bestsellers.map((product, index) => (
                            <div
                                key={product._id || product.id}
                                className="product-card scroll-reveal cursor-pointer"
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => handleProductClick(product._id || product.id)}
                            >
                                <div className="relative overflow-hidden aspect-square bg-white">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={800}
                                            height={800}
                                            className="product-card-image hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Icon name="Image" size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                                        BESTSELLER
                                    </div>
                                </div>
                                <div className="product-card-content p-3 md:p-4">
                                    <h3 className="product-card-title text-sm md:text-base line-clamp-2 mb-2">{product.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="product-card-price text-sm md:text-lg font-bold">₹{Number(product.price || 0).toLocaleString('en-IN')}</span>
                                        <span className="text-[10px] md:text-xs text-primary font-medium flex items-center gap-1">View <Icon name="ArrowRight" size={12} /></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No bestsellers available at the moment. Check back soon!</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Bestsellers;
