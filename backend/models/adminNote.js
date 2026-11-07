import mongoose from 'mongoose';

const adminNoteSchema = new mongoose.Schema({
    sender: { type: String, default: 'Anonymous Friend' },
    message: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('AdminNote', adminNoteSchema);