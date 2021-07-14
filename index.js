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



// app.get('/create', async(req,res) => {
//     const newQuestinon = await new Question({question: "this is third question ?"});
//     newQuestinon.save();
//     res.send("new question created !!");
// })

app.get('/collegeQuora', async (req, res) => {
    const questions = await Question.find({});
    res.render('questions/index', {questions});
})

app.get('/collegeQuora/new', (req, res) => {
    res.render('questions/new');
})

app.post('/collegeQuora/new', async(req, res) => {
    const question = req.body.question
    // res.send(question.question);
    const newQuestion = new Question({question: question.question});
    await newQuestion.save();
    res.redirect(`/collegeQuora/${newQuestion._id}`);
})

app.get('/collegeQuora/:id', async (req, res) => {
    const ID = req.params.id;
    // console.log(ID);
    const reqQuestion = await Question.findById(ID);
    // res.send(ID);
    res.render('questions/show', {reqQuestion});
})

app.get('/collegeQuora/:id/edit', async (req, res) => {
    const reqQuestion = await Question.findById(req.params.id);
    res.render('questions/edit', {reqQuestion});
})

app.put('/collegeQuora/:id/edit', async (req, res) => {
    const newQuestion = req.body.question.question;
    // console.log(newQuestion);
    const ID = req.params.id;
    const updatedQuestion = await Question.findByIdAndUpdate(ID, {question: newQuestion});
    res.redirect(`/collegeQuora/${ID}`);
    // res.send('you got me');
})

app.delete('/collegeQuora/:id', async (req, res) => {
    const ID = req.params.id;
    await Question.findByIdAndDelete(ID);
    res.redirect('/collegeQuora');
})

app.listen(PORT, ()=> {
    console.log(`LISTENNG ON PORT ${PORT}`);
})