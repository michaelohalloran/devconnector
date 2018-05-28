const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();


//bodyParser mw
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROUTES
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');



//Passport middleware
app.use(passport.initialize());
//Passport config
require('./config/passport')(passport);

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);




//DB Config
const db = require('./config/keys').mongoURI;

//connect to Mongoose
mongoose
    .connect(db)
    .then(()=> console.log('MongoDB connected'))
    .catch((err)=>console.log(err));

app.get('/', (req, res)=> {
    res.send('Hi');
});

const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`server running on port ${port}`);
});