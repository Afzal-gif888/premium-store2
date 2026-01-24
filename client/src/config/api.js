const getApiUrl = () => {
    // 1. Explicitly set VITE_API_URL (Production)
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    const hostname = window.location.hostname;

    // 2. Local development fallback
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }

    // 3. Current origin (Likely misconfigured production)
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
        console.error('[CONFIG] CRITICAL: VITE_API_URL is not set. API calls will fail.');
    }

    return window.location.origin;
};

export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = {
    PRODUCTS: `${API_BASE_URL}/api/products`,
    ANNOUNCEMENTS: `${API_BASE_URL}/api/announcements`,
    UPLOAD: `${API_BASE_URL}/api/upload`,
    PAYMENTS: `${API_BASE_URL}/api/payments`,
};

export const getImageUrl = (path, options = {}) => {
    if (!path) return '';

    // Optimization for Cloudinary URLs
    if (path.includes('cloudinary.com')) {
        // base transformation: auto format, auto quality
        let transformations = 'f_auto,q_auto';

        // Add resizing if width/height provided
        if (options.width) transformations += `,w_${options.width}`;
        if (options.height) transformations += `,h_${options.height}`;
        // crop mode usually 'limit' or 'fill' depending on need, 'limit' is safe
        if (options.width || options.height) transformations += ',c_limit';

        // Insert transformations after /upload/
        return path.replace('/upload/', `/upload/${transformations}/`);
    }

    if (path.startsWith('http')) return path; // Already absolute
    if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`; // Local upload
    return path;
};
