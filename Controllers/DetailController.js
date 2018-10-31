const detail = require('../Models/DetailModel');
const mongoose = require('mongoose')

exports.details = (req, res, next) => {
    detail.find()
    .exec()
    .then(details => {
        details.forEach(detail => {
            detail.__v = undefined
        });
        res.status(200).json({
            details
        });
    })
    .catch(err => {
        res.status(500).json({
            response: err
        });
    })
}

exports.add = (req, res, next) => {
    detail.find({siteName: req.body.siteName})
    .exec()
    .then(details => {
        if(details.length >= 1){
            res.status(409).json({
                response: "Detail info exists."
            });
        }
        else{
            const newDetail = new detail({
                _id: mongoose.Types.ObjectId(),
                siteName: req.body.siteName,
                nameTag: req.body.nameTag,
                nameClass: req.body.nameClass,
                nameAttr: req.body.nameAttr,
                priceTag: req.body.priceTag,
                priceClass: req.body.priceClass,
                priceAttr: req.body.priceAttr,
                imageClass: req.body.imageClass,
                imageAttr: req.body.imageAttr,
                detailTag: req.body.detailTag,
                detailClass: req.body.detailClass,
                detailAttr: req.body.detailAttr
            });
            newDetail.save()
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

exports.delete = (req, res, next) => {
    if(req.user.email == "cemilcakir@outlook.com.tr"){
        const id = req.params.id;
        detail.remove({_id: id})
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
    const id = req.params.id;
    const updateOps = {};
    for(const key of Object.keys(req.body)){
        updateOps[key] = req.body[key];
    }
    detail.update({_id: id}, { $set: updateOps })
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
