import './config/env.js';
import express from 'express';

import compression from 'compression';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import apicache from 'apicache';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Validate critical environment variables
const requiredEnvVars = []; // No longer enforcing Cloudinary
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
    console.error(`[CRITICAL] Missing required environment variables: ${missingVars.join(', ')}`);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: 'firebase',
        uptime: process.uptime(),
        env: process.env.NODE_ENV || 'development',
        port: PORT,
        cacheKeys: apicache ? apicache.getIndex().all : []
    });
});

// Cache configuration
const cache = apicache.middleware;
export const clearCache = (name) => {
    if (name) {
        apicache.clear(name);
        console.log(`[CACHE] Cleared: ${name}`);
    } else {
        apicache.clear();
        console.log(`[CACHE] Cleared ALL`);
    }
};

// Middleware
app.use(compression());

// CORS Configuration - Production Ready


// CORS Configuration - Permissive for Debugging
app.use(cors({
    origin: true, // Reflect request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request tracing
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Database Connection (Firebase)
// Firebase is initialized in config/firebase.js which is imported by routes
// We just log that we are running in a mode that supports Firebase
const connectDB = async () => {
    console.log('[INIT] Firebase Admin SDK initialized via config/firebase.js');
};


// Routes
// Apply product routes without a global cache middleware here. Caching is applied selectively
// inside the productRoutes for GET endpoints only to avoid caching POST/PUT/PATCH/DELETE responses.
app.use('/api/products', productRoutes);
app.use('/api/announcements', announcementRoutes); // Removed 10min cache for immediate updates
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// Static files & SPA Fallback with aggressive caching for build assets
const buildPath = path.join(__dirname, '../client/build');

if (fs.existsSync(buildPath)) {
    console.log(`[INIT] Serving static files from ${buildPath}`);
    app.use(express.static(buildPath, {
        maxAge: '1y',
        immutable: true,
        index: false
    }));

    // Redirect all non-API requests to index.html for React Router to handle
    app.use((req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/.netlify')) {
            return next();
        }
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    console.log(`[INIT] Static build path not found at ${buildPath}. Skipping static serving.`);
    // In Netlify/Serverless, static files are served by the CDN, not Express.
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    if (!res.headersSent) {
        res.status(500).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
});

// Start Server
const startServer = async () => {
    console.log(`[INIT] Starting server in ${process.env.NODE_ENV || 'development'} mode...`);

    // Listen on PORT immediately to satisfy Railway's health check
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`[SUCCESS] Server is listening on port ${PORT}`);
        console.log(`[INFO] Health check available at /health`);
    });

    server.timeout = 300000;

    // Connect to database in the background/sequentially but after listening
    await connectDB();
};

// Auto-start if run directly
const isMainModule = (path) => {
    if (!path) return false;
    const normalizedPath = path.replace(/\\/g, '/');
    return normalizedPath.endsWith('server/server.js') || normalizedPath.endsWith('server.js');
};

if (isMainModule(process.argv[1])) {
    startServer().catch(err => {
        console.error('[FATAL] Failed to start server:', err);
        process.exit(1);
    });
}

export default app;
