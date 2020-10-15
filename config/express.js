let express = require('express')
let bodyParser = require('body-parser')
let Controller = require('../controllers/rentInfo')

module.exports = () => {
    let app = express()

    app.set('view engine', 'ejs')
    // 前端页面展示
    app.use(express.static(__dirname + '/../views'))
    app.use(bodyParser.json())
    // 路由
    require('../routes/index')(app)
    // 爬虫解析
    Controller.init()

    app.use((req, res) => {
        res.status(404);
        try {
            return res.json('Not Found!');
        } catch (err) {
            console.error(err)
        }
    })

    app.use((err, req, res, next) => {
        if (!err) {
            return next()
        }

        res.status(500)

        try {
            return res.json(err.message || 'server error!')
        } catch (err) {
            console.error(err)
        }
    })
    return app;
}