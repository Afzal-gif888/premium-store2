import React, { useState, useEffect, useMemo } from 'react';
import Header from 'components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from 'store/slices/stockSlice';

import Button from 'components/ui/Button';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import SortDropdown from './components/SortDropdown';
import ProductGrid from './components/ProductGrid';

const Collection = () => {
  const dispatch = useDispatch();
  const { products: rawProducts, status } = useSelector(state => state.stock);
  const products = useMemo(() => Array.isArray(rawProducts) ? rawProducts : [], [rawProducts]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    sizes: [],
    priceRange: 'all',
    availability: []
  });

  const productsPerPage = 12;

  // Fetch real data on mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      sizes: [],
      priceRange: 'all',
      availability: []
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm?.trim()) {
      filtered = filtered?.filter((product) =>
        product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        product?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Category filter removed


    if (filters?.sizes?.length > 0) {
      filtered = filtered?.filter((product) =>
        product?.sizes?.some((size) => filters?.sizes?.includes(size?.size))
      );
    }

    if (filters?.priceRange !== 'all') {
      filtered = filtered?.filter((product) => {
        const price = product?.price;
        if (filters?.priceRange === '0-100') return price < 100;
        if (filters?.priceRange === '100-200') return price >= 100 && price < 200;
        if (filters?.priceRange === '200-300') return price >= 200 && price < 300;
        if (filters?.priceRange === '300-500') return price >= 300 && price < 500;
        if (filters?.priceRange === '500+') return price >= 500;
        return true;
      });
    }

    if (filters?.availability?.length > 0) {
      filtered = filtered?.filter((product) => {
        const totalStock = product?.sizes?.reduce((sum, size) => sum + size?.stock, 0);

        if (filters?.availability?.includes('out-of-stock') && totalStock === 0) return true;
        if (filters?.availability?.includes('low-stock') && totalStock > 0 && totalStock <= 5) return true;
        if (filters?.availability?.includes('in-stock') && totalStock > 5) return true;

        return false;
      });
    }

    return filtered;
  };

  const sortProducts = (items) => {
    const sorted = [...items];

    switch (sortBy) {
      case 'newest':
        // Using _id or createdAt for sorting if available
        return sorted.sort((a, b) => (b._id || b.id) > (a._id || a.id) ? 1 : -1);
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'availability':
        return sorted.sort((a, b) => {
          const stockA = a.sizes?.reduce((sum, size) => sum + size.stock, 0) || 0;
          const stockB = b.sizes?.reduce((sum, size) => sum + size.stock, 0) || 0;
          return stockB - stockA;
        });
      default:
        return sorted;
    }
  };

  const filteredProducts = filterProducts();
  const sortedProducts = sortProducts(filteredProducts);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = sortedProducts.slice(0, startIndex + productsPerPage);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const activeFilterCount =
    (filters?.category !== 'all' ? 1 : 0) +
    (filters?.sizes?.length || 0) +
    (filters?.priceRange !== 'all' ? 1 : 0) +
    (filters?.availability?.length || 0);

  const searchSuggestions = useMemo(() => {
    return products.slice(0, 10).map(p => p.name);
  }, [products]);

  const isLoading = status === 'loading' && products.length === 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="main-content">
        <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-8 md:py-12 lg:py-16">
          <div className="gradient-mesh opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center space-y-3 md:space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-display">
                Our Collection
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover premium footwear synced in real-time with our physical store inventory.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobileFilterOpen={isMobileFilterOpen}
              onCloseMobileFilter={() => setIsMobileFilterOpen(false)} />

            <div className="flex-1 min-w-0">
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <div className="flex-1">
                    <SearchBar
                      onSearch={handleSearch}
                      suggestions={searchSuggestions} />
                  </div>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => setIsMobileFilterOpen(true)}
                    iconName="SlidersHorizontal"
                    iconPosition="left"
                    className="lg:hidden text-sm font-bold">
                    FILTERS
                    {activeFilterCount > 0 &&
                      <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full">
                        {activeFilterCount}
                      </span>
                    }
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 border-b border-border/50 pb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} available
                    </p>
                    {activeFilterCount > 0 &&
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        iconName="X"
                        className="text-xs h-7">
                        Clear all
                      </Button>
                    }
                  </div>
                  <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
                </div>

                <ProductGrid products={displayedProducts} isLoading={isLoading} />

                {!isLoading && sortedProducts.length > displayedProducts.length &&
                  <div className="flex justify-center pt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleLoadMore}
                      iconName="ChevronDown"
                      iconPosition="right"
                      className="px-12 font-bold tracking-widest text-xs">
                      LOAD MORE PRODUCTS
                    </Button>
                  </div>
                }

                {!isLoading && displayedProducts.length > 0 &&
                  <div className="text-center pt-6">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                      Showing {displayedProducts.length} of {sortedProducts.length} items
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Collection;