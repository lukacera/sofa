import mongoose from "mongoose";

const mongoDB: string = process.env.MONGO_URL || "mongodb://localhost:27017/mydatabase";

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
    console.log("Schemas: ", mongoose.modelNames());
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        await mongoose.connect(mongoDB);
        isConnected = true;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};