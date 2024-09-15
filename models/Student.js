import mongoose from 'mongoose';  // For ES modules, use import instead of require

const Studentschema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phoneNo: Number,
});

const Student = mongoose.model("Student", Studentschema);

export default Student;  // Export the model as default
