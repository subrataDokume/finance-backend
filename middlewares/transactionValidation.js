const joi = require('joi');

const transationValidation = (req,res,next) =>{
    const schema = joi.object({
        description:joi.string().min(10).max(50).required(),
        amount:joi.number().required(),
        type: joi.string().required(),
        category: joi.string().required(),
        date: joi.date().required(),
    });

    const {error} = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Invalid Data", error, success: false })
    };

    next();
};

module.exports = {transationValidation}