const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    baseUrl: { type: String, required: true },
    searchRoute: { type: String, required: true },
    pageRoute: { type: String, required: true },
    itemClass: { type: String, required: false },
    itemParentClass: { type: String, required: false },
    itemNameTag: { type: String, required: true },
    itemNameClass: { type: String, required: false },
    itemNameLocation: { type: String, required: true },
    itemPriceTag: { type: String, required: true },
    itemPriceClass: { type: String, required: false },
    itemPriceLocation: { type: String, required: true },
    itemImageClass: { type: String, required: false },
    itemImageTag: { type: String, required: true },
    itemImageAttr: { type: String, required: true },
    detailID: { type:mongoose.Schema.Types.ObjectId, ref:'Detail'}
});

module.exports = mongoose.model('Site', siteSchema);