import mongoose from  "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error MongoDB connection failed:", error);
        process.exit(1);
    }
};
export default connectDb;