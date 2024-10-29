import mongoose from 'mongoose';

const CompanyDetailsschema = new mongoose.Schema({
    Companyname: String,
    criteria: String,
    ctc: String,
    dept: String,
    skills: String,
    date: String,
    recruitmentProcess: String,
    location: String,
    bond: String,
});

const CompanyDetails= mongoose.model("companydetails", CompanyDetailsschema);
export default CompanyDetails;