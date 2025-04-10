const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config();

const SECRET_KEY = process.env.secratekey;

const verifyToken = async (req, res, next) => {
    const token = req.headers.token || req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const vendor = await Vendor.findById(decoded.id);
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        req.id = vendor._id;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;
