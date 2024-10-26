const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017/Student';
mongoose.connect(mongoURI)
    .then(() => console.log("connected Successfully"))
    .catch(error => console.log(error));

const studentRegisterSchema = new mongoose.Schema({
    mobile_number: {
        type: String,
        required: true
    },
    student_name: {
        type: String,
        required: true
    },
    training: {
        type: String,
        required: true
    },
    technology: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    Father_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    alternate_number: {
        type: String
    },
    college_name: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    }


});

const Registration = mongoose.model('Registration', studentRegisterSchema);

app.post('/api/registration', async (req, res) => {
    try {
        const { mobile_number, student_name, training, technology, education, year, Father_name, email, alternate_number,college_name,payment }=req.body;
        if (!mobile_number || !student_name || !training || !technology || !education || !year || !Father_name || !email || !alternate_number||!college_name,!payment) {
            return res.status(400).json({ message: "All Feilds are required" })

        }
        const newRegistration = new Registration({
            mobile_number,
            student_name,
            training,
            technology,
            education,
            year,
            Father_name,
            email,
            alternate_number,
            college_name,
            payment


        });
        await newRegistration.save();
        res.status(201).json({message:"Registered Succesfully",Registration:newRegistration});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"something went wrong"});
    }
});

//get api
app.get('/api/registration/get',async(req,res)=>{
    
})

app.listen(3001, () => {
    console.log(`Server is running at port 3001`);
});
