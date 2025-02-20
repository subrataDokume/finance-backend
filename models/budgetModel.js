const mongoose = require('mongoose');
const budgetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us budget name!']
    },
    amount: {
        type: Number,
        required: [true, 'Please tell us budget amount!']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
