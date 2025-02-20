const { default: mongoose } = require('mongoose');
const budgetModel = require('../models/budgetModel');
const transactionModel = require('../models/transactionModel');

exports.getAllBudget = async (req, res) => {
    try {
        const allBudget = await budgetModel.find({ user: req.user._id });
        res.status(200).json({ message: allBudget, success: true })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
};

exports.createBudget= async (req, res) => {
    try {
        const { name, amount, } = req.body;
        const newBudget = await budgetModel.create({ amount,name, user: req.user._id });
        res.status(201).json({ message: newBudget, success: true })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error,
            success: false
        })
    }
};

exports.getBudget = async (req, res) => {
    try {
        let data = await budgetModel.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'budget not found', success: false })
        };
        res.status(200).json({ message: data, success: true })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

exports.updateBudget = async (req, res) => {
    try {
        let data = await budgetModel.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Budget not found', success: false })
        };
        const { name ,amount } = req.body;

        let newData = await budgetModel.findByIdAndUpdate(data._id, { name, amount }, {
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
exports.deleteBudget = async (req, res) => {
    try {
        let data = await budgetModel.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Budget not found', success: false })
        };
        await budgetModel.findByIdAndDelete(data._id);
        res.status(200).json({ message: null, success: true });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

exports.budgetAlert = async (req, res) => {
    try {
        const budgets = await budgetModel.find({ user: req.user._id });
        
        const alerts = [];
        for (let budget of budgets) {
            const totalSpent = await transactionModel.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(req.user._id), category:new mongoose.Types.ObjectId(budget._id) } },
                { $group: { _id: '$category', total: { $sum: '$amount' } } }
            ]);
                alerts.push({
                    totalSpent: totalSpent,
                    name: budget.name,
                    budgetAmount:budget.amount,
                });
        }
        res.status(200).json(alerts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}