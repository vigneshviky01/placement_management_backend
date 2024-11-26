import express from "express";
import CompanyDetails from "../models/CompanyDetails.js";
import dotenv from 'dotenv';
const Router = express.Router();
dotenv.config();


// Route to handle POC submissions with JD file
Router.post("/", async (req, res) => {
    const { Companyname, criteria, ctc, dept, skills, date, recruitmentProcess, location, bond } = req.body;
    console.log(req.body)
  
  
    try {
      const companydetails = await CompanyDetails.create({
        Companyname,
        criteria,
        ctc,
        dept,
        skills,
        date,
        recruitmentProcess,
        location,
        bond,
      });
  
      res.json({companydetails});
    } catch (err) {
      res.status(500).json("Error occurred while submitting");
    }
  });




// // GET route to fetch company details by company name
Router.get('/:Companyname', async (req, res) => {
  try {
      const companyName = req.params.Companyname;  // Fetch the company name from the request parameter
      const company = await CompanyDetails.findOne({ Companyname: companyName });  // Query the database

      if (!company) {
          return res.status(404).json({ message: 'Company not found' });
      }

      res.status(200).json(company);  // Return the found company details
  } catch (error) {
      console.error('Error fetching company details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET route to fetch all company details
Router.get('/', async (req, res) => {
  // try {
  //     const companies = await CompanyDetails.find();  // Fetch all company details from MongoDB

  //     if (companies.length === 0) {
  //         return res.status(404).json({ message: 'No companies found' });
  //     }

  //     res.status(200).json(companies);  // Return the array of companies
  // } catch (error) {
  //     console.error('Error fetching company details:', error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  // }

  try{
  const companies = await CompanyDetails.find();
  if (companies.length === 0) {
          res.json( 'No companies found' );
       }

       else{

         res.json(companies);
       }}
       catch(err){
        res.json(err)
       }

});

// DELETE route to delete company by company name
Router.delete('/:Companyname', async (req, res) => {
  try {
    const companyName = req.params.Companyname;  // Get the company name from the URL parameter
    const deletedCompany = await CompanyDetails.findOneAndDelete({ Companyname: companyName });

    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





Router.patch('/', async (req, res) => {
  console.log(req.body)
  const {  
    Companyname,
    criteria,
    ctc,
    dept,
    skills,
    date,
    recruitmentProcess,
    location,
    bond,} = req.body;

  try {
    // Find the student by email
    const company= await CompanyDetails.findOne({ Companyname: Companyname});
    console.log(company);
    if (!company) {
      return res.status(404).json({ message: "company not found" });
    }

    // Update only the fields provided in the request body
    if (Companyname) company.Companyname = Companyname;
    if (criteria) company.criteria = criteria;
    if (ctc) company.ctc = ctc;
    if (dept) company.dept = dept;
    if (skills) company.skills = skills;
    if (date) company.date = date;
    if (recruitmentProcess) company.recruitmentProcess = recruitmentProcess;
    if (location) company.location = location;
    if (bond) company.bond = bond;
  

    // Save the updated student information
    await company.save();

    // Respond with the updated student data
    res.status(200).json({ message: "Company details updated successfully", company });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error in updating company details" });
  }
});


// PUT route to update company details by company name
Router.put('/:Companyname', async (req, res) => {
  try {
      const companyName = req.params.Companyname;
      const updateData = req.body;

      const updatedCompany = await CompanyDetails.findOneAndUpdate(
          { Companyname: companyName },
          updateData,
          { new: true }
      );

      if (!updatedCompany) {
          return res.status(404).json({ message: "Company not found" });
      }

      res.status(200).json({ message: "Company details updated successfully", data: updatedCompany });
  } catch (error) {
      console.error("Error updating company details:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});






export default Router;