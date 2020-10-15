let express = require('express')
let bodyParser = require('body-parser')


module.exports = () => {
    let app = express()

    app.set('view engine', 'ejs')
    // 前端页面展示
    app.use(express.static(__dirname + '/../views'))
    app.use(bodyParser.json())
    // 路由
    require('../routes/index')(app)

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