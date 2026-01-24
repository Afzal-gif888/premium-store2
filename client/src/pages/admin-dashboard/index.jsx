import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/Header';
import Icon from 'components/AppIcon';
import MetricCard from './components/MetricCard';
import QuickActionButton from './components/QuickActionButton';
import ActivityItem from './components/ActivityItem';
import InventoryAlertCard from './components/InventoryAlertCard';
import SalesChart from './components/SalesChart';
import NotificationBanner from './components/NotificationBanner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const mockMetrics = [
  {
    title: "Today\'s Sales",
    value: "$2,847",
    change: "+12.5% from yesterday",
    changeType: "positive",
    icon: "DollarSign",
    iconColor: "var(--color-success)"
  },
  {
    title: "Total Products",
    value: "342",
    change: "+8 new this week",
    changeType: "positive",
    icon: "Package",
    iconColor: "var(--color-accent)"
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "Requires attention",
    changeType: "negative",
    icon: "AlertTriangle",
    iconColor: "var(--color-warning)"
  },
  {
    title: "Customer Visits",
    value: "156",
    change: "+18% this month",
    changeType: "positive",
    icon: "Users",
    iconColor: "var(--color-primary)"
  }];


  const mockQuickActions = [
  {
    title: "Manage Inventory",
    description: "Update stock levels and product information",
    icon: "Package",
    iconColor: "var(--color-accent)",
    route: "/inventory-management"
  },
  {
    title: "Create Announcement",
    description: "Publish new promotions and store updates",
    icon: "Megaphone",
    iconColor: "var(--color-primary)",
    route: "/announcements"
  },
  {
    title: "Log Sale",
    description: "Record walk-in payments and transactions",
    icon: "ShoppingCart",
    iconColor: "var(--color-success)",
    onClick: () => alert("Sale logging feature - Coming soon!")
  },
  {
    title: "View Analytics",
    description: "Analyze trends and customer engagement",
    icon: "BarChart3",
    iconColor: "var(--color-secondary)",
    onClick: () => alert("Analytics feature - Coming soon!")
  }];


  const mockRecentActivity = [
  {
    type: "sale",
    title: "New Sale Recorded",
    description: "Nike Air Max 270 - Size 10 sold for $150",
    timestamp: "5 minutes ago",
    status: "completed"
  },
  {
    type: "inventory",
    title: "Stock Updated",
    description: "Adidas Ultraboost 22 - Added 15 units to inventory",
    timestamp: "23 minutes ago",
    status: "completed"
  },
  {
    type: "alert",
    title: "Low Stock Alert",
    description: "Puma RS-X - Only 3 units remaining in size 9",
    timestamp: "1 hour ago",
    status: "urgent"
  },
  {
    type: "announcement",
    title: "Announcement Published",
    description: "Winter Sale 2026 - Up to 40% off selected items",
    timestamp: "2 hours ago",
    status: "completed"
  },
  {
    type: "sale",
    title: "Payment Logged",
    description: "Converse Chuck Taylor - Cash payment $65",
    timestamp: "3 hours ago",
    status: "completed"
  }];


  const mockInventoryAlerts = [
  {
    product: {
      name: "Nike Air Force 1 White",
      image: "https://images.unsplash.com/photo-1656164847621-4665c4c397da",
      imageAlt: "White Nike Air Force 1 sneakers with classic design on clean white background"
    },
    currentStock: 2,
    threshold: 10,
    severity: "critical"
  },
  {
    product: {
      name: "Adidas Stan Smith Green",
      image: "https://images.unsplash.com/photo-1650874265992-5efdf0f2ab6a",
      imageAlt: "White Adidas Stan Smith sneakers with green heel tab on neutral surface"
    },
    currentStock: 5,
    threshold: 15,
    severity: "warning"
  },
  {
    product: {
      name: "Puma Suede Classic Black",
      image: "https://images.unsplash.com/photo-1680657455883-857a04fb4421",
      imageAlt: "Black Puma Suede Classic sneakers with signature formstrip on wooden floor"
    },
    currentStock: 8,
    threshold: 20,
    severity: "warning"
  }];


  const mockSalesData = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 1900 },
  { name: 'Wed', sales: 1500 },
  { name: 'Thu', sales: 2200 },
  { name: 'Fri', sales: 2800 },
  { name: 'Sat', sales: 3400 },
  { name: 'Sun', sales: 2100 }];


  const handleLogin = (e) => {
    e?.preventDefault();
    setLoginError('');

    const validCredentials = [
    { username: 'admin@premiumstore.com', password: 'Admin@2026' },
    { username: 'manager@premiumstore.com', password: 'Manager@2026' },
    { username: 'staff@premiumstore.com', password: 'Staff@2026' }];


    const isValid = validCredentials?.some(
      (cred) => cred?.username === credentials?.username && cred?.password === credentials?.password
    );

    if (isValid) {
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid credentials. Please use: admin@premiumstore.com / Admin@2026');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Lock" size={32} color="var(--color-primary)" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Admin Login</h1>
              <p className="text-sm text-muted-foreground">Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Username / Email</label>
                <input
                  type="text"
                  value={credentials?.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e?.target?.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="admin@premiumstore.com"
                  required />

              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={credentials?.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e?.target?.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your password"
                  required />

              </div>

              {loginError &&
              <div className="bg-error/10 border border-error/20 rounded-lg p-3 flex items-start gap-2">
                  <Icon name="AlertCircle" size={16} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-error">{loginError}</p>
                </div>
              }

              <button
                type="submit"
                className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors duration-200">

                Sign In
              </button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-foreground">
                <p>• admin@premiumstore.com / Admin@2026</p>
                <p>• manager@premiumstore.com / Manager@2026</p>
                <p>• staff@premiumstore.com / Staff@2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Welcome back! Here's what's happening with your store today.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-card px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-xs text-muted-foreground">Current Time</p>
                  <p className="text-sm font-semibold text-foreground">
                    {currentTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="bg-card hover:bg-muted px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2">

                  <Icon name="LogOut" size={16} color="var(--color-foreground)" />
                  <span className="text-sm font-medium text-foreground">Logout</span>
                </button>
              </div>
            </div>

            <NotificationBanner
              type="warning"
              title="Inventory Alert"
              message="You have 23 products with low stock levels that require immediate attention."
              actionLabel="View Inventory"
              onAction={() => navigate('/inventory-management')} />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {mockMetrics?.map((metric, index) =>
            <MetricCard key={index} {...metric} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <SalesChart data={mockSalesData} title="Weekly Sales Overview" />
            </div>

            <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {mockQuickActions?.map((action, index) =>
                <QuickActionButton key={index} {...action} />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-foreground">Recent Activity</h3>
                <button className="text-xs md:text-sm text-accent hover:text-accent/80 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {mockRecentActivity?.map((activity, index) =>
                <ActivityItem key={index} {...activity} />
                )}
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-foreground">Inventory Alerts</h3>
                <button
                  onClick={() => navigate('/inventory-management')}
                  className="text-xs md:text-sm text-accent hover:text-accent/80 font-medium">

                  Manage Stock
                </button>
              </div>
              <div className="space-y-3">
                {mockInventoryAlerts?.map((alert, index) =>
                <InventoryAlertCard key={index} {...alert} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default AdminDashboard;