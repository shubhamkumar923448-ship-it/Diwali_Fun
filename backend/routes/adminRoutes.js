import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Visitor from '../models/Visitor.js';
import Wish from '../models/Wish.js';
import OracleLog from '../models/OracleLog.js';
import Whisper from '../models/Whisper.js';
import Metric from '../models/Metric.js';
import AdminNote from '../models/adminNote.js';

const router = express.Router();

// 1. INITIAL SETUP ROUTE (Run once via Postman to set admin password in DB)
router.post('/login', async (req, res) => {
    try {
        console.log("📥 Incoming Login Request Body:", req.body);
        const { password } = req.body;

        const admin = await Admin.findOne({ username: 'admin' });
        console.log("🔍 Admin found in DB:", admin);

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Admin not initialized. Run /setup first.' });
        }

        console.log(`🔐 Comparing -> Input: "${password}" vs DB: "${admin.password}"`);

        if (password === admin.password) {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'nexus_secret', { expiresIn: '24h' });
            return res.status(200).json({ success: true, token, message: 'Authentication Granted from DB' });
        }

        return res.status(401).json({ success: false, message: 'Invalid Access Key' });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. SECURE LOGIN ROUTE (Checks password against MongoDB)
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;

        // Find admin in database
        const admin = await Admin.findOne({ username: 'admin' });

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Admin not initialized. Run /setup first.' });
        }

        // Compare password directly from DB
        if (password === admin.password) {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'nexus_secret', { expiresIn: '24h' });
            return res.status(200).json({ success: true, token, message: 'Authentication Granted from DB' });
        }

        return res.status(401).json({ success: false, message: 'Invalid Access Key' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. GET REAL-TIME DASHBOARD STATS & LOGS
router.get('/dashboard-data', async (req, res) => {
    try {
        const totalVisitors = await Visitor.countDocuments();
        const totalWishes = await Wish.countDocuments();
        const totalWhispers = await Whisper.countDocuments();
        

        const visitors = await Visitor.find().sort({ createdAt: -1 }).limit(50);
        const wishes = await Wish.find().sort({ createdAt: -1 }).limit(50);
        const oracleLogs = await OracleLog.find().sort({ createdAt: -1 }).limit(50);
        const whispers = await Whisper.find().sort({ createdAt: -1 }).limit(50);
        const adminNotes = await AdminNote.find().sort({ createdAt: -1 }).limit(50);

        const metricsRaw = await Metric.find();
        const metrics = {};
        metricsRaw.forEach(item => {
            metrics[item.key] = item.count;
        });

        // Calculate last 7 days real visitor counts from database
        const chartLabels = [];
        const chartVisitorData = [];
        const chartInteractionData = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayString = d.toLocaleDateString('en-US', { weekday: 'short' });
            chartLabels.push(dayString);

            // Start and end of that specific day
            const startOfDay = new Date(d.setHours(0, 0, 0, 0));
            const endOfDay = new Date(d.setHours(23, 59, 59, 999));

            const dayVisitors = await Visitor.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
            const dayWishes = await Wish.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });

            chartVisitorData.push(dayVisitors);
            chartInteractionData.push(dayWishes);
        }

        res.status(200).json({
            success: true,
            stats: {
                visitors: totalVisitors,
                treeWishes: totalWishes,
                whispers: totalWhispers
            },
            chartData: {
                labels: chartLabels,
                visitors: chartVisitorData,
                interactions: chartInteractionData
            },
            visitors,
            wishes,
            oracleLogs,
            whispers,
            adminNotes,
            metrics
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// 4. DELETE WISH FROM TREE
router.delete('/wish/:id', async (req, res) => {
    try {
        await Wish.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Wish erased successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/visitor', async (req, res) => {
    try {
        const { name, festival } = req.body;
        const visitor = new Visitor({
            name: name || 'Anonymous Visitor',
            festival: festival || 'diwali',
            ipAddress: req.ip
        });
        await visitor.save();
        res.status(201).json({ success: true, message: 'Visitor logged successfully', data: visitor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;