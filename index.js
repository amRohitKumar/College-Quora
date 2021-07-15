const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const localStrategy = require('passport-local');
const flash = require('connect-flash');
const session = require('express-session');
const Question = require('./models/questions');

const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {questionSchema, answerSchema} = require('./JOImodels/schema');
const Answer = require('./models/answers');

const question = require('./routes/question');
const answer = require('./routes/answer');




const PORT = 8080;


mongoose.connect('mongodb://localhost:27017/collegeQuora', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(() => {
        console.log('MONGOOSE CONNECTION OPEN');
    })
    .catch((err) => {
        console.log('IN MONGOOSE SOMETHING WENT WRONG', err);
    })
 


app.engine('ejs', ejsMate); // for ejs-mate 
app.set('view engine', 'ejs'); // setting up view engine
app.set('views', path.join(__dirname, 'views')); // setting up the views dir
app.use(express.urlencoded({extended: true})) // to parse the req.post body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); //serving public directory

const sessionConfig = {
    secret: 'badsecret',
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7,
        httpOnly: true,
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    console.log(req.flash('success'));
    res.locals.error = req.flash('error');
    next();
})


app.use('/collegeQuora', question);
app.use('/collegeQuora', answer);
























app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found !", 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render('error', {err});
    res.send();
})

app.listen(PORT, ()=> {
    console.log(`LISTENNG ON PORT ${PORT}`);
})