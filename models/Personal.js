import mongoose from 'mongoose';

const Personalschema = new mongoose.Schema({
  Name: String,
  RollNumber:String,
  Department:String,
  PhoneNumber: String, 
  PersonalEmail:String,
  TenthMark:String,
  TwelfthMark:String,
  CurrentSememseter:String,
 CGPA:String,
  Gender:String,
  YearOfPassing:String,
  Resume:String




 
   
});

const Personal = mongoose.model("Personal", Personalschema);

export default Personal;
