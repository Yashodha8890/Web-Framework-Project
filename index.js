const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
//Existed in the main branch
const session = require('express-session');
const ActivityCategories = require('./models/ActivityCategories');
const UserRegistration = require('./models/UserRegistration');
const Activity = require('./models/Activity');
const ActivityTypes = require('./models/ActivityTypes');
const sendEmail = require('./utils/mailer');
const cron = require('node-cron');
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
    defaultLayout: 'main',
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      },
      eq: function (a, b) {
        return a === b;
      }
    }
  });
app.engine('handlebars', handlebars.engine);

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
    try{
        if (!req.session.user) {
            return res.status(400).send('User not logged in');
        }
        //const newActivity = new Activity(req.body);
        const newActivity = new Activity({
            activityName: req.body.activityName,
            activityDescription: req.body.activityDescription,
            ActivityPlannedDate: req.body.ActivityPlannedDate,
            ActivityStartTime: req.body.ActivityStartTime,
            ActivityEndTime: req.body.ActivityEndTime,
            activityStatus: "Pending",  // You can change this if needed
            activityCatergory: req.body.activityCatergory,
            activityType: req.body.activityType,
            activityPriority: req.body.activityPriority,
            userId: req.session.user._id,  // Using the session's userId
          });
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
                ActivityPlannedDateFormatted: date.toDateString() 
            };
        });
        res.render('activity', {
            title: 'Activity List',
            activities: formattedActivities,
            user: req.session.user
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
        res.redirect('/activity');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting activity.');
    }
});

// updateActivity.handlebars - Fill the form with selected Avtivity data
app.get('/updateActivity/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id).lean();
        if (!activity) return res.status(404).send('Activity not found');

        // Format the date
        const date = new Date(activity.ActivityPlannedDate);
        activity.ActivityPlannedDateFormatted = date.toISOString().split('T')[0];

        res.render('updateActivity', {
            title: 'Update Activity',
            activity
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading activity for update.');
    }
});

// updateActivity.handlebars - Update Avtivity
app.post('/updateActivity/:id', async (req, res) => {
    try {
        await Activity.findByIdAndUpdate(req.params.id, {
            activityName: req.body.activityName,
            activityDescription: req.body.activityDescription,
            ActivityPlannedDate: req.body.ActivityPlannedDate,
            ActivityStartTime: req.body.ActivityStartTime,
            ActivityEndTime: req.body.ActivityEndTime,
            activityStatus: req.body.activityStatus,
            activityCatergory: req.body.activityCatergory,
            activityType: req.body.activityType,
            activityPriority: req.body.activityPriority
        });
        res.redirect('/activity');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating activity.');
    }
});

//Loading data to dashboard table according to the filters
app.get('/activityDashboard', async (req, res) => {
    try {
      // Get filters from query string
      const { status, date } = req.query;
  
      // Build dynamic query object
      const query = {};
      if (status && status !== 'All') {
        query.activityStatus = status;
      }
      if (date) {
        const selectedDate = new Date(date);
        selectedDate.setUTCHours(0, 0, 0, 0);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        query.ActivityPlannedDate = {
          $gte: selectedDate,
          $lt: nextDate
        };
      }
  
      // Fetch filtered data
      const activities = await Activity.find(query).lean();
  
      // Format date for display
      const formattedActivities = activities.map(activity => ({
        ...activity,
        ActivityPlannedDateFormatted: new Date(activity.ActivityPlannedDate).toDateString()
      }));
  
      // Status count + percentage
      const possibleStatuses = ['Pending', 'InProgress', 'Completed', 'Cancelled', 'Postponed', 'Abandoned'];
      const statusCounts = {};
      possibleStatuses.forEach(status => statusCounts[status] = 0);
  
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
  
      // Send everything to the view
      res.render('activityDashboard', {
        title: 'Activity Dashboard',
        activities: formattedActivities,
        statusCounts,
        statusPercentages,
        possibleStatuses,
        statusCountsJSON: JSON.stringify(statusCounts),
        statusPercentagesJSON: JSON.stringify(statusPercentages),
        filters: {
            status: status || 'All',
            date: date || ''
          }
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

//Send email for expired activity
 // cron.schedule('0 0 * * *', async () => { //job is running everyday at midnight
    cron.schedule('*/1 * * * *', async () => { //job is running every 1 minute. added for the testing purpose
    console.log('Running daily cron job to check expired activities...');
    const now = new Date();
  
    try {
        // Find activities with planned date earlier than the current date and email not sent
      const expiredActivities = await Activity.find({
        ActivityPlannedDate: { $lt: now },
        emailSent: false,
      });
  
      for (const activity of expiredActivities) {
        if (!activity.userId) 
        {
            console.log(`❌ No userId found for activity ${activity._id}`);
            continue; // Skip this activity if no userId is found
        }

        // Fetch the user details from the User model based on userId
        const user = await UserRegistration.findById(activity.userId);

        if (!user || !user.email) 
        {
            console.log(`❌ No email found for user ${activity.userId}`);
            continue; // Skip if the user does not have an email
        }

      const userEmail = user.email; // Assuming the User model has an 'email' field

        const emailBody = `
          <h2>Hello !</h2>
          <p>This is a reminder that the following activity has expired:</p>
          <ul>
            <li><strong>Title:</strong> ${activity.activityName}</li>
            <li><strong>Description:</strong> ${activity.activityDescription}</li>
            <li><strong>Planned Date:</strong> ${new Date(activity.ActivityPlannedDate).toDateString()}</li>
            <li><strong>Start Time:</strong> ${activity.ActivityStartTime}</li>
            <li><strong>End Time:</strong> ${activity.ActivityEndTime}</li>
            <li><strong>Status:</strong> ${activity.activityStatus}</li>
          </ul>
          <p>Please update your dashboard if this was completed or postponed.</p>
          <p>Regards,<br>Your Daily Routing Tracker Team!!!</p>
        `;        
            try {
                // Send the email
                await sendEmail(userEmail, 'Your Activity Has Expired', emailBody);
                console.log(`✅ Email sent for activity: ${activity._id}`);

                // Mark the activity as having an email sent
                activity.emailSent = true;

                // Ensure the `activity` is saved after updating the emailSent flag
                await activity.save();
                console.log(`✅ Activity ${activity._id} updated with emailSent: true`);
            }             
            catch (err) 
            {
                console.error(`❌ Error sending email for activity ${activity._id}:`, err);
            }
        }
            console.log(`✅ Emails sent for ${expiredActivities.length} expired activities.`);
            } catch (err) {
                console.error('❌ Error checking expired activities:', err);
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
        res.redirect('login')
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