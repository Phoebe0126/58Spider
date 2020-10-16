let mongoose = require('mongoose');
let mongodb = require('./config').mongodb

mongoose.Promise = global.Promise
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('connected', () => {
    console.log('mongoDB connected successfully')
})
mongoose.connection.on('error', error => {
    console.log('error when access to mongoDB:', error)
})

module.exports = mongoose
