import express from 'express';
import Wish from '../models/Wish.js';
import Whisper from '../models/Whisper.js';
import Visitor from '../models/Visitor.js';
import Metric from '../models/Metric.js';
import OracleLog from '../models/OracleLog.js';
import AdminNote from '../models/adminNote.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
    res.status(200).json({ status: "Supreme Nexus Architecture is Active! ✨" });
});

// 1. Save a New Wish to the Wish Tree
router.post('/wishes', async (req, res) => {
    try {
        const { name, text } = req.body;
        const newWish = new Wish({ name, text });
        await newWish.save();
        res.status(201).json({ success: true, message: 'Wish planted successfully on the tree!', data: newWish });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/wishes', async (req, res) => {
    try {
        const wishes = await Wish.find();
        res.status(200).json({ success: true, wishes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Track a Visitor
router.post('/visitor', async (req, res) => {
    try {
        const { name, festival } = req.body;
        const visitor = new Visitor({ name, festival, ipAddress: req.ip });
        await visitor.save();
        res.status(201).json({ success: true, message: 'Visitor logged', data: visitor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/metrics/increment', async (req, res) => {
    try {
        const { key } = req.body; // e.g., 'gift_downloads', 'whatsapp_shares', etc.
        let metric = await Metric.findOne({ key });
        if (metric) {
            metric.count += 1;
            await metric.save();
        } else {
            metric = await Metric.create({ key, count: 1 });
        }
        res.status(200).json({ success: true, count: metric.count });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/oracle-log', async (req, res) => {
    try {
        const { name, oracle } = req.body;
        const newLog = new OracleLog({
            name: name || 'Anonymous Star',
            oracle: oracle || 'Divine Light'
        });
        await newLog.save();
        res.status(201).json({ success: true, message: 'Oracle log recorded successfully', data: newLog });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/whispers', async (req, res) => {
    try {
        const { sender, msg } = req.body;
        const newWhisper = new Whisper({ sender, msg });
        await newWhisper.save();
        res.status(201).json({ success: true, message: 'Whisper recorded successfully', data: newWhisper });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/admin-notes', async (req, res) => {
    try {
        const { sender, message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, message: "Note cannot be empty" });
        }

        const newNote = new AdminNote({ sender, message });
        await newNote.save();
        res.status(201).json({ success: true, message: 'Note sent to Creator successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;