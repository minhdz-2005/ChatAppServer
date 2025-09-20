import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        return mongoose.connection;
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}