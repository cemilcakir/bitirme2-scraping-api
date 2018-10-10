const site = require('../Models/SiteModel');
const cheerio = require('cheerio');
const axios = require('axios');
const queryString = require('querystring');
const url = require('url');

async function searchOnSites(searchQuery){
    const data = [];
    try{
        const sites =  await site.find();
        await Promise.all(sites.map(async (site) => {
            let url = encodeURI(site.baseUrl + site.searchRoute + searchQuery);
            const responseFromSite = await axios.get(url);

            var itemClass = ""
            if(site.itemClass != "")
                itemClass = " ." + site.itemClass;
            else
                itemClass = "ul." + site.itemParentClass + " li";

            let itemName = site.itemNameTag + "." + site.itemNameClass;
            let itemPrice = site.itemPriceTag + "." + site.itemPriceClass;
            
            const $ = cheerio.load(responseFromSite.data);
            $(itemClass).each((i, el) => {
                const dataObject = {}
                var itemNameTemplate = $(el).find(itemName)
                var itemNameText = ""
                if(site.itemNameLocation == "text"){
                    itemNameText = itemNameTemplate.text();
                }
                else{
                     itemNameText = itemNameTemplate.attr(site.itemNameLocation.substring(5))
                }
                
                var itemPriceTemplate = $(el).find(itemPrice)
                var itemPriceText = ""
                if(site.itemPriceLocation == "text"){
                    itemPriceText = itemPriceTemplate.text();
                }
                else{
                    itemPriceText = itemPriceTemplate.attr(site.itemPriceLocation.substring(5))
                }

                let itemImageLink = $(el).find(site.itemImageTag).attr(site.itemImageAttr);

                var detailLink = encodeURI(site.baseUrl + $(el).find("a").attr('href').substr(1));

                dataObject.productName = itemNameText.replace(/\n/g, '');
                dataObject.productPrice = itemPriceText.replace(/\n/g, '');
                dataObject.productImage = itemImageLink;
                dataObject.productLink = detailLink;
                dataObject.siteName = site.name;

                data.push(dataObject)
            })
        }));
        return data;
    }
    catch(error){
        console.log(error);
        return error;
    }
}

exports.search = (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let parsedUrl = url.parse(fullUrl);
    let parsedQs = queryString.parse(parsedUrl.query);

    searchOnSites(parsedQs.q)
    .then(result => {
        res.status(200).json({
            size: result.length,
            response: result
        })
    })
    .catch(error => {
        res.status(500).json({
            response: error
        })
    })
}