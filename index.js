import express from "express";
import mongoose from "mongoose";
// import Student from "./models/EamilPassword.js";
import StudentRoutes from "./Routes/StudentRoutes.js";
import CompanyDetailsRoutes from "./Routes/CompanyDetailsRoutes.js";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();


const app=express();
app.use(express.json());
app.use(cors()); //change later
app.use("/",StudentRoutes);
app.use("/CD",CompanyDetailsRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("Connected to mongodb")
    app.listen(process.env.PORT,()=>{
        console.log("Server is running")
    
    });
})
.catch((err)=>console.error("Failed to coonect to mongodb",err))

