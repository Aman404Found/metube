// Mongoose gives the application a JavaScript interface for MongoDB.
import mongoose from "mongoose";
// Reuses the central database-name constant.
import { DB_NAME } from "../constants.js";

// An async function can pause while MongoDB establishes a connection.
const connectDB = async () => {
    try {
        // Wait for MongoDB to connect, then keep the returned connection details.
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        // Confirm the connection and show the MongoDB host.
        console.log(`\n MongoDB connected !! DB Host ${connectionInstance.connection.host}`);
    } catch(error) {
        // Log the original error to make configuration/network problems visible.
        console.log("ERROR:",error);
        // Stop the process because the server cannot safely operate without its database.
        process.exit(1);
    }
}

// Allows src/index.js to start the connection process.
export default connectDB;