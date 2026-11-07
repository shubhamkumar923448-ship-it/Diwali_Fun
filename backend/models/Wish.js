import mongoose from 'mongoose';

const wishSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true, maxlength: 300 }
}, { timestamps: true });

export default mongoose.model('Wish', wishSchema);