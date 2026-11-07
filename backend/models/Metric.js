import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g., 'gift_downloads', 'craft_downloads', 'whatsapp_shares', 'system_shares'
    count: { type: Number, default: 0 }
});


export default mongoose.model('Metric', metricSchema);