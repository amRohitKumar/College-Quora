const Joi = require('joi');

module.exports.questionSchema = Joi.object({
    question : Joi.object({
        question : Joi.string().required().min(5),
    }).required()
})

module.exports.answerSchema = Joi.object({
    answer : Joi.string().required().min(5),
})