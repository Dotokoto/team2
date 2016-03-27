'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let stageSchema = new Schema({
    questId: Number,
    geolocation: { latitude: Number, longitude: Number },
    photo: String,
    hint: String,
    order: Number,
    likesCount: Number,
    dislikesCount: Number,
    commentsCount: Number
});

stageSchema.methods.isLikedByUser = function (user) {};
stageSchema.methods.getComments = function () {};
stageSchema.methods.isDoneByUser = function (user) {};

module.exports = mongoose.model('Stages', stageSchema);
