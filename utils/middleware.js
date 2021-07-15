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