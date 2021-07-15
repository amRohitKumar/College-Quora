const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Question = require('../models/questions');
const ExpressError = require('../utils/ExpressError');
const {validateQuestion, questionDeleteMiddleware, isLoggedIn} = require('../utils/middleware');
const {DateAndMonth} = require('../utils/helperFunction');

router.get('/', catchAsync( async (req, res) => {
    const questions = await Question.find({});
    res.render('questions/index', {questions});
}))

router.get('/new', isLoggedIn,  (req, res) => {
    res.render('questions/new');
})

router.post('/new', isLoggedIn, validateQuestion, catchAsync( async(req, res, next) => {
    
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

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const reqQuestion = await Question.findById(req.params.id);
    res.render('questions/edit', {reqQuestion});
}))

router.delete('/:id', isLoggedIn, questionDeleteMiddleware ,catchAsync( async (req, res) => {
    const ID = req.params.id;
    await Question.findByIdAndDelete(ID);
    res.redirect('/collegeQuora');
}))

module.exports = router;