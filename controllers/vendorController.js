const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv')
dotEnv.config();

const SECRET_KEY = process.env.secratekey;


const vendorRegister = async (req, res) => {
    try {
        const { name, email, password, } = req.body;
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ msg: "Vendor already exists with this email" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            name,
            email,
            password : hashedPassword
        });
        
        await newVendor.save();
        res.status(201).json({message : "Vendor created successfully" });
        console.log('registered')
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error in registering vendor" });
    }
}

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
try { 
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
        return res.status(401).json({ msg: "Vendor not found" });
    }
    const token = jwt.sign({ id: vendor._id }, SECRET_KEY,{expiresIn: '1h'});

    const vendorId = vendor._id;

   

        res.status(200).json({success : true,message:" login sucess" , token, vendorId });
        console.log(email , "this is token",token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error in logging in vendor" });
        }
    }

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.status(200).json({vendors});
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error in getting all vendors" });
            }
    }

const getVendorById = async (req, res) => {
    const Id = req.params.id;
    try {
        const vendor = await Vendor.findById(Id).populate('firm');
        if (!vendor) {
            return res.status(404).json({ msg: "Vendor not found" });
            }
            const vendorFirmId = vendor.firm[0]._id;
            res.status(201).json({vendor , vendorFirmId});
            console.log(vendorFirmId);
            } catch (error) {
                console.error(error);
                res.status(500).json({ msg: "Error in getting vendor by id" });
                }
    }
           

module.exports = { vendorRegister, vendorLogin , getAllVendors, getVendorById };

