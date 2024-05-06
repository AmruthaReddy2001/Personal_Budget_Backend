const express = require('express');
const router = express.Router();

const model = require("../Model/expenseModel");
const userModel = require("../Model/userModel");

router.get('/:username', async (req, res) => {
    try {
        const response = await model.find({ username: req.params.username });
        res.json(response);
    } catch (error) {
        console.error("Error in fetching the Data:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/:username/:month', async (req, res) => {
    try {
        const response = await model.find({ username: req.params.username, month: req.params.month });
        res.json(response);
    } catch (error) {
        console.error("Error in fetching the Data:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.body.username });
        if (user) {
            const expense = await model.findOne({
                username: req.body.username,
                category: req.body.category,
                month: req.body.month
            });

            if (expense) {
                expense.amount += parseInt(req.body.amount);
                await expense.save();
                res.status(200).json({ "status": "Successfully updated existing Expense" });
            } else {
                const newExpense = new model(req.body);
                await newExpense.save();
                res.status(200).json({ "status": "Successfully added new Expense" });
            }
        } else {
            res.status(400).json({ "error": "Invalid username" });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Validation Error', details: error.errors });
        } else {
            res.status(500).json({ error: 'Server Error' });
        }
    }
});

module.exports = router;
