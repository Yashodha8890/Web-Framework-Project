

const mongoose = require('mongoose');

// Define the Expense schema
const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'], // options from your form
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    // date: {
    //     type: Date,
    //     default: Date.now
    //},
    receipt: {
        type: String // For storing file path or file URL if you handle uploads
    },
    
});

// Create the Expense model
module.exports = mongoose.model("DailyExpenses", expenseSchema);


