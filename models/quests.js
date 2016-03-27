'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsSchema = new Schema({
    name: String,
    city: String,
    authorId: Number,
    description: String,
    likesCount: Number,
    dislikesCount: Number,
    commentsCount: Number,
    doneCount: Number
});

questsSchema.methods.isLikedByUser = function (user) {};
questsSchema.methods.getStages = function (cb) {
    const Stages = require('stages');
    Stages.find({ questId: this._id }, function (err, stages) {
        // Надо для каждой stage получить isLikedByUser, чтобы подсвечивать/нет сердечко
        cb(err, stages);
    });
};
questsSchema.methods.isDoneByUser = function (user) {};
questsSchema.methods.isMarkedByUser = function (user) {}; // добавлен ли в закладки
questsSchema.methods.getComments = function () {};

module.exports = mongoose.model('Quests', questsSchema);
