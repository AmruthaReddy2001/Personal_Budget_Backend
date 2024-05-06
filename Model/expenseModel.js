// budgetModel.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    username: {type: String, require: true},
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: Number, required: true, match: /^#[0-12]$/}
});

module.exports = mongoose.model('Expense', expenseSchema);
