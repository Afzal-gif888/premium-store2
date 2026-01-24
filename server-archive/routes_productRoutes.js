// Archive of server/routes/productRoutes.js
import express from 'express';
import { db } from '../config/firebase.js';
import apicache from 'apicache';

const router = express.Router();

// Local cache middleware alias - we'll apply caching only to GET endpoints
const cache = apicache.middleware;

// Helper to clear product cache
const clearProductCache = () => {
    apicache.clear('/api/products');
    apicache.clear('/api/products*');
    console.log('[CACHE] Cleared all product-related caches with wildcards');
};

// Map Firestore doc to Frontend object
const mapDoc = (doc) => {
    const data = doc.data();
    return {
        ...data,
        _id: doc.id, // Frontend expects _id
        // Handle dates if they are Firestore Timestamps
        createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
    };
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', cache('2 minutes'), async (req, res) => {
    try {
        const snapshot = await db.collection('products').get();
        const products = snapshot.docs.map(mapDoc);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch all products (Alias for collections)
// @route   GET /api/products/collections
// @access  Public
router.get('/collections', cache('2 minutes'), async (req, res) => {
    try {
        const snapshot = await db.collection('products').get();
        const products = snapshot.docs.map(mapDoc);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('products').doc(req.params.id).get();
        if (doc.exists) {
            res.json(mapDoc(doc));
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a product
// @route   POST /api/products
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, brand, category, price, sizes, image, images } = req.body;

        // Normalize images: images may be an array, or image may be a single url
        const imagesArray = Array.isArray(images)
            ? images
            : (images ? [images] : (image ? [image] : []));

        // Validation: require at least one image URL
        if (!imagesArray.length) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
            return res.status(400).json({ message: 'Sizes must be a non-empty array' });
        }

        const newProduct = {
            name,
            category,
            price: Number(price),
            sizes,
            // keep legacy `image` as first image for compatibility
            image: imagesArray[0],
            images: imagesArray,
            isBestseller: false,
            createdAt: new Date()
        };

    const docRef = await db.collection('products').add(newProduct);
    const doc = await docRef.get();

    clearProductCache();

    // Return the created product and include both legacy `_id` and explicit `id`
    const productObj = mapDoc(doc);
    productObj.id = docRef.id;
    res.status(201).json(productObj);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const { name, brand, category, price, sizes, image, images } = req.body;
        const docRef = db.collection('products').doc(req.params.id);
        const doc = await docRef.get();

        if (doc.exists) {
            const updates = {};
            if (name) updates.name = name;
            if (brand) updates.brand = brand;
            if (category) updates.category = category;
            if (price !== undefined) updates.price = Number(price);
            if (sizes) updates.sizes = sizes;

            if (Array.isArray(images) && images.length) {
                updates.images = images;
                updates.image = images[0];
            } else if (image) {
                updates.image = image;
            }

            await docRef.update(updates);

            // Return updated
            const updatedDoc = await docRef.get();
            clearProductCache();
            res.json(mapDoc(updatedDoc));
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Toggle bestseller status
// @route   PATCH /api/products/:id/bestseller
// @access  Public
router.patch('/:id/bestseller', async (req, res) => {
    try {
        const { isBestseller } = req.body;
        const docRef = db.collection('products').doc(req.params.id);
        const doc = await docRef.get();

        if (doc.exists) {
            await docRef.update({ isBestseller });

            const updatedDoc = await docRef.get();
            clearProductCache();
            res.json(mapDoc(updatedDoc));
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
router.delete('/:id', async (req, res) => {
    const id = req.params.id.trim();
    try {
        const docRef = db.collection('products').doc(id);
        const doc = await docRef.get();

        if (doc.exists) {
            await docRef.delete();
            clearProductCache();
            res.json({ success: true, message: 'Product removed successfully' });
        } else {
            // Attempt to find by usage of custom 'id' field if it was used? 
            // In Firestore we usually rely on doc ID.
            // Assuming migrated data uses same IDs or frontend sends default logic.
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Backend error: ' + error.message });
    }
});

export default router;
