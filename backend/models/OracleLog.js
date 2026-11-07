import mongoose from 'mongoose';

const oracleSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    oracle: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('OracleLog', oracleSchema);