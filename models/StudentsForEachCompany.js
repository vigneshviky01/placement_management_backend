import mongoose from 'mongoose';

const StudentForEachCompanySchema = new mongoose.Schema({
  CompanyName: { type: String, required: true, unique: true },
  StudentsEmail: { type: [String], required: true },
});

const StudentForEachCompany = mongoose.model("StudentForEachCompany", StudentForEachCompanySchema);

export default StudentForEachCompany;
