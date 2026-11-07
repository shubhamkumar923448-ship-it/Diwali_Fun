import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, default: 'admin' },
    password: { type: String, required: true } // Storing hashed or plain password
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);