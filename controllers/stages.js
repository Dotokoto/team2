'use strict';

const fs = require('fs');
const photoController = require('./photos.js');
const Stage = require('../models/stages');
const mongoose = require('mongoose');
const createHttpError = require('http-errors');

const Checkin = require('../models/checkins');
const geolib = require('geolib');

exports.createStage = (req, stage, questId) => {
    console.log('stage pending');
    if (stage.file === '') {

        return Promise.reject(createHttpError(403, 'Не была добавлена фотография этапа'));
    }

    return photoController.uploadPhoto(req, stage.file)
        .then(result => {
            if (!result) {

                return Promise.reject(
                    createHttpError(500, 'Внутренняя ошибка сервиса, попробуйте еще раз.')
                );
            }
            console.log('stage added');
            return new Stage({
                name: stage.name,
                description: stage.description,
                geolocation: stage.geolocation,
                order: stage.order,
                questId: mongoose.Types.ObjectId(questId),
                photo: result.url,
                likesCount: 0,
                commentsCount: 0,
                dislikesCount: 0
            }).save();
        });
}

function updateStage(req, res) {

}

function deleteStage(req, res) {
    if (!req.params.id) {
        res.sendStatus(400);
    }

    let query = {
        _id: req.params.id
    };

    Stage.deleteStage(query)
        .then(() => res.sendStatus(200));
}

module.exports = {
    createStage,
    updateStage,
    deleteStage
};

exports.registerCheckin = (req, res) => {
    if (!req.commonData.user) {
        req.commonData.errors.push({ text: 'Не авторизован.' });
        res.send(401);
        return;
    }

    let data = {
        questId: req.body.questId,
        stageId: req.body.stageId,
        userId: req.commonData.user.mongo_id,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    };

    Stage.findOne(
        {
            _id: data.stageId
        },
        function (err, doc) {
            if (err) {
                req.commonData.errors.push({ text: 'Этап не найден в базе данных' });
                res.sendStatus(500);
                return;
            }
            let stage = doc.toObject();
            let pointLatitude = stage.geolocation.latitude;
            let pointLongitude = stage.geolocation.longitude;
            const distance = geolib.getDistance(
                {
                    latitude: data.latitude,
                    longitude: data.longitude
                },
                {
                    latitude: pointLatitude,
                    longitude: pointLongitude
                }
            );

            // distance в метрах
            // if (distance > 20000000) {
            if (distance > 150) {
                data.checkin = false;
                res.json(data);
            } else {
                Checkin.findOne({
                    stageId: data.stageId, userId: data.userId
                }, function (err, doc) {
                    if (err) {
                        req.commonData.errors.push({
                            text: 'Ошибка при поиске чекина в базе данных'
                        });
                        res.sendStatus(500);
                        return;
                    }

                    // Если пользователь уже зачекинен
                    if (doc) {
                        data.checkin = false;
                        res.json(data);
                        return;
                    }

                    // Если все ок
                    new Checkin(data).save(err => {
                        if (err) {
                            req.commonData.errors.push({ text: 'Ошибка при чекине' });
                            res.sendStatus(500);
                        } else {
                            data.checkin = true;
                            res.json(data);
                        }
                    });
                });
            }
        }
    );
};
