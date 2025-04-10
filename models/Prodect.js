const mongoose = require('mongoose');

const prodectSchema =  new mongoose.Schema({
    prodectName : { type:String,required:true},
    price : {type:String,required:true},
    category : {
        type: [{
            type: String,
            enum : ['veg' , 'non-veg']
        }]
    },
    image : {type:String},
    bestSeller: {type:Boolean},
    description : {type:String},
    firm : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true,
    }]

});
const Prodect = mongoose.model('Prodect', prodectSchema);
module.exports = Prodect;