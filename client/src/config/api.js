// Project is frontend-only. Backend API was removed; use Firestore client SDK and Cloudinary.

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
    // If a local `/uploads` path appears, treat it as absolute (no server present)
    if (path.startsWith('/uploads')) return path;
    return path;
};

export const getCloudinaryUploadUrl = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return '';
    return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
};
