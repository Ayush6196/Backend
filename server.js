const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize express
const app = express();

app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017/CRM';
mongoose.connect(mongoURI)
  .then(() => console.log("Connected Successfully"))
  .catch(error => console.log(error));

// Schema
const signupSchema = new mongoose.Schema({  
  User_name: {
    type: String,
    required: true   
  },
  Email: {
    type: String,
    required: true,  
    unique: true
  },
  Password: {
    type: String,    
    required: true   
  }
});

// Creating Collection Name
const SignUp = mongoose.model('SignUp', signupSchema);

app.post('/api/signup', async (req, res) => {
  try {
    const { User_name, Email, Password } = req.body;
    if (!User_name || !Email || !Password) {
      return res.status(400).json({ message: "All fields are required" }); 
    }
    const newSignUp = new SignUp({
      User_name,
      Email,
      Password
    });
    await newSignUp.save();
    res.status(201).json({ message: "Signup Successfully", SignUp: newSignUp });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});
