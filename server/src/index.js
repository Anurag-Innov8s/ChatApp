import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
dotenv.config();
const PORT = process.env.PORT
const app = express();
import authRoutes from "./routes/authRoutes.js"
app.use("/api/auth",authRoutes)
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })); // Optional: for form data

app.listen(PORT,() =>{
    console.log(`Server is runnig on PORT ${PORT}`)
    connectDB();
}) 