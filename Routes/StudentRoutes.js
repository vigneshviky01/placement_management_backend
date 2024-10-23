import express from "express";
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer'; // Import nodemailer for sending OTP emails
import EmailPassword from "../models/EmailPassword.js"; 
import Personal from "../models/Personal.js";
 
import crypto from 'crypto'; // For generating OTP
import OTP from "../models/otp.js"; // Create OTP schema (to store OTP temporarily)
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const Router = express.Router();
dotenv.config(); 
import verifyToken from "../Middleware/VerifyToken.js"; //for protected route-->student info with verified user.email

// // Multer storage setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Route to serve the PDF file
// Router.get('/student/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, 'uploads', filename);

//   res.sendFile(filePath, (err) => {
//     if (err) {
//       console.error('Error sending the file:', err);
//       res.status(500).send('Error occurred while sending the file.');
//     }
//   });
// });

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
    const student2 = await Personal.findOne({ Email :email });

    // If student is not found in either collection
    if (!student) {
      return res.json({ message: "Email not found" });
    }

    // If student2 (from Personal collection) is not found
    console.log("Role test: ",student2)
    if (!student2) {
      return res.json({ message: "No role found for the student" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.json({ message: "Password does not match" });
    }

    // Create and sign a JWT token (with user id or any payload)
    const token = jwt.sign({ id: student._id, email: student.email, role: student2.Role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Login successful", token }); // Send token to the client
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login error", err });
  }
});




Router.post("/student", async (req, res) => {
  const email = req.body.email;
  console.log(email);
  try {
    const student = await Personal.findOne({Email: email }); // Make sure the field name matches the DB schema
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
     res.json(student);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Route to update student details selectively (PATCH request)
Router.patch('/student/update', async (req, res) => {
  console.log(req.body)
  const { email, rollNumber, department, personalEmail, tenthMark, twelfthMark, currentSemester, CGPA, gender, yearOfPassing, resume } = req.body;

  try {
    // Find the student by email
    const student = await Personal.findOne({ Email: email });
    console.log(student);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update only the fields provided in the request body
    if (rollNumber) student.RollNumber = rollNumber;
    if (department) student.Department = department;
    if (personalEmail) student.PersonalEmail = personalEmail;
    if (tenthMark) student.TenthMark = tenthMark;
    if (twelfthMark) student.TwelfthMark = twelfthMark;
    if (currentSemester) student.CurrentSememseter = currentSemester;
    if (CGPA) student.CGPA = CGPA;
    if (gender) student.Gender = gender;
    if (yearOfPassing) student.YearOfPassing = yearOfPassing;
    if (resume) student.Resume = resume;

    // Save the updated student information
    await student.save();

    // Respond with the updated student data
    res.status(200).json({ message: "Student details updated successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating student details" });
  }
});


// Route for adding a POC
Router.post('/add-poc', async (req, res) => {
  const { Email} = req.body;

  try {
      const person = await Personal.findOne({Email: Email });

      if (!person) {
          return res.status(404).json({ message: "User not found" });
      }

      person.Role = 'poc';
      await person.save();

      res.status(200).json({ message: "POC added successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error updating role", error });
  }
});

// Route for removing a POC
Router.post('/remove-poc', async (req, res) => {
  const { Email } = req.body;

  try {
      const person = await Personal.findOne({Email: Email });

      if (!person) {
          return res.status(404).json({ message: "User not found" });
      }

      person.Role = 'student';
      await person.save();

      res.status(200).json({ message: "POC removed successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error updating role", error });
  }
});

export default Router;