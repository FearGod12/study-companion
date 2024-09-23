import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/study-companion';

async function connectDB(url: string): Promise<typeof mongoose> {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB successfully');
    return mongoose;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

export const mongoDBConnection = await connectDB(url);

export default mongoDBConnection;
