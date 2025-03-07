import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors";
import path from "path";
import { app,server } from "./lib/socket.js";
dotenv.config();
const PORT = process.env.PORT
const __dirname = path.resolve();
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increase URL-encoded data limit

 
app.use(cookieParser());
app.use(cors({ 
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    })
}

server.listen(PORT,() =>{
    console.log(`Server is runnig on PORT ${PORT}`)
    connectDB();
}) 