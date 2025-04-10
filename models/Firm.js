const mongoose = require('mongoose');
const Product = require('./Prodect');

const firmschema = new mongoose.Schema({
    firmName:{type:String,required: true , unique:true},
    firmAddress:{type:String,required: true },
    category:{
        type:[
            {
                type:String,
                enum : ['veg' , 'non-veg']
            }
        ]
    },
    region: {
        type: [
            {
                type: String,
                enum: ['north', 'south', 'chinese', 'backery']
                }
        ]
        },
    offer:{ type:String},
    image:{ type:String},
    vendor:[
        {
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Vendor',
        required: true,
        }
    ],
    prodects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prodect',
            required: true,
        }]
})
const Firm = mongoose.model('Firm', firmschema);
module.exports = Firm;
