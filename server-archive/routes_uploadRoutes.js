// Archive of server/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary from env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// POST /api/upload
// Accepts multipart form-data with one or many files and uploads to Cloudinary.
// Field name for multiple files: 'files' (or any file fields are accepted).
router.post('/', upload.any(), async (req, res) => {
    try {
        const files = req.files || [];

        if (!files.length) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const folder = (req.body.folder) ? String(req.body.folder) : 'products';

        const uploadResults = [];

        for (const f of files) {
            const dataUri = `data:${f.mimetype};base64,${f.buffer.toString('base64')}`;
            const r = await cloudinary.uploader.upload(dataUri, {
                folder,
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            });
            uploadResults.push(r);
        }

        const urls = uploadResults.map(u => u.secure_url);
        return res.status(200).json({ success: true, urls, raw: uploadResults });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
    }
});

// Endpoint to upload sample images (kept for convenience)
router.post('/sample-images', async (req, res) => {
    try {
        const sampleImagesPath = path.join(__dirname, '../sample-images.json');
        const sampleImages = JSON.parse(fs.readFileSync(sampleImagesPath, 'utf8'));

        const uploadedImages = await Promise.all(
            sampleImages.map(async (image) => {
                const fileName = `products/${image.name.replace(/\s+/g, '_')}.jpg`;
                // Simulate image upload
                const publicUrl = `https://example.com/${fileName}`;
                return { ...image, url: publicUrl };
            })
        );

        res.status(200).json({ success: true, images: uploadedImages });
    } catch (error) {
        console.error('Error uploading sample images:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
