const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
//Existed in the main branch
const session = require('express-session');
const ActivityCategories = require('./models/ActivityCategories');
const UserRegistration = require('./models/UserRegistration');
const Activity = require('./models/Activity');
const ActivityTypes = require('./models/ActivityTypes');
//added from Shammi's branch
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
require('dotenv').config();



//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//this code says that defaults settings we are using the main.handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));


//This is to indicate we use handlebars further
app.set('view engine', 'handlebars');

//This is the folder which contains files like css, imgs
app.use(express.static('public'));

//session
app.use(session({
    secret: 'your-secret-key',  // A secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

// Define the custom helper to convert objects to JSON
const handlebars = exphbs.create({
    helpers: {
      json: function(context) {
        return JSON.stringify(context);
      }
    }
  });

//Routes
//index.handlebars
app.get('/',(req,res) => {
    res.render('index');
});

//userRegistration.handlebars
app.get('/userRegistration',(req,res) => {
    res.render('userRegistration',{
        title: "Register New User"
    });
});

//Activity.handlebars
app.get('/activityTracker',(req,res) => {
    res.render('activityTracker',{
        title: "Add New Activity"
    });
});

//Home.handlebars
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

//Login.handlebars
app.get('/login',(req,res) => {
    res.render('login',{
    });
});

//UpdateActivity.handlebars
app.get('/updateActivity',(req,res) => {
    res.render('updateActivity',{
    });
});

//Merged from Shammi's branch
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
//Shammi's branch changes are finished here


//Activty Tracker codes
//Save activity Categories
app.post('/saveCatergory', async(req,res) => {
    try{
        const newActivityCategories = new ActivityCategories(req.body);
        await newActivityCategories.save();
        //res.send('Added an Activity category');
        res.redirect('activity');
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send('Error saving User!!')
    }    
});

//Save activity types
app.post('/saveActivityType', async(req,res) => {
    try{
        const newActivityTypes = new ActivityTypes(req.body);
        await newActivityTypes.save();
       // res.send('Added an Activity types');
        res.redirect('activity');
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send('Error saving Activity types!!')
    }    
});

//Save Activity
 app.post('/saveActivity', async(req,res) => {
    //console.log(req.body);
    try{
        const newActivity = new Activity(req.body);
        await newActivity.save();
        //res.send('Added a new Activity!!');
        res.redirect('activity');
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send('Error saving new activity!!')
    }   
});

//Retriew all activities
app.get('/activity', async (req, res) => {
    try {
        const activities = await Activity.find().lean();
        // Format each planned date to "Tue Oct 10 2000"
        const formattedActivities = activities.map(activity => {
            const date = new Date(activity.ActivityPlannedDate);
            return {
                ...activity,
                ActivityPlannedDateFormatted: date.toDateString() // returns "Tue Oct 10 2000"
            };
        });
        res.render('activity', {
            title: 'Activity List',
            activities: formattedActivities
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load activities.');
    }
});

//Delete an activity
app.post('/deleteActivity/:id', async (req, res) => {
    try {
        await Activity.findByIdAndDelete(req.params.id);
        res.redirect('activity');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting activity.');
    }
});

//Registration/Login/Logout Related codes
//Save users
app.post('/users', async(req,res) => {
    try
    {
        const newUserRegistration = new UserRegistration(req.body)
        await newUserRegistration.save();
        //res.send('user registered!!');
        res.render('login')
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send('Error saving User!!')
    }    
})

//get specific user
app.get('/api/users/:id', async(req,res) =>{
    const id = req.params.id;
    const users = await UserRegistration.findById(id);
    res.json(users);
})

//Login
app.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    
    try {
        const user = await UserRegistration.findOne({ userName });
        
        if (user && user.password === password) {
            req.session.user = user;  // Save user data to session
            res.redirect('/home');  // Redirect to homepage
        } else {
            res.render('login', { 
                error: 'Invalid credentials' // Show an error message
            });
        }
    } catch (error) {
        console.error(error);
        res.render('login', { 
            error: 'Something went wrong' 
        });
    }
});

//Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');  // Optional: to clear the session cookie
        res.redirect('/');  // Redirect to homepage after logout
    });
});


//Render activity Dashboard
/* app.get('/activityDashboard', async (req, res) => {
    try {
      const activities = await Activity.find().lean();
  
      const formattedActivities = activities.map(activity => {
        const date = new Date(activity.ActivityPlannedDate);
        return {
          ...activity,
          ActivityPlannedDateFormatted: date.toDateString()
        };
      });
  
      // Count activity statuses
      const statusCounts = {
        pending: 0,
        inProgress: 0,
        completed: 0,
        abandoned: 0,
        postponed: 0
      };
  
      activities.forEach(activity => {
        const status = activity.activityStatus?.toLowerCase().replace(/\s/g, '');
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });
  
      const totalActivities = activities.length;
      const statusPercentages = {};
      for (const key in statusCounts) {
        statusPercentages[key] = totalActivities > 0
          ? Math.round((statusCounts[key] / totalActivities) * 100)
          : 0;
      }
  
      res.render('activityDashboard', {
        title: 'Activity Dashboard',
        activities: formattedActivities,
        statusCounts,
        statusPercentages
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load dashboard.');
    }
  }); */

  app.get('/activityDashboard', async (req, res) => {
    try {
      const activities = await Activity.find().lean();
  
      const formattedActivities = activities.map(activity => {
        const date = new Date(activity.ActivityPlannedDate);
        return {
          ...activity,
          ActivityPlannedDateFormatted: date.toDateString()
        };
      });
  
      // Updated possibleStatuses to match DB format (no spaces)
      const possibleStatuses = ['Pending', 'InProgress', 'Completed', 'Cancelled', 'Postponed', 'Abandoned'];
  
      const statusCounts = {};
      possibleStatuses.forEach(status => {
        statusCounts[status] = 0;
      });
  
      activities.forEach(activity => {
        const status = activity.activityStatus?.trim();
        if (status && statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });
  
      const totalActivities = activities.length;
      const statusPercentages = {};
      for (const status in statusCounts) {
        statusPercentages[status] = totalActivities > 0
          ? Math.round((statusCounts[status] / totalActivities) * 100)
          : 0;
      }
  
      res.render('activityDashboard', {
        title: 'Activity Dashboard',
        activities: formattedActivities,
        statusCounts,
        statusPercentages,
        possibleStatuses,
        statusCountsJSON: JSON.stringify(statusCounts),
        statusPercentagesJSON: JSON.stringify(statusPercentages)
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load dashboard.');
    }
  });
  
  
  
  
  

//Update activity status
app.post('/updateActivityStatus/:id', async (req, res) => {
    try {
        await Activity.findByIdAndUpdate(req.params.id, {
            activityStatus: req.body.status
        });
        res.redirect('/activityDashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update activity status.');
    }
});





