const site = require('../Models/SiteModel');
const mongoose = require('mongoose');

exports.sites = (req, res, next) => {
    site.find()
    .exec()
    .then(sites => {
        sites.forEach(site => {
            site.__v = undefined
        });
        res.status(200).json({
            sites
        });
    })
    .catch(err => {
        res.status(500).json({
            response: err
        });
    })
}

exports.add = (req, res, next) => {
    const name = req.body.name;
    const baseUrl = req.body.baseUrl;
    const searchRoute = req.body.searchRoute;
    const pageRoute = req.body.pageRoute;
    const itemClass = req.body.itemClass;
    const itemParentClass = req.body.itemParentClass;
    const itemNameTag = req.body.itemNameTag;
    const itemNameClass = req.body.itemNameClass;
    const itemNameLocation = req.body.itemNameLocation;
    const itemPriceTag = req.body.itemPriceTag;
    const itemPriceClass = req.body.itemPriceClass;
    const itemPriceLocation = req.body.itemPriceLocation;

    if(name && baseUrl && searchRoute){
        site.find({baseUrl: baseUrl, name: name})
        .exec()
        .then(sites => {
            if(sites.length >= 1){
                res.status(409).json({
                    response: "Site exists."
                });
            }
            else{
                const newSite = new site({
                    _id: mongoose.Types.ObjectId(),
                    name,
                    baseUrl,
                    searchRoute,
                    pageRoute,
                    itemClass,
                    itemParentClass,
                    itemNameTag,
                    itemNameClass,
                    itemNameLocation,
                    itemPriceTag,
                    itemPriceClass,
                    itemPriceLocation
                });
                newSite.save()
                .then(result => {
                    result._v_ = undefined;
                    res.status(201).json({
                        response: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        response: err
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                response: err
            });
        });
    }
    else{
        res.status(428).json({
            response:"Please send 'name', 'baseUrl', 'searchRoute' body data."
        })
    }
}

exports.delete = (req, res, next) => {
    if(req.user.email == "cemilcakir@outlook.com.tr"){
        const id = req.params.siteId;
        site.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                response: result
            })
        })
        .catch(err => {
            res.status(500).json({
                response: err
            });
        });
    }
   else {
       res.status(401).json({
           response: "Auth failed."
       });
   }
}

exports.patch = (req, res, next) => {
    const id = req.params.siteId;
    const updateOps = {};
    for(const key of Object.keys(req.body)){
        updateOps[key] = req.body[key];
    }
    site.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}
