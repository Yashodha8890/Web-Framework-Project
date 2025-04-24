const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

//const { default: mongoose } = require('mongoose');
const app = express();

require('dotenv').config();

const dbUIRI = 'mongodb+srv://'+process.env.DBUSERNAME+':'+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'+process.env.DB+'?retryWrites=true&w=majority&appName=Cluster0';

console.log(dbUIRI);

mongoose.connect(dbUIRI)
.then((result) =>
{
    console.log('Connected to DB');
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

//This is the folder which contains files like css, imgs
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));