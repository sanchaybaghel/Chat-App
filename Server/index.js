
import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRotes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessageRoutes.js";
import setupSocket from "./socket.js";
dotenv.config()
const app=express()
const port=process.env.PORT || 3001
const databaseURL=process.env.DATABASE_URL;
console.log("port",port)
console.log("databaseURL",process.env.DATABASE_URL)
app.use(cors({
    origin: "https://chat-app-ruddy-phi-27.vercel.app", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRotes)
app.use("/api/contacts",contactsRoutes)
app.use("/api/messages",messagesRoutes)
app.get("/",(req,res)=>{
    res.send("Hello World!")
})
const server=app.listen(port,(req,res)=>{
},console.log(`Server is running at http://localhost:${port}`))

setupSocket(server) 

mongoose.connect(databaseURL).then(()=>console.log("DB Connection Successfully.")).catch(err=>console.log(err.message))