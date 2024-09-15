import express from "express";
import mongoose from "mongoose";
import Student from "./models/Student.js";
import StudentRoutes from "./Routes/StudentRoutes.js";
import cors from "cors";

const app=express();

app.use(express.json());
app.use(cors()); //change later
app.use("/",StudentRoutes);


mongoose.connect("mongodb+srv://arunkumarboopesh:arun123@cluster0.gfll2.mongodb.net/placement")
.then(()=>{console.log("Connected to mongodb")
    app.listen(3001,()=>{
        console.log("Server is running")
    
    });
})
.catch((err)=>console.error("Failed to coonect to mongodb",err))

