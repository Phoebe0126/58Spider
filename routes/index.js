// const getRentalInfos = require('../controllers/rentInfo').getRentalInfos
const RentModel = require('../models/rent')


module.exports = app => {

    app.get('/', (req, res) => {
        res.sendFile('index.html')
    })
    
    app.get('/rental/getInfos', (req, res) => {
        RentModel.find().then(result => {
            if (!result) {
                res.json({
                    data: result,
                    status: 1,
                    message: '获取租房信息失败'
                })
            }
            res.json({
                data: result,
                status: 0,
                message: '租房信息获取成功'
            })
        })
    })
};
// module.exports = app => {
//     app.route('/')
//     .get(function(req,res,next){
//         res.sendFile('index.html');
//     });

//     app.route('/rental/getInfos')
//     .get()
// }