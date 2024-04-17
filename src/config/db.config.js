import mongoose from "mongoose";
import { ApplicationError } from "../Error-handler/applicationerror.js";

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB Connected");
        

    } catch (err) {
        console.log(err)
        throw new ApplicationError("Something went wrong with database", 500);
    }
}