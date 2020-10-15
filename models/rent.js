const mongoose  = require('mongoose')
const db = require('../config/connect')
const rentInfo = require('../controllers/rentInfo')

const Rent = new mongoose.Schema({
    // tel: $('span.tel-num.tel-font').text(),
    // price: $('.house-price').text(),
    // location: $('a.c_333')[0].children[0].data,
    // img
    url: { type: String },
    desc: { type: String },
    img: { type: String }
})

let rentModel = db.model('rent', Rent)
module.exports = {
    create (data) {
        
    }
}