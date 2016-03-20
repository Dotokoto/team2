exports.quests = (req, res) => {
    res.render('main/main', req.commonData);

};

exports.index = (req, res) => {
    const data = {
        currentCity: 'Екатеринбург'
    };
    res.render('main/main', Object.assign(data, req.commonData));
};

exports.error404 = (req, res) => res.sendStatus(404);
