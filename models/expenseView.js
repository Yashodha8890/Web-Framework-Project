const express = require('express');
const router = express.Router();
const Expense = require('./expense');  

router.get('/viewExpenses', async (req, res) => {
  try {
    const expenses = await Expense.find(); 
    res.render('viewExpenses', { expenses: expenses });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;