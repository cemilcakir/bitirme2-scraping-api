const mongoose = require('mongoose')
const Log = require('../Models/LogModel')
const geoip = require('geoip-lite')

module.exports = {
    saveLog: (ip, query, product) => {
    
        var locationResponse = geoip.lookup(ip)
        var location = ""
        if (locationResponse && locationResponse.city)
            location = locationResponse.city

        const log = new Log({
            _id: mongoose.Types.ObjectId(),
            ip: ip,
            time: Date.now(),
            searchQuery: query,
            product: product,
            location: location
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