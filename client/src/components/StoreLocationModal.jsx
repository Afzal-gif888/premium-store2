import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import { calculateDistance, getStoreStatus, getStoreLinks, STORE_LOCATION } from '../utils/locationUtils';
import { cn } from '../utils/cn';

const StoreLocationModal = ({ isOpen, onClose }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [status, setStatus] = useState(getStoreStatus());
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState(null);

    const links = getStoreLinks();

    useEffect(() => {
        if (isOpen) {
            // Refresh status when modal opens
            setStatus(getStoreStatus());

            // Attempt to get location if permission was previously granted or just try
            handleLocateUser();
        }
    }, [isOpen]);

    const handleLocateUser = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                const dist = calculateDistance(
                    latitude,
                    longitude,
                    STORE_LOCATION.lat,
                    STORE_LOCATION.lng
                );
                setDistance(dist);
                setIsLocating(false);
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError("Location access denied. We'll show the address instead.");
                setIsLocating(false);
            },
            { timeout: 10000 }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div
                className={cn(
                    "relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-300 ease-out",
                    "animate-in slide-in-from-bottom sm:slide-in-from-bottom-4"
                )}
            >
                {/* Header Indicator for Mobile */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 sm:hidden"></div>

                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                                <img
                                    src="/assets/images/logo.jpg"
                                    alt="Premium Store"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{STORE_LOCATION.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase py-0.5 px-2 rounded-full",
                                        status.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>
                                        {status.label}
                                    </span>
                                    {distance && (
                                        <span className="text-xs text-gray-500 font-medium">
                                            • {distance.toFixed(1)} km away
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Icon name="X" size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <a
                            href={links.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 p-2 -m-2 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                <Icon name="MapPin" size={18} className="text-gray-500 group-hover:text-primary" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 leading-relaxed group-hover:text-primary transition-colors">
                                {STORE_LOCATION.address}
                            </p>
                        </a>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                <Icon name="Clock" size={18} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {status.isOpen
                                        ? `Closes at ${STORE_LOCATION.hours.weekday.close}`
                                        : `Opens at ${status.nextOpen}`}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Mon-Sat: 10AM-8PM • Sun: 10AM-6PM
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <a
                                href={links.callUrl}
                                className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                                    <Icon name="Phone" size={18} className="text-primary" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 uppercase">Call</span>
                            </a>

                            <a
                                href={links.directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 p-3 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Icon name="Navigation" size={18} className="text-white" />
                                </div>
                                <span className="text-[10px] font-bold uppercase">Go</span>
                            </a>

                            <a
                                href={links.reviewsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                                    <Icon name="Star" size={18} className="text-yellow-500" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 uppercase">Reviews</span>
                            </a>
                        </div>

                        <Button
                            fullWidth
                            size="xl"
                            onClick={onClose}
                            className="mt-4"
                        >
                            Close Details
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreLocationModal;
