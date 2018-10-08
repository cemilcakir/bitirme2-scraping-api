const mongoose = require('mongoose');

const productDetailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nameTag: { type: String, required: true },
    nameClass: { type: String, required: true },
    nameAttr: { type: String, required: true },
    priceTag: { type: String, required: true },
    priceClass: { type: String, required: true },
    priceAttr: { type: String, required: true },
    imageClass: { type: String, required: true},
    imageAttr: { type: String, required: true},
    detailTag: { type: String, required: true },
    detailClass: { type: String, required: true },
    detailAttr: { type: String, required: true },
});

module.exports = mongoose.model('ProductDetail', productDetailSchema);