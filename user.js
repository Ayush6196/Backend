const express =require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');

const app=express();
app.use(bodyParser.json());

const mongoURI='mongodb://localhost:27017/Company';
mongoose.connect(mongoURI)
.then(()=>console.log("connected successfully"))
.catch(error=>console.log(error));

//schema 
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
});
//collection
const UserSignup =mongoose.model('UserSignup',userSchema);

app.post('/api/signup',async(req,res)=>{
    try{
        const {name,email,password,status}=req.body;
        if(!name||!email||!password||!status){
            return res.status(400).json({message:"All fields are reqquired"});

        }
        const newUser =new UserSignup({
            name,
            email,
            password,
            status
        });
        await newUser.save();
        res.status(201).json({message:"Signup Successfully",UserSignup:newUser});

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"something went wrong"});

    }
});
app.get('/api/signup/active',async(req,res)=>{
    try{
      const activeusers=await UserSignup.find({status:'active'});
      if (activeusers.length===0){
        return res.status(404).json({message:'No Active USers'});
  
      }
      res.status(200).json({UserSignup:activeusers});
    }
    catch(error){
      console.error("getting error",error);
      res.status(500).json({message:'error'})
    }
  })
app.get('/api/signup/inactive',async(req,res)=>{
    try{
      const inactiveusers=await UserSignup.find({status:'inactive'});
      if (inactiveusers.length===0){
        return res.status(404).json({message:'No Inactive USers'});
  
      }
      res.status(200).json({UserSignup:inactiveusers});
    }
    catch(error){
      console.error("getting error",error);
      res.status(500).json({message:'error'})
    }
  })
  //Delete Api
app.delete('/api/delete/:id',async(req,res)=>{

    try{
    const{id}=req.params;
    //find user by id
    const deleteduser=await UserSignup.findByIdAndDelete(id);
  if(!deleteduser){
    return res.status(400).json({message:'User not found'});
  
  }
  res.status(200).json({message:'User deleted successfully',UserSignup:deleteduser});
  }
  
  catch(error){
    console.error('error deleting user',error);
    res.status(500).json({message:'Error delleting user'});  
  }
  
  })
  app.put('/api/edit/:id',async(req,res)=>{
    try{
      const{id}=req.params;
      const updatedata=req.body;
      //find
      const updateUser=await UserSignup.findByIdAndUpdate(id,updatedata,
        {new:true,runValidators:true}
      );
      if(!updateUser){
        return res.status(404).json({message:'yser not found'});
      }
      res.status(200).json({message:'user updated successfully',user:updateUser});
  
    }
    catch(error){
      console.error("error");
      res.status(500).json({message:'error during update'})
    }
  })
  


app.listen(3000,()=>{
    console.log(`server is running at port 3000`);
    
});


