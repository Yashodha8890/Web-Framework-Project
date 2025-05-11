

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

    
    dueDate: {
        type: Date,
        required: true
    },

    paidDate: {
        type: Date,
        required: false
    },

    status: {
        type: String,
        enum: ['Planned', 'Due', 'Paid',  'Overdue', 'Cancelled'],
        default: 'Planned'
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
    
    receipt: {
        type: String // For storing file path or file URL if you handle uploads
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },

      emailSent: {
        type: Boolean,
        default: false
      }
    
});

// Create the Expense model
module.exports = mongoose.model("DailyExpenses", expenseSchema);


