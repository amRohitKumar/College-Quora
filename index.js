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
    useFindAndModify: true,
})
    .then(() => {
        console.log('MONGOOSE CONNECTION OPEN');
    })
    .catch((err) => {
        console.log('IN MONGOOSE SOMETHING WENT WRONG', err);
    })


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.get('/create', async(req,res) => {
//     const newQuestinon = await new Question({question: "this is third question ?"});
//     newQuestinon.save();
//     res.send("new question created !!");
// })

app.get('/collegeQuora', async (req, res) => {
    const questions = await Question.find({});
    res.render('questions/index', {questions});
})

app.get('/collegeQuora/:id', async (req, res) => {
    const ID = req.params.id;
    console.log(ID);
    const reqQuestion = await Question.findById(ID);
    // res.send(ID);
    res.render('questions/show', {reqQuestion});
})

app.listen(PORT, ()=> {
    console.log(`LISTENNG ON PORT ${PORT}`);
})