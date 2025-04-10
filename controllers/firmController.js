const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path'); // Fix missing import
const fs = require('fs');

// Ensure the uploads folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Multer configuration
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }); // Single file upload

const addFirm = async (req, res) => {
    try {
        const body = JSON.parse(JSON.stringify(req.body)); 
        console.log("Received Body:", req.body); // Debugging
        console.log("Received File:", req.file); // Debugging

        const { firmName, firmAddress, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!firmAddress) {
            return res.status(400).json({ message: "firmAddress is required" });
        }
        const existingFirm = await Firm.findOne({ firmName });
        if (existingFirm) {
            return res.status(400).json({ message: "Firm name already exists. Please use a different name." });
        }

        const vendor = await Vendor.findById(req.id); // Fix vendor ID reference
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        if (vendor.firm.length>0){
            return res.status(400).json({message: "Vendor already has a firm. vendor can only have one firm"})
        }

        const firm = new Firm({
            firmName,
            firmAddress,
            category,
            region,
            offer,
            image,
            vendor: [req.id] // Fix vendor ID reference
        });

        const savedFirm = await firm.save();
        const savedFirmId = savedFirm._id
        vendor.firm.push(savedFirm);
        await vendor.save();
        
        res.json({ message: "Firm added successfully", firmId: savedFirmId });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "Error adding firm" });
    }
};

const deleteFirmById = async( req, res) => {
    try {
        const firmId = req.params.firmId;
        const deleteFirm = await Firm.findById(firmId);
        if (!deleteFirm) {
            return res.status(404).json({ message: "firm not found" });
            }
            await deleteFirm.remove();
            res.json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error deleting firm" });
    }
}
module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById };
