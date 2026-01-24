/**
 * Utility functions for geolocation and store availability status.
 */

// Store Constants
export const STORE_LOCATION = {
    lat: 14.726251446596908,
    lng: 78.73716675483196,
    name: "Premium Store",
    address: "Beside Bharath Theatre Street, Upstairs Of RI Fashion Mydukur",
    phone: "+918074463123",
    googlePlaceId: "ChIJu7S-p6_xTzoR9fU9qY7I8gI", // Placeholder or real
    hours: {
        weekday: { open: "10:00", close: "20:00" }, // Mon-Sat
        sunday: { open: "10:00", close: "18:00" }   // Sun
    }
};

/**
 * Calculates the Haversine distance between two sets of coordinates in kilometers.
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

/**
 * Determines if the store is currently open based on local time.
 * Returns { isOpen: boolean, message: string }
 */
export const getStoreStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1-6 are Mon-Sat
    const time = now.getHours() * 100 + now.getMinutes();

    const isSunday = day === 0;
    const config = isSunday ? STORE_LOCATION.hours.sunday : STORE_LOCATION.hours.weekday;

    const [openH, openM] = config.open.split(':').map(Number);
    const [closeH, closeM] = config.close.split(':').map(Number);

    const openTime = openH * 100 + openM;
    const closeTime = closeH * 100 + closeM;

    if (time >= openTime && time < closeTime) {
        return {
            isOpen: true,
            label: 'Open Now',
            closingSoon: (closeTime - time) < 60 // Less than 1 hour remaining
        };
    }

    return {
        isOpen: false,
        label: 'Closed',
        nextOpen: isSunday ? 'Monday 10:00 AM' : (day === 6 ? 'Monday 10:00 AM' : 'Tomorrow 10:00 AM')
    };
};

/**
 * Returns deep links for navigation, calling, and reviews.
 */
export const getStoreLinks = () => {
    const { lat, lng, address, phone, googlePlaceId } = STORE_LOCATION;

    // Directions
    const directionsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    // Call
    const callUrl = `tel:${phone}`;

    // WhatsApp (using wa.me format with country code)
    const phoneClean = phone.replace(/[^0-9]/g, ''); // Remove non-numeric chars
    const whatsappUrl = `https://wa.me/${phoneClean}`;

    // Reviews (Place Content)
    const reviewsUrl = `https://search.google.com/local/writereview?placeid=${googlePlaceId}`;

    return { directionsUrl, callUrl, whatsappUrl, reviewsUrl };
};

