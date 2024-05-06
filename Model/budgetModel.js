// budgetModel.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    username: {type: String, require: true},
    title: { type: String, required: true },
    budget: { type: Number, required: true },
    color: { type: String, required: true, match: /^#[0-9A-Fa-f]{6}$/ }
});

module.exports = mongoose.model('Budget', budgetSchema);
