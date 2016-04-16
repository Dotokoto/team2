'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentsSchema = new Schema({
    collectionName: String,
    objectId: Number,
    text: String,
    userId: { type: Number, ref: 'User' }
});

module.exports = mongoose.model('Comments', commentsSchema);
