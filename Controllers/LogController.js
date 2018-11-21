const Log = require('../Models/LogModel')
const SearchController = require('./SearchController')

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

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

exports.search = async (req, res, next) => {
    const ip = req.connection.remoteAddress

    const history = await Log.find({
        ip: ip
    }).sort("-time").limit(5)

    var data = []
    var searched = []
    var tempResult = []

    // await Promise.all(history.map(async (search) => {
    //     if(!searched.includes(search.searchQuery) && !search.searchQuery.includes("://")){
    //         searched.push(search.searchQuery)
    //         tempResult.push(await SearchController.searchOnSites(search.searchQuery))
    //     }
    // }))

    var fs = require('fs');
    tempResult = JSON.parse(await fs.readFileSync('result.json', 'utf8'))

    for (var results of tempResult) {
        if (results.length) {
            for (var result of results) {
                data.push(result)
            }
        }
    }

    data = shuffle(data)

    res.status(200).json({
        data
    })
}