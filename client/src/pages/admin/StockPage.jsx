import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from 'store/slices/stockSlice';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
// Cloudinary direct (unsigned) uploads from the client require an upload preset
// Set the following env vars in your Netlify / local environment:
// VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET

const SIZES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

const getInitialFormState = () => ({
    name: '',
    category: '',
    price: '',
    // Support multiple images. Keep `image` for compatibility (first image)
    images: [],
    image: '',
    sizes: SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
});

const StockPage = () => {
    const dispatch = useDispatch();
    const stockState = useSelector(state => state.stock) || { products: [], status: 'idle' };
    const products = Array.isArray(stockState.products) ? stockState.products : [];
    const status = stockState.status || 'idle';

    const [editId, setEditId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // NEW: Track processing
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);

    const [formVersion, setFormVersion] = useState(0);

    const [formData, setFormData] = useState(getInitialFormState());

    // Ensure products are loaded
    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    if (status === 'loading' && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
                <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500 font-medium">Loading stock inventory...</p>
            </div>
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

    const handleImageUpload = async (e) => {
        const file = e.target && e.target.files ? e.target.files[0] : null;
        if (!file) return;

        console.log("Starting upload for file:", file.name); // Debug log
        setIsUploading(true);
        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error('Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
            }

            const fd = new FormData();
            fd.append('file', file);
            fd.append('upload_preset', uploadPreset);

            const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

            const res = await fetch(url, { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Upload failed with status ' + res.status);
            const json = await res.json();
            const secure = json.secure_url || json.url;
            if (!secure) throw new Error('Upload response did not include a URL');

            console.log('Upload successful:', secure);
            setFormData(prev => ({ ...prev, images: [secure], image: secure }));
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('Image upload failed: ' + (err.message || 'Server error'));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => {
            const next = { ...prev };
            if (Array.isArray(next.images)) {
                next.images = next.images.filter((_, i) => i !== index);
                next.image = next.images && next.images.length ? next.images[0] : '';
            } else {
                next.images = [];
                next.image = '';
            }
            return next;
        });
    };

    const closeForm = () => {
        setFormData(getInitialFormState());
        setIsEditing(false);
        setEditId(null);
        setFormVersion(v => v + 1); // Force remount next time
    };

    const handleSubmit = async (e, keepOpen = false) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;

        // Validation
        const totalStock = Object.values(formData.sizes).reduce((a, b) => a + parseInt(b || 0), 0);
        if (totalStock === 0) {
            alert("At least one size must have quantity greater than zero.");
            return;
        }
        if ((!formData.images || formData.images.length === 0) && !formData.image) {
            alert("At least one image is required.");
            return;
        }

        const sizesArray = Object.entries(formData.sizes)
            .filter(([size, stock]) => parseInt(stock || 0) > 0)
            .map(([size, stock]) => ({
                size: `SIZE ${size}`,
                stock: parseInt(stock)
            }));

        const productData = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            // send both `image` (first) and `images` (array) for compatibility
            image: formData.image || (formData.images && formData.images[0]) || '',
            images: formData.images || [],
            sizes: sizesArray
        };

        setIsSubmitting(true);
        try {
            if (editId) {
                await dispatch(updateProduct({ id: editId, data: productData })).unwrap();
            } else {
                await dispatch(addProduct(productData)).unwrap();
            }

            // Success!
            // We DO NOT fetchProducts() here anymore to avoid overwriting the local optimistic update with stale server data.
            // The Redux slice automatically adds/updates the product in the local list.

            alert(editId ? 'Product Updated!' : 'Product Added!');

            if (keepOpen) {
                // If adding another, just reset valid fields to "new" state effectively
                openNewForm();
            } else {
                closeForm();
            }

        } catch (error) {
            console.error('Submit Error:', error);
            alert('Failed to save product: ' + (error.message || 'Server error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        const sizesObject = SIZES.reduce((acc, size) => {
            let stockCount = 0;
            if (Array.isArray(product.sizes)) {
                stockCount = product.sizes.find(s => s.size === `SIZE ${size}` || s.size === `US ${size}`)?.stock || 0;
            } else if (product.sizes && typeof product.sizes === 'object') {
                stockCount = product.sizes[size] || 0;
            }
            return { ...acc, [size]: stockCount };
        }, {});

        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            images: Array.isArray(product.images) ? product.images.map(i => (typeof i === 'string' ? i : i.url || '')) : (product.image ? [product.image] : []),
            image: product.image || (Array.isArray(product.images) && product.images[0]) || '',
            sizes: sizesObject
        });
        setEditId(product._id);
        setFormVersion(v => v + 1); // Force new form instance
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            dispatch(deleteProduct(id))
                .unwrap()
                .then(() => dispatch(fetchProducts()))
                .catch((err) => alert("Delete failed: " + err));
        }
    };

    // Explicitly open a new form
    const openNewForm = () => {
        setFormData(getInitialFormState());
        setEditId(null);
        setFormVersion(v => v + 1); // Force new form instance
        setIsEditing(true);
    };

    const handleAddToggle = () => {
        if (isEditing) {
            closeForm();
        } else {
            openNewForm();
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stockSummary = {
        total: products.length,
        outOfStock: products.filter(p => (Array.isArray(p.sizes) ? p.sizes.reduce((sum, s) => sum + s.stock, 0) : 0) === 0).length,
        lowStock: products.filter(p => {
            const sum = Array.isArray(p.sizes) ? p.sizes.reduce((sum, s) => sum + s.stock, 0) : 0;
            return sum > 0 && sum <= 5;
        }).length
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
                    <div className="flex gap-6 mt-3 text-base">
                        <span className="text-gray-500">Total Products: <b className="text-black">{stockSummary.total}</b></span>
                        <span className="text-green-600">Available: <b className="font-bold">{stockSummary.total - stockSummary.outOfStock}</b></span>
                        <span className="text-red-600">Out of Stock: <b className="font-bold">{stockSummary.outOfStock}</b></span>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl text-base focus:border-black outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-3.5 text-gray-400">
                            <Icon name="Search" size={20} />
                        </div>
                    </div>
                    <Button
                        onClick={handleAddToggle}
                        className="px-6 py-3 text-base font-bold shadow-lg"
                    >
                        {isEditing && !editId ? 'Cancel' : '+ Add New Product'}
                    </Button>
                </div>
            </div>

            {isEditing && (
                <div key={formVersion} className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Product' : 'New Product'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                className="border p-2 rounded"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Category"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                required
                            />

                            <input
                                type="number"
                                className="border p-2 rounded"
                                placeholder="Price"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        {/* REMOVED: Bestseller checkbox - controlled only from Bestseller page */}

                        <div>
                            <label className="block text-sm font-medium mb-2">Product Image</label>
                            <div className="flex items-center gap-4 mb-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                                />
                                {isUploading && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                        Uploading images...
                                    </div>
                                )}
                            </div>

                            {!isUploading && Array.isArray(formData.images) && formData.images.length > 0 && (
                                <div className="flex gap-3 flex-wrap">
                                    {formData.images.map((src, idx) => (
                                        <div key={idx} className="relative w-28 h-28 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden group hover:border-black transition-colors">
                                            <Image src={src} alt={`preview-${idx}`} className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                title="Remove Image"
                                            >
                                                <Icon name="X" size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Size Quantities</label>
                            <div className="grid grid-cols-5 gap-2">
                                {SIZES.map(size => (
                                    <div key={size} className="flex flex-col">
                                        <span className="text-xs text-center mb-1">SIZE {size}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            className="border p-1 rounded text-center"
                                            value={formData.sizes[size]}
                                            onChange={e => setFormData({
                                                ...formData,
                                                sizes: { ...formData.sizes, [size]: parseInt(e.target.value || 0) }
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-4">
                            <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>Cancel</Button>

                            {!editId && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    loading={isSubmitting}
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="bg-gray-800 text-white hover:bg-gray-700"
                                >
                                    Save & Add Another
                                </Button>
                            )}

                            <Button type="submit" loading={isSubmitting}>
                                {isSubmitting ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update Product' : 'Add Product')}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Product Info</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Total Stock</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map(product => {
                            // Calculate total stock from sizes array
                            const totalStock = Array.isArray(product.sizes)
                                ? product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
                                : 0;
                            return (
                                <tr key={product._id || product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                        {product.image && (
                                            <Image src={product.image} alt="" className="h-10 w-10 rounded object-cover" />
                                        )}
                                        <span className="font-medium">{product.name}</span>
                                        {product.isBestseller && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">Bestseller</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-700 font-medium">₹{Number(product.price || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-6 whitespace-nowrap text-base font-bold text-gray-900">{totalStock}</td>
                                    <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-bold shadow-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id || product.id)}
                                                className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold shadow-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    {searchTerm ? 'No products matching your search.' : 'No products in stock. Add one to get started.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockPage;
