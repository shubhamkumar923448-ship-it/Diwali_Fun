import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🔥 MongoDB Connected Successfully`);
    } catch (error) {
        console.error(`❌ Database Connection Failed: ${error.message}`);
        process.exit(1); 
    }
};

export default connectDB;