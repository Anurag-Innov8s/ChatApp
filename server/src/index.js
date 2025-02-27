import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import cookieParser from "cookie-parser"

dotenv.config();
const PORT = process.env.PORT
const app = express();
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })); // Optional: for form data

app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
app.listen(PORT,() =>{
    console.log(`Server is runnig on PORT ${PORT}`)
    connectDB();
}) 