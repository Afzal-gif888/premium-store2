import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/Header';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { Checkbox } from 'components/ui/Checkbox';
import ProductRow from './components/ProductRow';
import BulkUpdateModal from './components/BulkUpdateModal';
import StatsCard from './components/StatsCard';
import FilterBar from './components/FilterBar';
import LowStockAlert from './components/LowStockAlert';

const InventoryManagement = () => {
  const navigate = useNavigate();

  // Mock inventory data
  const [products, setProducts] = useState([
  {
    id: 1,
    name: "Air Max Premium Running Shoes",
    sku: "AM-2026-001",
    category: "sneakers",
    price: 149.99,
    totalStock: 45,
    image: "https://images.unsplash.com/photo-1667998335504-20aaf7fca4e5",
    imageAlt: "White and blue Air Max running shoes with mesh upper and visible air cushioning on white background",
    variants: [
    { id: 101, size: "8", color: "white", stock: 12 },
    { id: 102, size: "9", color: "white", stock: 15 },
    { id: 103, size: "10", color: "white", stock: 10 },
    { id: 104, size: "11", color: "white", stock: 8 }],

    lastUpdated: "2026-01-18T10:30:00"
  },
  {
    id: 2,
    name: "Classic Leather Chelsea Boots",
    sku: "CB-2026-002",
    category: "boots",
    price: 199.99,
    totalStock: 3,
    image: "https://images.unsplash.com/photo-1673437531214-1e48e0ebf59d",
    imageAlt: "Brown leather Chelsea boots with elastic side panels and pull tab on wooden surface",
    variants: [
    { id: 201, size: "9", color: "brown", stock: 1 },
    { id: 202, size: "10", color: "brown", stock: 2 },
    { id: 203, size: "11", color: "brown", stock: 0 }],

    lastUpdated: "2026-01-18T09:15:00"
  },
  {
    id: 3,
    name: "Summer Beach Sandals",
    sku: "SB-2026-003",
    category: "sandals",
    price: 49.99,
    totalStock: 67,
    image: "https://images.unsplash.com/photo-1629420274125-1e625d218d1e",
    imageAlt: "Casual brown leather sandals with adjustable straps on sandy beach background",
    variants: [
    { id: 301, size: "7", color: "tan", stock: 20 },
    { id: 302, size: "8", color: "tan", stock: 22 },
    { id: 303, size: "9", color: "tan", stock: 25 }],

    lastUpdated: "2026-01-17T16:45:00"
  },
  {
    id: 4,
    name: "Executive Oxford Dress Shoes",
    sku: "EO-2026-004",
    category: "formal",
    price: 179.99,
    totalStock: 28,
    image: "https://images.unsplash.com/photo-1677203046130-60b0f3854308",
    imageAlt: "Black polished leather Oxford dress shoes with lace-up closure on marble floor",
    variants: [
    { id: 401, size: "9", color: "black", stock: 8 },
    { id: 402, size: "10", color: "black", stock: 12 },
    { id: 403, size: "11", color: "black", stock: 8 }],

    lastUpdated: "2026-01-18T11:20:00"
  },
  {
    id: 5,
    name: "Urban Street Sneakers",
    sku: "US-2026-005",
    category: "casual",
    price: 89.99,
    totalStock: 0,
    image: "https://images.unsplash.com/photo-1535819898029-b301c1c8d7d8",
    imageAlt: "Gray canvas casual sneakers with white rubber sole and laces on concrete surface",
    variants: [
    { id: 501, size: "8", color: "gray", stock: 0 },
    { id: 502, size: "9", color: "gray", stock: 0 },
    { id: 503, size: "10", color: "gray", stock: 0 }],

    lastUpdated: "2026-01-16T14:30:00"
  },
  {
    id: 6,
    name: "Trail Hiking Boots",
    sku: "TH-2026-006",
    category: "boots",
    price: 159.99,
    totalStock: 34,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1efc5e5db-1767612757169.png",
    imageAlt: "Rugged brown hiking boots with ankle support and deep tread pattern on mountain trail",
    variants: [
    { id: 601, size: "9", color: "brown", stock: 10 },
    { id: 602, size: "10", color: "brown", stock: 14 },
    { id: 603, size: "11", color: "brown", stock: 10 }],

    lastUpdated: "2026-01-18T08:00:00"
  },
  {
    id: 7,
    name: "Performance Running Trainers",
    sku: "PR-2026-007",
    category: "sneakers",
    price: 129.99,
    totalStock: 4,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_19d012242-1764677610915.png",
    imageAlt: "Red and black performance running shoes with breathable mesh and cushioned sole on track",
    variants: [
    { id: 701, size: "8", color: "red", stock: 1 },
    { id: 702, size: "9", color: "red", stock: 2 },
    { id: 703, size: "10", color: "red", stock: 1 }],

    lastUpdated: "2026-01-18T12:45:00"
  },
  {
    id: 8,
    name: "Comfort Slip-On Loafers",
    sku: "CL-2026-008",
    category: "casual",
    price: 79.99,
    totalStock: 52,
    image: "https://images.unsplash.com/photo-1489459166189-0655743b838f",
    imageAlt: "Navy blue suede slip-on loafers with cushioned insole on wooden deck",
    variants: [
    { id: 801, size: "8", color: "navy", stock: 18 },
    { id: 802, size: "9", color: "navy", stock: 20 },
    { id: 803, size: "10", color: "navy", stock: 14 }],

    lastUpdated: "2026-01-17T15:30:00"
  }]
  );

  // State management
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProducts = products?.length;
    const totalValue = products?.reduce((sum, p) => sum + p?.price * p?.totalStock, 0);
    const lowStockCount = products?.filter((p) => p?.totalStock > 0 && p?.totalStock <= 5)?.length;
    const outOfStockCount = products?.filter((p) => p?.totalStock === 0)?.length;
    const totalUnits = products?.reduce((sum, p) => sum + p?.totalStock, 0);

    return {
      totalProducts,
      totalValue,
      lowStockCount,
      outOfStockCount,
      totalUnits
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered?.filter((p) =>
      p?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      p?.sku?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered?.filter((p) => p?.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter === 'in-stock') {
      filtered = filtered?.filter((p) => p?.totalStock > 5);
    } else if (stockFilter === 'low-stock') {
      filtered = filtered?.filter((p) => p?.totalStock > 0 && p?.totalStock <= 5);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered?.filter((p) => p?.totalStock === 0);
    }

    // Sort
    filtered?.sort((a, b) => {
      if (sortBy === 'name') return a?.name?.localeCompare(b?.name);
      if (sortBy === 'price') return b?.price - a?.price;
      if (sortBy === 'stock') return a?.totalStock - b?.totalStock;
      return 0;
    });

    return filtered;
  }, [products, searchQuery, categoryFilter, stockFilter, sortBy]);

  // Low stock products
  const lowStockProducts = useMemo(() =>
  products?.filter((p) => p?.totalStock > 0 && p?.totalStock <= 5),
  [products]
  );

  // Handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredProducts?.map((p) => p?.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts?.filter((id) => id !== productId));
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products?.map((p) =>
    p?.id === updatedProduct?.id ? updatedProduct : p
    ));
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products?.filter((p) => p?.id !== productId));
      setSelectedProducts(selectedProducts?.filter((id) => id !== productId));
    }
  };

  const handleBulkUpdate = (updateType, updateValue) => {
    const updatedProducts = products?.map((product) => {
      if (!selectedProducts?.includes(product?.id)) return product;

      switch (updateType) {
        case 'price':
          return { ...product, price: parseFloat(updateValue) };
        case 'stock':
          return {
            ...product,
            totalStock: product?.totalStock + parseInt(updateValue),
            variants: product?.variants?.map((v) => ({
              ...v,
              stock: v?.stock + Math.floor(parseInt(updateValue) / product?.variants?.length)
            }))
          };
        case 'category':
          return { ...product, category: updateValue };
        case 'discount':
          const discountPercent = parseFloat(updateValue) / 100;
          return { ...product, price: product?.price * (1 - discountPercent) };
        default:
          return product;
      }
    });

    setProducts(updatedProducts);
    setSelectedProducts([]);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStockFilter('all');
  };

  const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price', label: 'Price (High-Low)' },
  { value: 'stock', label: 'Stock (Low-High)' }];


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Inventory Management
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Real-time stock control with bulk update capabilities
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left">

                  Dashboard
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left">

                  Add Product
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <StatsCard
              title="Total Products"
              value={stats?.totalProducts}
              subtitle={`${stats?.totalUnits} total units`}
              icon="Package"
              color="primary"
              trend="up"
              trendValue="+12%" />

            <StatsCard
              title="Inventory Value"
              value={`$${stats?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle="Total stock value"
              icon="DollarSign"
              color="success"
              trend="up"
              trendValue="+8%" />

            <StatsCard
              title="Low Stock Items"
              value={stats?.lowStockCount}
              subtitle="Need restocking"
              icon="AlertTriangle"
              color="warning"
              trend="down"
              trendValue="-3%" />

            <StatsCard
              title="Out of Stock"
              value={stats?.outOfStockCount}
              subtitle="Unavailable items"
              icon="XCircle"
              color="error"
              trend="neutral"
              trendValue="0%" />

          </div>

          {/* Low Stock Alert */}
          {lowStockProducts?.length > 0 &&
          <div className="mb-6 md:mb-8">
              <LowStockAlert
              products={lowStockProducts}
              onViewProduct={(id) => setEditingProductId(id)} />

            </div>
          }

          {/* Filter Bar */}
          <div className="mb-6">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              stockFilter={stockFilter}
              onStockChange={setStockFilter}
              onClearFilters={handleClearFilters} />

          </div>

          {/* Bulk Actions Bar */}
          {selectedProducts?.length > 0 &&
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
                <span className="text-sm md:text-base font-medium text-foreground">
                  {selectedProducts?.length} {selectedProducts?.length === 1 ? 'product' : 'products'} selected
                </span>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProducts([])}
                iconName="X"
                iconPosition="left"
                className="flex-1 md:flex-none">

                  Clear
                </Button>
                <Button
                variant="default"
                size="sm"
                onClick={() => setShowBulkModal(true)}
                iconName="Edit3"
                iconPosition="left"
                className="flex-1 md:flex-none">

                  Bulk Update
                </Button>
              </div>
            </div>
          }

          {/* Products List Header */}
          <div className="bg-card rounded-lg border border-border p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedProducts?.length === filteredProducts?.length && filteredProducts?.length > 0}
                onChange={(e) => handleSelectAll(e?.target?.checked)}
                label={`Select All (${filteredProducts?.length})`} />

            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden md:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e?.target?.value)}
                className="text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">

                {sortOptions?.map((option) =>
                <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                )}
              </select>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {filteredProducts?.length === 0 ?
            <div className="bg-card rounded-lg border border-border p-12 text-center">
                <Icon name="Package" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div> :

            filteredProducts?.map((product) =>
            <div key={product?.id} className="flex items-start gap-4">
                  <div className="pt-6">
                    <Checkbox
                  checked={selectedProducts?.includes(product?.id)}
                  onChange={(e) => handleSelectProduct(product?.id, e?.target?.checked)} />

                  </div>
                  <div className="flex-1">
                    <ProductRow
                  product={product}
                  onUpdate={handleUpdateProduct}
                  onDelete={handleDeleteProduct}
                  isEditing={editingProductId === product?.id}
                  onToggleEdit={setEditingProductId} />

                  </div>
                </div>
            )
            }
          </div>
        </div>
      </main>
      {/* Bulk Update Modal */}
      <BulkUpdateModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        selectedProducts={selectedProducts}
        onBulkUpdate={handleBulkUpdate} />

    </div>);

};

export default InventoryManagement;