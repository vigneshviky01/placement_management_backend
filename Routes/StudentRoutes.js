import express from "express";
import Student from "../models/Student.js";  // Use default import (no curly braces)

const Router = express.Router();

Router.post("/signup", async (req, res) => {
  const { email } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (student) {
      res.json("User Already Exist");
    } else {
      const newStudent = await Student.create(req.body);
      res.json(newStudent);
    }
  } catch (err) {
    res.json("SignUp error");
  }
});

Router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
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
