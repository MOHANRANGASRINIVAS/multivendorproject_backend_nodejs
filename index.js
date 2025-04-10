const express = require('express');
const dotEnv= require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRouts = require('./routes/firmRouts');
const prodectRoutes = require('./routes/prodectRoutes');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(cors())
const PORT = process.env.PORT || 4000;

dotEnv.config();

mongoose.connect(process.env.monog_db)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.use(bodyParser.json())
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRouts);
app.use('/prodect',prodectRoutes);
app.use('/uploads', express.static(path.join(__dirname,'/uploads')));

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.use('/',(req,res)=>{
    res.send("home page");
    
})