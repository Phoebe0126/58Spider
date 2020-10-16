const mongoose  = require('mongoose')
const db = require('../config/connect')
const rentInfo = require('../controllers/rentInfo')

const Rent = new mongoose.Schema({
    url: { type: String },
    desc: { type: String },
    img: { type: String },
    location: { type: String }
})

let rentModel = db.model('rent', Rent)
module.exports = {
    create (data) {
        return new Promise ((resolve, reject) => {
            rentModel.create(data, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    find (data = {}) {
        return new Promise ((resolve, reject) => {
            rentModel.find(data, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}