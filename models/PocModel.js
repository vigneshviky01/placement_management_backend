import mongoose from 'mongoose';

const Pocschema = new mongoose.Schema({
    Companyname: String,
    criteria: String,
    ctc: String,
    dept: String,
    skills: String,
    date: String,
    recruitmentProcess: String,
    location: String,
    bond: String,
    jdfile:String
});

const Poc = mongoose.model("Poc", Pocschema);

export default Poc;