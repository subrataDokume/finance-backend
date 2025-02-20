const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    amount:{
        type:Number,
        required: [true, 'Please provied amount']
    },
    type:{
        type:String,
        enum:['expense','income'],
        required:[true, 'please provied a type']
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref:'Budget',
    },
    date:{
        type:Date,
        required:[true,'Please provied a date'],
        default: new Date()
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});

const User = mongoose.model('Transaction', transactionSchema);

module.exports = User;
