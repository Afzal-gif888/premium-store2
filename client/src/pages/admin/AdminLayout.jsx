import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from 'store/slices/authSlice';
import Button from 'components/ui/Button';
import { getImageUrl } from 'config/api';
import Icon from 'components/AppIcon';

const AdminLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin');
    };

    const navItems = [
        { label: 'Stock', path: '/admin/stock', icon: 'Package' },
        { label: 'Bestsellers', path: '/admin/bestsellers', icon: 'Star' },
        { label: 'Announcements', path: '/admin/announcements', icon: 'Bell' },
        { label: 'Payments', path: '/admin/payments', icon: 'CreditCard' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
                                    <img
                                        src="/assets/images/logo.jpg"
                                        alt="Premium Store"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="font-bold text-xl tracking-tight hidden sm:block">Admin Panel</span>
                            </div>
                            <div className="hidden md:ml-10 md:flex md:space-x-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                            ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}
                                        `}
                                    >
                                        <Icon name={item.icon} size={16} />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="font-medium"
                            >
                                View Store
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 font-medium"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className="md:hidden border-t border-gray-200">
                    <div className="flex justify-around p-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex flex-col items-center p-1 transition-colors
                                    ${isActive ? 'text-black' : 'text-gray-500'}
                                `}
                            >
                                <Icon name={item.icon} size={18} />
                                <span className="text-[10px] font-medium mt-1">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
