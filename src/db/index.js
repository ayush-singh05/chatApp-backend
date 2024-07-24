import mongoose from "mongoose";

// connecting mongoDb datatbase 
export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`\n MongoDB connected! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongoose Connection Failed",error);
        process.exit(1);
    }
}