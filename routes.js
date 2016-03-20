'use strict';

const pages = require('./controllers/pages');
const auth = require('./controllers/auth');
const passport = require('passport');

module.exports = function (app) {
    app.get('/', pages.index);
    app.get('/quests', pages.quests);
    app.get('/login',
        passport.authenticate('auth0', { failureRedirect: '/' }),
        auth.login);
    app.get('/logout', auth.logout);
    app.all('*', pages.error404);
};
