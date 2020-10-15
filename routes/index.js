const getRentalInfos = require('../controllers/rentInfo').getRentalInfos

module.exports = app => {
    app.route('/')
    .get(function(req,res,next){
        res.sendFile('index.html');
    });

    app.route('/rental/getInfos')
    .get(getRentalInfos)
}