const {questionSchema, answerSchema} = require('../JOImodels/schema');
const ExpressError = require('../utils/ExpressError');
const Question = require('../models/questions');
const Answer = require('../models/answers');


module.exports.validateQuestion = (req, res, next) => {
    
    const {error} = questionSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.questionDeleteMiddleware = async (req, res, next) => {
    const {id} = req.params;
    const reqQuestion = await Question.findById(id);
    // console.log(reqQuestion);
    for(let ans of reqQuestion.answers){
        await Answer.findByIdAndDelete(ans);
    }
    next();
}

module.exports.validateAnswer = (req, res, next) => {
    
    const {error} = answerSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {

    if(!req.isAuthenticated()){
        // console.log("start");
        // console.log(req);
        // console.log(req.originalUrl);
        // console.log(req.method);
        // console.log(req.params);
        req.session.returnTo = req.originalUrl;
        req.session.prevMethod = req.method;
        req.session.prevID = req.params.id;
        req.flash('error', 'You must be signed in first !');
        return res.redirect('/login');
    }
    next();
}

module.exports.authorizeAnswer = async (req, res, next) => {
    const {a_id} = req.params;
    const reqAnswer = await Answer.findById(a_id);
    if(!(req.user._id == reqAnswer.authorId)){
        req.flash('error', "You are not authorized to do this !");
        return res.redirect(`/collegeQuora/${req.params.id}`);
    }
    next();
}

module.exports.authorizeQuestion = async (req, res, next) => {
    const reqQuestion = await Question.findById(req.params.id);
    if(!(req.user._id == reqQuestion.authorId)){
        req.flash('error', "You are not authorized to do this !");
        return res.redirect(`/collegeQuora/${req.params.id}`);
    }
    next();
}