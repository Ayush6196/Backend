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
    required: true
    
  },
  Password: {
    type: String,    
    required: true   
  },

  gender:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  },
  hobbies:{
    type:[String]
  }
});

// Creating Collection Name
const SignUp = mongoose.model('SignUp', signupSchema);

app.post('/api/signup', async (req, res) => {
  try {
    const { User_name, Email, Password,gender,status,hobbies } = req.body;
    if (!User_name || !Email || !Password|| !status) {
      return res.status(400).json({ message: "All fields are required" }); 
    }
    const newSignUp = new SignUp({
      User_name,
      Email,
      Password,
      gender,
      status,
      hobbies: hobbies||[]

    });
    await newSignUp.save();
    res.status(201).json({ message: "Signup Successfully", SignUp: newSignUp });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


//Login API

app.post('/api/login',async(req,res)=>{
  try{

const {Email,Password}=req.body;
if(!Email|| !Password){
  return res.status(400).json({message:"Email and Password are required"});
}
//Find the signup email
const existingUser=await SignUp.findOne({Email});
if(!existingUser){
  return res.status(400).json({message:"Invalid Email or Password"});
}
//data match check
if(existingUser.Password!=Password){
  return res.status(400).json({message:"Invalid Password"})
}

res.status(200).json({message:"Login Successfully",SignUp:existingUser});

  }
  catch(error){
    console.error('error during login',error);
    res.status(500).json({message:"Error During login"})
    res.status
  }
});

//Delete Api
app.delete('/api/delete/:id',async(req,res)=>{

  try{
  const{id}=req.params;
  //find user by id
  const deleteduser=await SignUp.findByIdAndDelete(id);
if(!deleteduser){
  return res.status(400).json({message:'User not found'});

}
res.status(200).json({message:'User deleted successfully',SignUp:deleteduser});
}

catch(error){
  console.error('error deleting user',error);
  res.status(500).json({message:'Error delleting user'});  
}

})


//geet api

app.get('/api/signup/active',async(req,res)=>{
  try{
    const activeusers=await SignUp.find({status:'active'});
    if (activeusers.length===0){
      return res.status(404).json({message:'No Active USers'});

    }
    res.status(200).json({SignUp:activeusers});
  }
  catch(error){
    console.error("getting error",error);
    res.status(500).json({message:'error'})
  }
})

//edit api 
app.put('/api/edit/:id',async(req,res)=>{
  try{
    const{id}=req.params;
    const updatedata=req.body;
    //find
    const updataUser=await SignUp.findByIdAndUpdate(id,updatedata,
      {new:true,runValidators:true}
    );
    if(!updataUser){
      return res.status(404).json({message:'yser not found'});
    }
    res.status(200).json({message:'user updated successfully',user:updataUser});

  }
  catch(error){
    console.error("error");
    res.status(500).json({message:'error during update'})
  }
})



app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});
