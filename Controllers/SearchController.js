const site = require('../Models/SiteModel');
const cheerio = require('cheerio');
const axios = require('axios');
const queryString = require('querystring');
const url = require('url');
const detail = require('../Models/DetailModel')
var fs = require('fs')
const LogFunctions = require('./LogFunctions')

exports.searchOnSites = async (searchQuery) => {
    const data = [];
    //return [{searchQuery},{searchQuery},{searchQuery}]
    try{
        const sites =  await site.find();
        await Promise.all(sites.map(async (site) => {
            let url = encodeURI(site.baseUrl + site.searchRoute + searchQuery);

            if(site.name == "kitapyurdu") {
                //const responseFromSite = await axios.get(url);
                //const $ = cheerio.load(responseFromSite.data);

                var contents = fs.readFileSync('./Response/' + site.name, 'utf8');
                    
                const $ = cheerio.load(contents)
                const table = $("#product-table")
                const items = cheerio.load(table.html())

                var name = []
                var price = []
                var image = []
                var detail = []

                items(".name").each((i, el) => {
                    name.push($(el).text())
                })

                items(".price").each((i, el) => {
                    price.push($(el).text().split("K")[0].trim().split("TL")[0].trim())
                })

                items(".image").each((i, el) => {
                    image.push($(el).find("img").attr("src"))
                    detail.push($(el).find("a").attr("href"))
                })

                for(var [i, nm] of name.entries()){
                    let dataObject = {}
                    dataObject.productName = nm.replace(/\n/g, '').trim();
                    dataObject.productPrice = (price[i]) ? price[i].replace(/\n/g, '').trim().split(":")[1] : 0;
                    dataObject.productImage = image[i];
                    dataObject.productLink = detail[i];
                    dataObject.siteName = site.name;
                    
                    if(dataObject.productName != "" && dataObject.productPrice != "")
                        data.push(dataObject)
                }
            }
            else {
                //const responseFromSite = await axios.get(url);

                var itemClass = ""
                if(site.itemClass != "")
                    itemClass = " ." + site.itemClass;
                else{                
                    if(site.itemParentClass != "")
                        itemClass = "ul" + "." + site.itemParentClass + " li";
                    else 
                    itemClass = "ul" + " li";
                }
                    
                let itemName = site.itemNameTag + "." + site.itemNameClass;
                let itemPrice = site.itemPriceTag
                if(site.itemPriceClass != "")
                    itemPrice += "." + site.itemPriceClass;
                    
                //const $ = cheerio.load(responseFromSite.data);

                var contents = fs.readFileSync('./Response/' + site.name, 'utf8');
                    
                const $ = cheerio.load(contents)
    
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
                    if(site.name == "n11")
                        detailLink = encodeURI($(el).find("a").attr('href'));
        
                    dataObject.productName = itemNameText.replace(/\n/g, '').trim();
                    dataObject.productPrice = itemPriceText.replace(/\n/g, '').trim().replace(/                /g, ' ').split("K")[0].trim().split("TL")[0].trim();
                    dataObject.productImage = itemImageLink;
                    dataObject.productLink = detailLink;
                    dataObject.siteName = site.name;
        
                    if(dataObject.productName != "" && dataObject.productPrice != "")
                        data.push(dataObject)
                })
            }
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

    let ip = req.connection.remoteAddress
    LogFunctions.saveLog(ip, parsedQs.q, "")

    this.searchOnSites(parsedQs.q)
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

    // const responseFromSite = await axios.get(detailUrl)
    // const $ = cheerio.load(responseFromSite.data)
    
    var contents = fs.readFileSync('./Response/details', 'utf8');
    const $ = cheerio.load(contents)
    
    var nameQuery = detailInfo.nameTag
    if(detailInfo.nameClass != "")
        nameQuery += "." + detailInfo.nameClass
    let nameTemplate = $(nameQuery)
    var name = ""
    if(detailInfo.nameAttr == "text"){
        name = nameTemplate.text().replace(/\n/g, '').trim();
    }
    else{
        name = nameTemplate.attr(detailInfo.nameAttr).replace(/\n/g, '').trim()
    }

    var priceQuery = ""
    if(detailInfo.priceId){
        priceQuery = "#" + detailInfo.priceId
    }
    else{
        priceQuery = detailInfo.priceTag
        if (detailInfo.priceClass != "")
            priceQuery += "." + detailInfo.priceClass.replace(" ", ".")
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
        var image = $(el).attr(detailInfo.imageAttr)
        if(detailInfo.siteName == "kitapyurdu")
            image = $(el).find("img").attr("src")
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

        if (detailInfo.siteName == "kitapyurdu") {
            let title = []
            let detail = []
            for(var [i, value] of detailValue.entries()){
                var det = value.replace(/\t/g, '').replace(/\n/g, '').trim()
                if(i % 2 == 0)
                    title.push(det)
                else
                    detail.push(det)
            }
            detailTitle = title
            detailValue = detail
        }
       
        for(var [i, title] of detailTitle.entries()){
            let value = detailValue[i]
            let obj = {
                title,
                value
            }
            details.push(obj)
        }
        
    }
    else if(detailInfo.siteName == "teknosa") {
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
    else if(detailInfo.siteName == "n11") {
        let detailValue = []
        let detValueQuery = detailInfo.detailTag + "." + detailInfo.detailClass.replace(/ /g, '.')
        
        let detailResponse = $(detValueQuery).text()
        let detailArray = detailResponse.split("\n")

        for(var det of detailArray) {
            let detail = det.trim()
            if(detail != "")
                detailValue.push(detail)
        }

        for(var [i, value] of detailValue.entries()){
            let title = "detail"
            let obj = {
                title:title,
                value: value
            }
            details.push(obj)
        }
    }

    let ip = req.connection.remoteAddress
    LogFunctions.saveLog(ip, detailUrl, name)

    res.status(200).json({
        name: name,
        price: price.replace(/\s/g, ""),
        images: images,
        details: details
    })
}