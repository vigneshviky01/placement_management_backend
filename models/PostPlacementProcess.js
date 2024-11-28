import mongoose from 'mongoose';
const placementProcessSchema = new mongoose.Schema({
    companyName: {type: String,required: true},
    message:{type: String},
    type: { type: String, required: true }, // Ensure this matches the incoming request
    roundType: { type: String },
    studentInfo: { type: Object, default: null },
    fileData: { type: Array },
  });
const PostPlacementProcess = mongoose.model("placementProcess", placementProcessSchema);
export default PostPlacementProcess;
