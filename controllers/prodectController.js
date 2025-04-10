const Prodect = require('../models/Prodect');
const multer = require('multer');
const path = require('path'); // Fix missing import
const Firm = require('../models/Firm');
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

const upload = multer({ storage: storage });

const addProdect = async (req, res) => {
    try {
        console.log("Received Body:", req.body);
        console.log("Received File:", req.file);
        const { prodectName, price, category, bestSeller , description} = req.body;
        const image = req.file ? req.file.filename : null;
        
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
            }
        const prodect = new Prodect({
            prodectName, price, category, bestSeller , description, image, firm: firm._id
            });
            const savedProdect = await prodect.save();
            firm.prodects.push(savedProdect);

           
            await firm.save();
            res.json({ message: "Prodect added successfully", savedProdect });
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: "Error adding prodect" });
    }
}
const getProdectByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
            }   
            const restaurentName= firm.firmName;
            const prodects = await Prodect.find({firm:firmId});
            res.json({ restaurentName,prodects});
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: "Error getting prodects" });
            }
}

const deleteProdectById = async (req, res) => {
    try {
        const prodectId = req.params.prodectId;
        const prodect = await Prodect.findById(prodectId);
        if (!prodect) {
            return res.status(404).json({ message: "Prodect not found" });
            }
            await prodect.deleteOne(); // Corrected missing deletion step

            res.status(200).json({ message: "Prodect deleted successfully" });
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error deleting prodect" });
    }
}

module.exports = {addProdect: [ upload.single('image'), addProdect ] ,getProdectByFirm , deleteProdectById }; // Export the function with the middleware
