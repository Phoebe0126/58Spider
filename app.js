let express = require('./config/express')
let config = require('./config/config')

let app = express()

app.listen(config.port, () => {
    console.log('app started,listen on port:',config.port)
})

