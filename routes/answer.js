const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Answer = require('../models/answers');
const Question = require('../models/questions');
const ExpressError = require('../utils/ExpressError');
const { validateAnswer, isLoggedIn, validateQuestion} = require('../utils/middleware');
const {DateAndMonth} = require('../utils/helperFunction');

router.post('/:id/review', isLoggedIn, validateAnswer, catchAsync( async (req, res) => {
    const ID = req.params.id;
    const answer = req.body.answer;
    const currentDate = DateAndMonth();
    // res.send("ya ya not bad !!!");
    const reqQuestion = await Question.findById(ID);
    const newAnswer = new Answer({answer: answer, date: currentDate});
    reqQuestion.answers.push(newAnswer);
    await newAnswer.save();
    await reqQuestion.save();
    res.redirect(`/collegeQuora/${ID}`);
}))


router.put('/:id/edit', isLoggedIn, validateQuestion, catchAsync( async (req, res) => {
    const newQuestion = req.body.question.question;
    // console.log(newQuestion);
    const ID = req.params.id;
    const updatedQuestion = await Question.findByIdAndUpdate(ID, {question: newQuestion});
    res.redirect(`/collegeQuora/${ID}`);
    // res.send('you got me');
}))

router.delete('/:id/review/:a_id/delete', isLoggedIn,catchAsync( async(req, res) => {

    const {id, a_id} = req.params;
    const reqAnswer = await Answer.findByIdAndDelete(a_id);
    res.redirect(`/collegeQuora/${id}`);

}))

module.exports = router;