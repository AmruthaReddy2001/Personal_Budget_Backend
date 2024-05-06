const express = require('express');
const router = express.Router();
const model = require("../Model/budgetModel");
const userModel = require("../Model/userModel");

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.body.username });
        if (user) {
            const budgetEntry = new model(req.body);
            const entry = await budgetEntry.save();
            res.status(200).json({ "status": "Successfully added new Budget Category" });
        } else {
            res.status(400).json({ "error": "Invalid username" });
        }
    } catch (error) {
        console.error("Error adding data:", error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Validation Error', details: error.errors });
        } else {
            res.status(500).json({ error: 'Server Error' });
        }
    }
});

router.get('/:username', async (req, res) => {
    try {
        const data = await model.find({ username: req.params.username });
        res.json(data);
    } catch (error) {
        console.error("Error fetching Data:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
