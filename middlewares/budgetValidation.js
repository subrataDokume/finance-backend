const joi = require('joi');

const budgetValidation = (req,res,next) =>{
    const schema = joi.object({
        name:joi.string().min(3).max(50).required(),
        amount:joi.number().required(),
    });

    const {error} = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Invalid Data", error, success: false })
    };

    next();
};

module.exports = {budgetValidation}