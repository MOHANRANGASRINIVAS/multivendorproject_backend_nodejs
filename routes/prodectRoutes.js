const express = require('express');
const prodectController = require('../controllers/prodectController');
const router = express.Router();
router.post('/add-prodect/:firmId', prodectController.addProdect);
router.get('/:firmId/prodects', prodectController.getProdectByFirm);
router.get('/uploads/:imageName',(req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg');
    res.sendFile( path.join(__dirname, '../uploads', imageName) );

});
router.delete('/:prodectId', prodectController.deleteProdectById);
module.exports = router;