import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, toggleBestseller } from 'store/slices/stockSlice';
import Image from 'components/AppImage';

const BestsellersPage = () => {
    const dispatch = useDispatch();
    const stockState = useSelector(state => state.stock) || { products: [], status: 'idle' };
    const products = Array.isArray(stockState.products) ? stockState.products : [];
    const status = stockState.status || 'idle';

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    if (status === 'loading' && products.length === 0) {
        return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Manage Bestsellers</h1>
                <p className="text-lg text-gray-500 mt-2">Select products to appear in the "Bestsellers" section on the homepage.</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Is Bestseller?</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product._id || product.id}>
                                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                    {product.image && (
                                        <Image src={product.image} alt="" className="h-10 w-10 rounded object-cover" />
                                    )}
                                    <span className="font-medium">{product.name}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{Number(product.price || 0).toLocaleString('en-IN')}</td>
                                <td className="px-6 py-6 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => {
                                            const originalStatus = product.isBestseller;
                                            dispatch(toggleBestseller({ id: product._id || product.id, isBestseller: !originalStatus }))
                                                .unwrap()
                                                .then(() => {
                                                    console.log(`Successfully updated bestseller status for ${product.name}`);
                                                })
                                                .catch((err) => {
                                                    alert(`Failed to update ${product.name}: ${err}`);
                                                });
                                        }}
                                        className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${product.isBestseller ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                    >
                                        <span className="sr-only">Use setting</span>
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${product.isBestseller ? 'translate-x-6' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BestsellersPage;
