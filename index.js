const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const viewExpense = require('./models/expenseView');
const Expense = require('./models/expense');

//const { default: mongoose } = require('mongoose');
const app = express();

require('dotenv').config();

//Setting up the Database connection
const dbUIRI = 'mongodb+srv://'+process.env.DBUSERNAME+':'+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'+process.env.DB+'?retryWrites=true&w=majority&appName=Cluster0';

console.log(dbUIRI);

mongoose.connect(dbUIRI)
    .then((result) =>
    {
        console.log('Connected to DB');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`App listening on port `+ PORT));
    })
    .catch((err)=>
    {
        console.log(err);
    })


//this code says that defaults settings we are using the main.handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

//This is to indicate we use handlebars further
app.set('view engine', 'handlebars');

//Route to index.handlebars file
app.get('/',(req,res) => {
    res.render('index');
});

//Route to Activity.handlebars file
app.get('/activityTracker',(req,res) => {
    res.render('activityTracker',{
        title: "Add New Activity"
    });
});

//expense.handlebars
app.get('/addExpense',(req,res) => {
    res.render('addExpense',{
        title: "Add New expense"
    });
});

//add expense date to database
app.post('/addExpense', async(req,res) => {
    try
    {
        const newExpenses = new Expense(req.body)
        await newExpenses.save();
        res.send('added expense!!');
    }

    catch(err)
    {
        console.log(err);
        res.status(500).send('Error expense add!!')
    }
    
})
//get all expenses from MongoDB and print to the webpage
app.get('/viewExpense', async (req, res) => {
    try {
      const expenses  = await Expense.find().lean();
      res.render('viewExpense', 
        {
        title: 'Daily Expenses',
        expenses: expenses
        }
    )
    } 
    catch (error) 
        {
            console.error('Error fetching expenses:', error);
            res.status(500).send('Internal Server Error');
        }
  });

  // get Update expense data
app.get('/updateExpense/:id', async (req, res) => {
    try {
      const expense = await Expense.findById(req.params.id).lean();
      if (!expense) return res.status(404).send('Expense not found');
      res.render('updateExpense', { expense });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });

  //  update the expenses in view page
app.post('/updateExpense/:id', async (req, res) => {
    try {
      await Expense.findByIdAndUpdate(req.params.id, {
        amount: req.body.amount,
        category: req.body.category,
        paymentMethod: req.body.paymentMethod,
        date: req.body.date,
        notes: req.body.notes
      });
      res.redirect('/viewExpense');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to update expense');
    }
  });

  // DELETE Expenses by ID 
app.post('/deleteExpense/:id', async (req, res) => {
    try {
      await Expense.findByIdAndDelete(req.params.id).lean();
      res.redirect('/viewExpense'); 
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).send('Failed to delete expense');
    }
  });

//This is the folder which contains files like css, imgs
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));