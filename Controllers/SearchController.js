const site = require('../Models/SiteModel');
const cheerio = require('cheerio');
const axios = require('axios');
const queryString = require('querystring');
const url = require('url');

function getSearchData(query){
    const data = [];
    site.find()
    .exec()
    .then(sites => {
        sites.forEach(site => {
           let url = encodeURI(site.baseUrl + site.searchRoute + query);
           let itemClass = "." + site.itemClass
           let itemName = site.itemNameTag + "." + site.itemNameClass
           let itemPrice = site.itemPriceTag + "." + site.itemPriceClass

           const dataObject = {}
           
           axios.get(url)
           .then(response => {
               const $ = cheerio.load(response.data)
               $(itemClass).each((i, el) => {
                   let itemNameTemplate = $(el).find(itemName)
                   let itemNameText = ""
                   if(site.itemNameLocation == "text"){
                       itemNameText = itemNameTemplate.text();
                   }
                   else{
                        itemNameText = itemNameTemplate.attr(site.itemNameLocation.substring(5))
                   }

                   let itemPriceTemplate = $(el).find(itemPrice)
                   let itemPriceText = ""
                   if(site.itemPriceLocation == "text"){
                    itemPriceText = itemPriceTemplate.text();
                    }
                    else{
                        itemPriceText = itemPriceTemplate.attr(site.itemPriceLocation.substring(5))
                    }

                   dataObject.productName = itemNameText;
                   dataObject.productPrice = itemPriceText;
                   data.push(dataObject)
               })
           })
           .catch(error => {
               console.log(error)
           })
        });
    })
    .catch(err => {
        console.log(err)
    });
}

exports.search = (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let parsedUrl = url.parse(fullUrl);
    let parsedQs = queryString.parse(parsedUrl.query);

    getSearchData(parsedQs.q)

    res.status(200).json({
        response: parsedQs.q
    })
}