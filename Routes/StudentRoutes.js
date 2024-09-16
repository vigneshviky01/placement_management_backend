import express from "express";
import EmailPassword from "../models/EmailPassword.js"; 
import Personal  from "../models/Personal.js"; // Use default import (no curly braces)

const Router = express.Router();

Router.post("/signup", async (req, res) => {
 
  const { name,email,password,phoneNumber } = req.body;
  console.log(phoneNumber);
  try {
    const student= await EmailPassword.findOne({ email });
    if (student) {
      return res.json("User Already Exist");
    } else {
      const newStudentEmail = await EmailPassword.create({email,password});
      const newStudentPersonal = await Personal.create({Name:name,RollNumber:"",Department:"",PhoneNumber:phoneNumber,PersonalEmail:"",TenthMark:"",TwelfthMark:"",CurrentSememseter:"",CGPA:"",Gender:"",YearOfPassing:"",Resume:""});
      res.json({ newStudentEmail, newStudentPersonal });
    }
  } catch (err) {
    res.json("SignUp error",err);
  }
});

Router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await EmailPassword.findOne({ email });
  if (student) {
    if (student.password === password) {
      res.json("Found and verified");
    } else {
      res.json("password not match");
    }
  } else {
    res.json("not found");
  }
});

export default Router;
