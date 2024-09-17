import express from "express";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer'; // Import nodemailer for sending OTP emails
import EmailPassword from "../models/EmailPassword.js"; 
import Personal from "../models/Personal.js";
import Poc from "../models/PocModel.js"; 
import crypto from 'crypto'; // For generating OTP
import OTP from "../models/otp.js"; // Create OTP schema (to store OTP temporarily)
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const Router = express.Router();
dotenv.config(); 
import verifyToken from "../Middleware/VerifyToken.js"; //for protected route-->student info with verified user.email

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route to serve the PDF file
Router.get('/student/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending the file:', err);
      res.status(500).send('Error occurred while sending the file.');
    }
  });
});

// Create transporter for nodemailer (for sending OTP emails)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'msarunkumar2003@gmail.com',
    pass: 'krru ruto xjyg qjbr',
  }
});

// Route to request OTP for email verification

Router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email already exists
    const existingUser = await EmailPassword.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User Already Exist" });  // Send response with status code 409 (Conflict)
    }

    // Generate OTP if user does not exist
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP to the database
    await OTP.create({ email, otp });

    // Send OTP via email
    const mailOptions = {
      from: 'msarunkumar2003@gmail.com',
      to: email,
      subject: 'Your OTP for Signup',
      text: `Your OTP for signup is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error in otp")
        return res.status(500).json({ message: 'Error sending OTP email' });
      } else {
        console.log("OTP sent successfully")
        res.json({ message: 'OTP sent successfully' });
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Error while generating OTP' });
  }
});



// Route to verify OTP
Router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Find the OTP record for the given email
    const otpRecord = await OTP.findOne({ email, otp });
    if (otpRecord) {
      // OTP is valid, so delete the OTP record after verification
      await OTP.deleteOne({ email });
      res.json('OTP verified');
    } else {
      res.status(400).json('Invalid OTP');
    }
  } catch (err) {
    res.status(500).json('Error verifying OTP');
  }
});

// Route to handle signup (only after OTP is verified)
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
        Email:email,
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
        Role: "student"
      });

      res.json({ newStudentEmail, newStudentPersonal });
    }
  } catch (err) {
    res.status(500).json({ message: "SignUp error", err });
  }
});


// Route to handle login
Router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await EmailPassword.findOne({ email });

    if (!student) {
      return res.json({message:"not found"});
    }

    // Compare the provided password with the hashed password
    const isMatch = bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.json({message:"password not match"});
    }

    // Create and sign a JWT token (with user id or any payload)
    const token = jwt.sign({ id: student._id, email: student.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Found and verified", token }); // Send token to the client
  } catch (err) {
    res.status(500).json({ message: "Login error", err });
  }
});


// Route to handle POC submissions with JD file
Router.post("/poc", upload.single('jdfile'), async (req, res) => {
  const { Companyname, criteria, ctc, dept, skills, date, recruitmentProcess, location, bond } = req.body;
  const jdfile = req.file.filename;

  try {
    const poc = await Poc.create({
      Companyname,
      criteria,
      ctc,
      dept,
      skills,
      date,
      recruitmentProcess,
      location,
      bond,
      jdfile
    });

    res.json({ poc });
  } catch (err) {
    res.status(500).json("Error occurred while submitting");
  }
});

export default Router;