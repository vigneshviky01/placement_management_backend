import mongoose from 'mongoose';

const Personalschema = new mongoose.Schema({
  Email:String,
  Name: String,
  RollNumber:String,
  Department:String,
  PhoneNumber: String, 
  PersonalEmail:String,
  TenthMark:String,
  TwelfthMark:String,
  CurrentSememseter:String,
 CGPA:String,
 currentBacklogs:String,
      totalBacklogs:String,
  Gender:String,
  YearOfPassing:String,
  Resume:String,
  Role:String




 
   
});

const Personal = mongoose.model("Personal", Personalschema);

export default Personal;
