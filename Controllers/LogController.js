const Log = require('../Models/LogModel')
const SearchController = require('./SearchController')

var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

exports.logs_by_ip = async (req, res, next) => {
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
        // searchQueries = groupBy(searchQueries, "query")
        // searchedProducts = groupBy(searchedProducts, "product")

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
    tempResult = JSON.parse(await fs.readFileSync('./Response/LogResult.json', 'utf8'))

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

exports.logs_by_city = async (req, res, next) => {
    try {
        const city = req.params.city

        const history = await Log.find({
            location: city
        })

        var searchQueries = []
        var searchedProducts = []

        for (var log of history) {
            if (log.product && log.product != "")
                searchedProducts.push({
                    product: log.product,
                    time: log.time,
                    link: log.searchQuery
                })
            else if (!log.searchQuery.includes("http"))
                searchQueries.push({
                    query: log.searchQuery,
                    time: log.time
                })
        }
        searchQueries = groupBy(searchQueries, "query")
        searchedProducts = groupBy(searchedProducts, "product")

        var queries = []
        var products = []

        Object.keys(searchQueries).forEach(function(key) {
            var val = searchQueries[key];
            queries.push({
                query: val[0].query,
                count: val.length
            })
        });

        Object.keys(searchedProducts).forEach(function(key) {
            var val = searchedProducts[key];
            products.push({
                product: val[0].product,
                count: val.length
            })
        });

        res.status(200).json({
            queries,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error
        })
    }
}

exports.logs_all = async (req, res, next) => {
    try {

        const history = await Log.find()

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
        // searchQueries = groupBy(searchQueries, "query")
        // searchedProducts = groupBy(searchedProducts, "product")

        res.status(200).json({
            searchQueries,
            searchedProducts
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error
        })
    }
}

exports.get_all_cities = async (req, res, next) => {
    const cities = await Log.distinct("location")
    var requestCounts = []

    for (var city of cities) {
        let count = await Log.find({
            location: city
        }).count()

        requestCounts.push(count)
    }

    res.status(200).json({
        cities,
        requestCounts
    })
}