const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Answer = require('../models/answers');
const Question = require('../models/questions');
const ExpressError = require('../utils/ExpressError');
const { validateAnswer, isLoggedIn, authorizeAnswer} = require('../utils/middleware');
const {DateAndMonth} = require('../utils/helperFunction');

router.post('/:id/review', isLoggedIn, validateAnswer, catchAsync( async (req, res) => {
    const ID = req.params.id;
    const answer = req.body.answer;
    const author = req.user.name;
    const authorId = req.user._id;
    const currentDate = DateAndMonth();
    // res.send("ya ya not bad !!!");
    const reqQuestion = await Question.findById(ID);
    console.log(req.user);
    const newAnswer = new Answer({answer: answer, date: currentDate, author : author, authorId : authorId});
    reqQuestion.answers.push(newAnswer);
    await newAnswer.save();
    await reqQuestion.save();
    res.redirect(`/collegeQuora/${ID}`);
}))




router.delete('/:id/review/:a_id/delete', isLoggedIn, authorizeAnswer, catchAsync( async(req, res) => {

    const {id, a_id} = req.params;
    const reqAnswer = await Answer.findByIdAndDelete(a_id);
    res.redirect(`/collegeQuora/${id}`);

}))

module.exports = router;