const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    answer: String,
    date: String,
    author: String,
    upVotes: Number,
    downVotes: Number,
})

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;