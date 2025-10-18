import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        return;
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }

    try{
        await mongoose.connect(process.env.MONGO_URI!);
        isConnected = true;
        console.log('Connected to MongoDB');
    }
    catch(err) {
        console.log('Error connecting to MongoDB', err);
        throw err;
    }
};