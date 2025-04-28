const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const ActivityCategories = require('./models/ActivityCategories');
const UserRegistration = require('./models/UserRegistration');
const Activity = require('./models/Activity');
const ActivityTypes = require('./models/ActivityTypes');

require('dotenv').config();

const app = express();

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
app.get('/home',(req,res) => {
    res.render('home',{
        //title: "Add New Activity"
    });
});

// app.get('/activityview',(req,res) => {
//     res.render('activityview',{
//         title: "Test"

//     });
// });

//Save activity Categories
app.post('/saveCatergory', async(req,res) => {
    //console.log(req.body);
    try{
        const newActivityCategories = new ActivityCategories(req.body);
        await newActivityCategories.save();
        res.send('Added an Activity category');
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
        res.send('Added an Activity types');
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
        res.send('Added a new Activity!!');
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send('Error saving new activity!!')
    }   
});

//Save users
app.post('/users', async(req,res) => {
    try
    {
        const newUserRegistration = new UserRegistration(req.body)
        await newUserRegistration.save();
        //res.send('user registered!!');
        res.render('home')
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send('Error saving User!!')
    }    
})


// app.get('/activities', async (req,res) => {
//     //console.log("Fetched Activities:", activities);
//     try{
//         const activities = await Activity.find(); 
//         res.render('activityview', 
//             { 
//                 activities: activities.map(activity => activity.toJSON())
//             });
           
//         }      
//      catch (err) {
//                 console.error(err);
//                 res.status(500).send('Server Error'); // So browser gets some error message instead of hanging
//             }
// //     // } 
// //     // catch (error) {
// //     //     //console.error('Error fetching activities:', error);
// //     //     res.status(500).send('Server error');
// //     // }
// })


//Get All Activities
// GET all activities
app.get('/ActivityTracker', async (req, res) => {
    //console.log("Fetched Activities:", activities);
    try 
    {
        const activities = await Activity.find(); 
        res.render('ActivityTracker', 
            { 
                activities : activities.map(activities => activities.toJSON())
            });

    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).send('Server error');
    }
});

/* app.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.find().lean(); // Fetch data as plain JS objects
        console.log("Fetched Activities:", activities); // Check if activities are correctly fetched
        res.render('activityTracker', { activities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).send('Server error');
    }
}); */

/* 
//API get all activities
app.get('/activities', async (req, res) => {
    try {
        const result = await Activity.find(); 
       // res.json(result);
       res.render('activityTracker', { activities });
    } catch (error) {
       //console.log(error);
       console.error('Error fetching activities:', error);
        res.status(500).send('Server error');
    }
}); */