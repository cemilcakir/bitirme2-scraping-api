const site = require('../Models/SiteModel');
const cheerio = require('cheerio');
const axios = require('axios');
const queryString = require('querystring');
const url = require('url');
const detail = require('../Models/DetailModel')

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

exports.getDetails = async (req, res, next) => {
    const detailUrl = req.query.url
    const siteName = detailUrl.split('.')[1]

    const siteInfo = await site.findOne({name: siteName})
    const detailId = siteInfo.detailID   
    const detailInfo = await detail.findById(detailId)

    const responseFromSite = await axios.get(detailUrl)
    const $ = cheerio.load(responseFromSite.data)
    
    var nameQuery = detailInfo.nameTag
    if(detailInfo.nameClass != "null")
        nameQuery += "." + detailInfo.nameClass
    let nameTemplate = $(nameQuery)
    var name = ""
    if(detailInfo.nameAttr == "text"){
        name = nameTemplate.text();
    }
    else{
        name = nameTemplate.attr(detailInfo.nameAttr)
    }

    var priceQuery = ""
    if(detailInfo.priceId){
        priceQuery = "#" + detailInfo.priceId
    }
    else{
        priceQuery = detailInfo.priceTag + "." + detailInfo.priceClass.replace(" ", ".")
    }
    let priceTemplate = $(priceQuery)
    var price = ""
    if(detailInfo.nameAttr == "text"){
        price = priceTemplate.text();
    }
    else{
        price = priceTemplate.attr(detailInfo.priceAttr)
    }

    var images = []
    let imageQuery = "." + detailInfo.imageClass
    
    $(imageQuery).each((i, el) => {
        let image = $(el).attr(detailInfo.imageAttr)
        if(image)
            images.push(image)
    })

    var details = []
    if (detailInfo.detailTag == "table") {
        var detailTitle = []
        let detTitleQuery = detailInfo.detailTag + "." + detailInfo.detailClass.replace(" ", ".") + " tr th"
        $(detTitleQuery).each((i, el) => {
            let detail = $(el).text()
            detailTitle.push(detail)
        })
    
        var detailValue = []
        let detValueQuery = detailInfo.detailTag + "." + detailInfo.detailClass.replace(" ", ".") + " tr td"
        $(detValueQuery).each((i, el) => {
            let detail = $(el).text()
            detailValue.push(detail)
        })
    
        for(var [i, title] of detailTitle.entries()){
            let value = detailValue[i]
            let obj = {
                title,
                value
            }
            details.push(obj)
        }
    }
    else {
        let detailTitle = []
        let detTitleQuery = detailInfo.detailTag + " div.left.key" // + "." + detailInfo.detailClass.replace(" ", ".")
        $(detTitleQuery).each((i, el) => {
            let detail = $(el).text().replace(/\n/g, "").replace(/\s/g, "")
            detailTitle.push(detail)
        })

        let detailValue = []
        let detValueQuery = detailInfo.detailTag + " div.left.value" // + "." + detailInfo.detailClass.replace(" ", ".")
        $(detValueQuery).each((i, el) => {
            let detail = $(el).text().replace(/\n/g, "").replace(/\s/g, "")
            detailValue.push(detail)
        })

        for(var [i, title] of detailTitle.entries()){
            let value = detailValue[i]
            let obj = {
                title,
                value
            }
            details.push(obj)
        }
    }

    res.status(200).json({
        name: name,
        price: price.replace(/\s/g, ""),
        images: images,
        details: details
    })
}