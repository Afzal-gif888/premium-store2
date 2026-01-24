import express from 'express';
import { db } from '../config/firebase.js';
import apicache from 'apicache';

const router = express.Router();

// Helper to map Firestore doc
const mapDoc = (doc) => {
    const data = doc.data();
    return {
        ...data,
        _id: doc.id,
        createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
    };
};

// @desc    Fetch all announcements
// @route   GET /api/announcements
// @access  Public
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
        const announcements = snapshot.docs.map(mapDoc);
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add an announcement (Auto-clears existing ones)
// @route   POST /api/announcements
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { title, description, image } = req.body;
        console.log(`[ANNOUNCEMENT] New publish request: "${title}"`);

        // 1. Clear ALL existing announcements first
        const snapshot = await db.collection('announcements').get();
        if (!snapshot.empty) {
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            console.log(`[ANNOUNCEMENT] Cleared ${snapshot.size} old announcements`);
        }

        // 2. Create the new one
        const newAnnouncement = {
            title,
            description,
            image,
            active: true, // From Prompt FirestoreSchema: active boolean.
            createdAt: new Date()
        };

        const docRef = await db.collection('announcements').add(newAnnouncement);

        console.log(`[ANNOUNCEMENT] SUCCESS: Saved new announcement with ID ${docRef.id}`);

        apicache.clear('/api/announcements');
        apicache.clear('/api/announcements*');

        const doc = await docRef.get();
        res.status(201).json(mapDoc(doc));
    } catch (error) {
        console.error(`[ANNOUNCEMENT] POST ERROR: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const docRef = db.collection('announcements').doc(id);
        const doc = await docRef.get();

        if (doc.exists) {
            await docRef.delete();
            apicache.clear('/api/announcements');
            apicache.clear('/api/announcements*');
            res.json({ message: 'Announcement removed' });
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
