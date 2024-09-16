import express from "express";
import EmailPassword from "../models/EmailPassword.js"; 
import Personal  from "../models/Personal.js"; // Use default import (no curly braces)
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import verifyToken from "../Middleware/VerifyToken.js"; //for protected route-->student info with verified user.email
const Router = express.Router();

Router.post("/signup", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const student = await EmailPassword.findOne({ email });
    if (student) {
      return res.json("User Already Exist");
    } else {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user details
      const newStudentEmail = await EmailPassword.create({ email, password: hashedPassword });
      const newStudentPersonal = await Personal.create({
        Name: name,
        RollNumber: "",
        Department: "",
        PhoneNumber: phoneNumber,
        PersonalEmail: "",
        TenthMark: "",
        TwelfthMark: "",
        CurrentSememseter: "",
        CGPA: "",
        Gender: "",
        YearOfPassing: "",
        Resume: "",
      });

      res.json({ newStudentEmail, newStudentPersonal });
    }
  } catch (err) {
    res.status(500).json({ message: "SignUp error", err });
  }
});


Router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await EmailPassword.findOne({ email });

    if (!student) {
      return res.json("not found");
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.json("password not match");
    }

    // Create and sign a JWT token (with user id or any payload)
    const token = jwt.sign({ id: student._id, email: student.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Found and verified", token }); // Send token to the client
  } catch (err) {
    res.status(500).json({ message: "Login error", err });
  }
});


export default Router;
