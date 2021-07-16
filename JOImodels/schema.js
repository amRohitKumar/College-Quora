const Joi = require('joi');

module.exports.questionSchema = Joi.object({
    question : Joi.object({
        question : Joi.string().required(),
    }).required()
})

module.exports.answerSchema = Joi.object({
    answer : Joi.string().required(),
})