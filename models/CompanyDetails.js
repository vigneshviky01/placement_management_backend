import mongoose from 'mongoose';

const CompanyDetailsschema = new mongoose.Schema({
    Companyname: String,
    criteria: String,
    currentBacklogs:String,
    totalBacklogs:String,
    ctc: String,
    dept: String,
    skills: String,
    date: String,
    recruitmentProcess: String,
    location: String,
    bond: String,
    role: String,
});

const CompanyDetails= mongoose.model("companydetails", CompanyDetailsschema);
export default CompanyDetails;