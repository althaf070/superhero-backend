import mongoose from "mongoose";

export const connectToDb = async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to db");
        
    } catch (error) {
        console.log(error.message,"Error connecting to mongodb")
        
    }
}