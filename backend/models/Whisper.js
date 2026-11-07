import mongoose from 'mongoose';

const whisperSchema = new mongoose.Schema({
    sender: { type: String, required: true, trim: true },
    msg: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Whisper', whisperSchema);