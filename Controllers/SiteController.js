const site = require('../Models/SiteModel');
const mongoose = require('mongoose');

exports.sites = (req, res, next) => {
    site.find()
    .select('_id name baseUrl searchRoute')
    .exec()
    .then(sites => {
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
                    searchRoute
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
    if(req.body.user.email == "cemilcakir@outlook.com.tr"){
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
