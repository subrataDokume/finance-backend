const express = require('express');
const authController = require('../contorller/authConterller');
const budgetController = require('../contorller/budgetController');
const { budgetValidation } = require('../middlewares/budgetValidation');
const router = express.Router();

router.get('/budget-alerts', authController.protect , budgetController.budgetAlert)
router
    .route('/')
    .get(authController.protect, budgetController.getAllBudget)
    .post(
        budgetValidation,
        authController.protect,
        budgetController.createBudget
    );

router
    .route('/:id')
    .get(authController.protect, budgetController.getBudget)
    .patch(
        budgetValidation,
        authController.protect,
        budgetController.updateBudget
    )
    .delete(
        authController.protect,
        budgetController.deleteBudget
    );

module.exports = router;