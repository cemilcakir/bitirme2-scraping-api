const mongoose = require('mongoose')
const Log = require('../Models/LogModel')

module.exports = {
    saveLog: (ip, query, product) => {
        const log = new Log({
            _id: mongoose.Types.ObjectId(),
            ip: ip,
            time: Date.now(),
            searchQuery: query,
            product: product
        })

        log.save()
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err.message)
            });
    }
}