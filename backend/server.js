import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import apiRoutes from './routes/apiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import Metric from './models/Metric.js';


// Seed initial metrics if not already present in DB
async function seedMetrics() {
    const keys = ['gift_downloads', 'craft_downloads', 'whatsapp_shares', 'system_shares'];
    for (let key of keys) {
        const exists = await Metric.findOne({ key });
        if (!exists) {
            await Metric.create({ key, count: 0 }); // Start fresh from 0 real counts!
        }
    }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

dotenv.config({ path: path.join(__dirname, '../.env') });


connectDB();
seedMetrics(); // Seed initial metrics if not already present in DB


const app = express();


app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/shubham-dashboard', (req, res) => {
    // Send the admin.html file explicitly when someone visits /system-login
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});



app.use('/api/v1', apiRoutes);
app.use('/api/v1/admin', adminRoutes);


// === SERVER START ===
const PORT = process.env.PORT || 1307;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}`);
});