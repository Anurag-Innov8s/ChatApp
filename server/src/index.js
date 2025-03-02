import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors";
dotenv.config();
const PORT = process.env.PORT
const app = express();
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increase URL-encoded data limit


app.use(cookieParser());
app.use(cors({ 
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
app.listen(PORT,() =>{
    console.log(`Server is runnig on PORT ${PORT}`)
    connectDB();
}) 