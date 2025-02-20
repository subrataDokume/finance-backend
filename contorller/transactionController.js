const transactionModel = require('../models/transactionModel');

exports.getAllTrunsaction = async (req, res) => {
    try {
        const allTrunsaction = await transactionModel.find({user:req.user._id});
        res.status(200).json({ message: allTrunsaction, success: true })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
};

exports.createTrunsaction = async (req, res) => {
    try {
        const { description, amount, type, date, category } = req.body;
        const newTrunsaction = await transactionModel.create({ description, amount, type, date, category, user: req.user._id });
        res.status(201).json({ message: newTrunsaction, success: true })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error:error,
            success: false
        })
    }
};

exports.getTrunsaction = async (req, res) => {
    try {
        let data = await transactionModel.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'transaction not found', success: false })
        };
        res.status(200).json({ message: data, success: true })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

exports.updateTrunsaction = async (req, res) => {
    try {
        let data = await transactionModel.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'transaction not found', success: false })
        };
        const { description, amount, type, date, category } = req.body;
        
        let newData = await transactionModel.findByIdAndUpdate(data._id, { description, amount, type, date, category }, {
            new: true,
            runValidators: true
        })
        res.status(200).json({ message: newData, success: true })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}
exports.deleteTrunsaction = async (req, res) => {
    try {
        let data = await transactionModel.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'transaction not found', success: false })
        };
        await transactionModel.findByIdAndDelete(data._id);
        res.status(200).json({ message: null, success: true });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}