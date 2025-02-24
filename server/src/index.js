import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();
import authRoutes from "./routes/authRoutes.js"
app.use("/api/auth",authRoutes)
app.use(express.json)
app.listen(5001,() =>{
    console.log(`Server is runnig on PORT ${process.env.port}`)
    connectDB();
})
