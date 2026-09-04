// Express creates the web server and handles HTTP requests and responses.
import express from "express";
// Reads cookies sent by browsers and makes them available on req.cookies.
import cookieParser from "cookie-parser";
// Controls which browser-based frontends may call this API.
import cors from "cors";

// Creates the Express application object.
const app = express();

// Enables Cross-Origin Resource Sharing using the origin from .env.
app.use(cors({
    // The allowed frontend address. "*" allows every origin, but credentials need a specific origin in production.
    origin: process.env.CORS_ORIGIN,
    // Allows cookies and authentication headers in cross-origin requests.
    credentials: true,
}))

// Parses JSON request bodies, with a maximum size of 20 kilobytes.
app.use(express.json({limit: "20kb"}))
// Parses form-style request bodies, including nested objects.
app.use(express.urlencoded({extended: true, limit: "20kb"}))
// Serves files such as images or HTML from the public folder.
app.use(express.static("public"))
// Parses the Cookie header before route handlers run.
app.use(cookieParser())

// Makes this configured app available to src/index.js and future tests.
export default app;