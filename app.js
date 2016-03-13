'use strict';

const express = require('express');
const app = express();

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const hbs = require('hbs');
const morgan = require('morgan');

const viewsDir = path.join(__dirname, 'bundles');
const publicDir = path.join(__dirname, 'public');

app.set('views', viewsDir);
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.static(publicDir));

hbs.registerPartials(path.join(__dirname, 'blocks'));

app.set('port', (process.env.PORT || 8080));

app.use((req, res, next) => {
    req.commonData = {
        meta: {
            description: 'Hahaton',
            charset: 'utf-8'
        },
        page: {
            title: 'PhotoQuest'
        },
        isDev: argv.NODE_ENV === 'development'
    };

    next();
});

require('./routes.js')(app);

app.listen(app.get('port'),
    () => console.log(`Listening on port ${app.get('port')}`));

module.exports = app;

