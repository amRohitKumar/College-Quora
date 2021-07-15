const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Question = require('../models/questions');
const ExpressError = require('../utils/ExpressError');
const {validateQuestion, questionDeleteMiddleware, validateAnswer} = require('../utils/middleware');
const {DateAndMonth} = require('../utils/helperFunction');

router.get('/', catchAsync( async (req, res) => {
    const questions = await Question.find({});
    res.render('questions/index', {questions});
}))

router.get('/new', (req, res) => {
    res.render('questions/new');
})

router.post('/new', validateQuestion, catchAsync( async(req, res, next) => {
    
    const question = req.body.question
    const currentDate = DateAndMonth();
    const newQuestion = new Question({question: question.question, date: currentDate});
    await newQuestion.save();
    req.flash('success', 'Successfully added a new Question !');
    res.redirect(`/collegeQuora/${newQuestion._id}`);

}))

router.get('/:id', catchAsync( async (req, res) => {
    const ID = req.params.id;
    // console.log(ID);
    const reqQuestion = await Question.findById(ID).populate('answers');
    // console.log('outside');
    // console.log(reqQuestion);
    if(!reqQuestion){
        // console.log('inside the if');
        req.flash('error', "Can't able to find the question !");
        return res.redirect('/collegeQuora');
    }
    res.render('questions/show', {reqQuestion});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const reqQuestion = await Question.findById(req.params.id);
    res.render('questions/edit', {reqQuestion});
}))

router.put('/:id/edit', validateQuestion, catchAsync( async (req, res) => {
    const newQuestion = req.body.question.question;
    // console.log(newQuestion);
    const ID = req.params.id;
    const updatedQuestion = await Question.findByIdAndUpdate(ID, {question: newQuestion});
    res.redirect(`/collegeQuora/${ID}`);
    // res.send('you got me');
}))

router.delete('/:id',questionDeleteMiddleware ,catchAsync( async (req, res) => {
    const ID = req.params.id;
    await Question.findByIdAndDelete(ID);
    res.redirect('/collegeQuora');
}))

module.exports = router;