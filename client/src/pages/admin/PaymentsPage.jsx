import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPayment, fetchPayments } from 'store/slices/paymentSlice';
import { fetchProducts } from 'store/slices/stockSlice';
import Button from 'components/ui/Button';

const PaymentsPage = () => {
    const dispatch = useDispatch();
    const paymentState = useSelector(state => state.payments) || { history: [], status: 'idle' };
    const history = paymentState.history || [];
    const status = paymentState.status || 'idle';

    const stockState = useSelector(state => state.stock) || { products: [], status: 'idle' };
    const products = stockState.products || [];
    const stockStatus = stockState.status || 'idle';

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPayments());
        }
        if (stockStatus === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, stockStatus, dispatch]);

    const [productName, setProductName] = useState('');
    const [size, setSize] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(addPayment({
            productName,
            category,
            size,
            amount: parseFloat(amount)
        }));

        setProductName('');
        setSize('');
        setAmount('');
        setCategory('');
    };

    // Auto-fill category when product is selected
    const handleProductChange = (name) => {
        setProductName(name);
        const safeProducts = Array.isArray(products) ? products : [];
        const product = safeProducts.find(p => p && p.name === name);
        if (product && product.category) {
            setCategory(product.category);
        }
    };

    // Calculations for summary - with defensive checks
    const safeHistory = Array.isArray(history) ? history : [];

    const totalAmount = safeHistory.reduce((sum, item) => {
        const val = parseFloat(item.amount);
        return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const sizeStats = safeHistory.reduce((acc, item) => {
        if (item.size) {
            acc[item.size] = (acc[item.size] || 0) + 1;
        }
        return acc;
    }, {});

    const sizeEntries = Object.entries(sizeStats);
    const topSize = sizeEntries.length > 0
        ? sizeEntries.sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A';

    const categoryStats = safeHistory.reduce((acc, item) => {
        if (item.category) {
            acc[item.category] = (acc[item.category] || 0) + 1;
        }
        return acc;
    }, {});

    const categoryEntries = Object.entries(categoryStats);
    const topCategory = categoryEntries.length > 0
        ? categoryEntries.sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A';

    if (status === 'loading' && history.length === 0) {
        return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div></div>;
    }

    if (status === 'failed') {
        return (
            <div className="bg-red-50 p-10 rounded-lg text-center border border-red-100 mb-6">
                <h3 className="text-xl font-bold text-red-800">History Connection Error</h3>
                <p className="text-red-600 mt-2">{paymentState.error || 'Failed to sync payment records.'}</p>
                <Button onClick={() => window.location.reload()} className="mt-6" variant="danger">Retry Sync</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Payments Ledger</h1>

            <div className="bg-white p-6 rounded-lg shadow border">
                <h2 className="text-lg font-semibold mb-4">Log New Payment</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                        <input
                            className="w-full border-2 border-gray-100 p-3 rounded-lg text-base focus:border-black outline-none transition-all"
                            value={productName}
                            onChange={e => handleProductChange(e.target.value)}
                            required
                            list="product-list"
                        />
                        <datalist id="product-list">
                            {Array.isArray(products) && products.filter(p => p && p.name).map(p => (
                                <option key={p._id || p.id || p.name} value={p.name} />
                            ))}
                        </datalist>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                        <input
                            className="w-full border-2 border-gray-100 p-3 rounded-lg text-base focus:border-black outline-none transition-all"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            required
                            placeholder="e.g. Classic, Literide"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Size</label>
                        <select
                            className="w-full border-2 border-gray-100 p-3 rounded-lg text-base focus:border-black outline-none transition-all"
                            value={size}
                            onChange={e => setSize(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            {['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Amount (₹)</label>
                        <input
                            type="number"
                            className="w-full border-2 border-gray-100 p-3 rounded-lg text-base focus:border-black outline-none transition-all"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <Button type="submit" className="w-full py-3 font-bold">Log Payment</Button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Amount Collected</p>
                    <p className="text-4xl font-extrabold text-green-600 mt-2">₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Bestselling Size</p>
                    <p className="text-4xl font-extrabold text-blue-600 mt-2">{topSize}</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Bestselling Category</p>
                    <p className="text-4xl font-extrabold text-purple-600 mt-2">{topCategory}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <h2 className="text-lg font-semibold p-4 border-b">Payment History</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {safeHistory.map(item => (
                                <tr key={item._id || item.id}>
                                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.date || item.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap text-lg font-bold text-gray-900">{item.productName}</td>
                                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-700">{item.category}</td>
                                    <td className="px-6 py-6 whitespace-nowrap text-base font-medium text-gray-800">{item.size}</td>
                                    <td className="px-6 py-6 whitespace-nowrap text-xl text-right font-extrabold text-green-600">₹{item.amount?.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                            {safeHistory.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No payments recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;
