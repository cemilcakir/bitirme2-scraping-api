const site = require('../Models/SiteModel');
const cheerio = require('cheerio');
const request = require('request');
const queryString = require('querystring');
const url = require('url');


function searchInSites(searchQuery) {
    site.find()
    .select('name baseUrl searchRoute')
    .exec()
    .then(sites => {
        sites.forEach(site => {
           let url = encodeURI(site.baseUrl + site.searchRoute + searchQuery);
           request.get(url, (error, response, html) => {
               if(!error && response.statusCode == 200){
                   const $ = cheerio.load(html);
                   if(site.name == "teknosa"){
                    const title = $('.pleft');
                    console.log(title.text());
                   }
               }
               else {
                   return "false";
               }
               return "test";
           });
        });
    })
    .catch(err => {
        console.log("error");
    });
}

exports.search = (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let parsedUrl = url.parse(fullUrl);
    let parsedQs = queryString.parse(parsedUrl.query);
    searchInSites(parsedQs.q);

    res.status(200).json({
        searchQuery: parsedQs.q
    })
}
