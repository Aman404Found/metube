// Loads the configDotenv function from the dotenv package.
import { configDotenv } from "dotenv";
// Imports Mongoose. This import is currently unused here, but it can be removed safely.
import mongoose from "mongoose";
// Imports our own function that opens the MongoDB connection.
import connectDB from "./db/db.js";
// Imports the configured Express application.
import app from "./app.js";

// Reads values from the .env file and places them in process.env.
configDotenv();

// Connect to the database before accepting web requests.
connectDB()
.then(() => {
    // Start the HTTP server only after the database connection succeeds.
    app.listen(process.env.PORT || 8000,() => {
        // Print the port so we know where the API is available.
        console.log(`app is listening on port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    // Handles a rejected database connection promise.
    console.log("mongoDB connection failed !! \n", err);
})