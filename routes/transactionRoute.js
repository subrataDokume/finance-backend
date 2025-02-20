const express = require('express');
const authController = require('../contorller/authConterller');
const transaction = require('../contorller/transactionController');
const { transationValidation } = require('../middlewares/transactionValidation');
const router = express.Router();


router
    .route('/')
    .get(authController.protect, transaction.getAllTrunsaction)
    .post(
        transationValidation,
        authController.protect,
        transaction.createTrunsaction
    );

router
    .route('/:id')
    .get(authController.protect,transaction.getTrunsaction)
    .patch(
        transationValidation,
        authController.protect,
        transaction.updateTrunsaction
    )
    .delete(
        authController.protect,
        transaction.deleteTrunsaction
    );

module.exports = router;