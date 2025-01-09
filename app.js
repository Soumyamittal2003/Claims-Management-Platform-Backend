import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import http from "http";
import "dotenv/config";


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Import routes
import userRoute from "./routes/userRoute.js";
import claimRoute from "./routes/claimRoute.js";

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:3001",
        ,
      ],
      methods: "GET,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );

// Database connection
mongoose.connect(process.env.MONGO_URL,{
  dbName: "Claims-Management-Platform",
}).then(() => {
  console.log("Database connection is ready.");
})
.catch((err) => {
  console.log("Database connection failed. Exiting now...", err);
  process.exit(1);
});

// Routes
app.use(`/users`, userRoute);
app.use(`/claim`, claimRoute);


// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  