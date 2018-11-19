const Log = require('../Models/LogModel')

exports.logs = async (req, res, next) => {
    try {
        const ip = req.connection.remoteAddress

        const history = await Log.find({
            ip: ip
        })

        var searchQueries = []
        var searchedProducts = []

        for (var log of history) {
            if (log.product && log.product != "" && !searchedProducts.includes(log.product))
                searchedProducts.push({
                    product: log.product,
                    time: log.time,
                    link: log.searchQuery
                })
            else if (!log.searchQuery.includes("http") && !searchQueries.includes(log.product))
                searchQueries.push({
                    query: log.searchQuery,
                    time: log.time
                })
        }

        res.status(200).json({
            searchQueries,
            searchedProducts
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}