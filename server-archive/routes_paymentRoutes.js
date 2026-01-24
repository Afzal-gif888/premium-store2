// Archive of server/routes/paymentRoutes.js
import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

const mapDoc = (doc) => {
    const data = doc.data();
    return {
        ...data,
        _id: doc.id,
        date: data.date && data.date.toDate ? data.date.toDate() : data.date
    };
};

// @desc    Fetch all payments
// @route   GET /api/payments
// @access  Public
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('payments').orderBy('date', 'desc').get();
        const payments = snapshot.docs.map(mapDoc);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a payment
// @route   POST /api/payments
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { productName, size, amount, category } = req.body;

        const newPayment = {
            productName,
            size,
            amount,
            category,
            date: new Date()
        };

        const docRef = await db.collection('payments').add(newPayment);
        const doc = await docRef.get();

        res.status(201).json(mapDoc(doc));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
