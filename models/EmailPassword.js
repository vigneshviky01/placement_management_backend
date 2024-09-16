import mongoose from 'mongoose';  // For ES modules, use import instead of require

const EmailPasswordschema = new mongoose.Schema({
 
  email: String,
  password: String
 
});

const EmailPassword= mongoose.model("EmailPassword", EmailPasswordschema);

export default EmailPassword;  // Export the model as default
