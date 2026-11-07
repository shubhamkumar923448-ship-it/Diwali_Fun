import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    festival: { type: String, enum: ['diwali', 'chhath', 'both'], default: 'diwali' },
    ipAddress: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Visitor', visitorSchema);