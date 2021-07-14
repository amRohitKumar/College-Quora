const Joi = require('joi');

module.exports.questionSchema = Joi.object({
    question : Joi.object({
        question : Joi.string().required().min(5),
    }).required()
})
