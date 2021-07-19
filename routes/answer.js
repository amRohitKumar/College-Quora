const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Answer = require('../models/answers');
const Question = require('../models/questions');
const ExpressError = require('../utils/ExpressError');
const { validateAnswer, isLoggedIn, authorizeAnswer} = require('../utils/middleware');
const {DateAndMonth, alreadyUpVoted, alreadyDownVoted} = require('../utils/helperFunction');

router.post('/:id/review', isLoggedIn, validateAnswer, catchAsync( async (req, res) => {
    const ID = req.params.id;
    const answer = req.body.answer;
    const author = req.user.name;
    const authorId = req.user._id;
    const currentDate = DateAndMonth();
    // res.send("ya ya not bad !!!");
    const reqQuestion = await Question.findById(ID);
    const reqUser = await User.findById(authorId);
    let i = reqUser.qAnswered;
    reqUser.reqAnswered  = i+1;
    await reqUser.save();
    const newAnswer = new Answer({answer: answer, date: currentDate, author : author, authorId : authorId, votes : 0});
    reqQuestion.answers.push(newAnswer);
    await newAnswer.save();
    await reqQuestion.save();
    req.flash('success', 'Added new answer !');
    res.redirect(`/collegeQuora/${ID}`);
}))

router.put('/:id/edit/:a_id', authorizeAnswer, catchAsync(async (req, res) => {
    const {id, a_id} = req.params;
    const {newAnswer} = req.body;

    await Answer.findByIdAndUpdate(a_id, {answer: newAnswer});
    res.redirect(`/collegeQuora/${id}`);
}))

router.get('/:id/upvote/:a_id', isLoggedIn, catchAsync( async(req, res) => {
    const {id, a_id} = req.params;
    const reqAnswer = await Answer.findById(a_id);
    let presentVote = reqAnswer.votes;
    let res1 = alreadyUpVoted(reqAnswer, req.user._id)
    let res2 = alreadyDownVoted(reqAnswer, req.user._id)
    // console.log("res1 = ", res1);
    // console.log("res2 = ", res2);
    // const reqUser = await User.findById(req.user._id);
    if(res1 === true){
        const index = reqAnswer.upVoters.indexOf(req.user._id);
        reqAnswer.upVoters.splice(index, 1);
        presentVote--;    
    }
    else if(res2 === true){
        const index = reqAnswer.downVoters.indexOf(req.user._id);
        reqAnswer.downVoters.splice(index, 1);
        reqAnswer.upVoters.push(req.user._id);
        presentVote += 2;
    }
    else{
        reqAnswer.upVoters.push(req.user._id);
        presentVote++;
    }
    
    reqAnswer.votes = presentVote;
    await reqAnswer.save(); 
    res.redirect(`/collegeQuora/${id}`);
}))

router.get('/:id/downvote/:a_id', isLoggedIn , catchAsync( async(req, res) => {
    const {id, a_id} = req.params;
    const reqAnswer = await Answer.findById(a_id);
    let presentVote = reqAnswer.votes;

    let res1 = alreadyUpVoted(reqAnswer, req.user._id)
    let res2 = alreadyDownVoted(reqAnswer, req.user._id)
    // console.log("res1 = ", res1);
    // console.log("res2 = ", res2);

    if(res2 === true){
        const index = reqAnswer.downVoters.indexOf(req.user._id);
        reqAnswer.downVoters.splice(index, 1);

        presentVote++;
    }
    else if(res1 === true){
        const index = reqAnswer.upVoters.indexOf(req.user._id);
        reqAnswer.upVoters.splice(index, 1);
        reqAnswer.downVoters.push(req.user._id);
        presentVote -= 2;
    }
    else{
        reqAnswer.downVoters.push(req.user._id);
        presentVote--;
    }

    reqAnswer.votes = presentVote;
    await reqAnswer.save(); 
    res.redirect(`/collegeQuora/${id}`);
}))

router.delete('/:id/review/:a_id/delete', isLoggedIn, authorizeAnswer, catchAsync( async(req, res) => {

    const {id, a_id} = req.params;
    const reqAnswer = await Answer.findByIdAndDelete(a_id);
    req.flash('success', 'Answer deleted !');
    res.redirect(`/collegeQuora/${id}`);

}))

module.exports = router;