const mongoose = require('mongoose');

const productDetailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    siteName: { type: String, required: true },
    nameTag: { type: String, required: true },
    nameClass: { type: String, required: false },
    nameAttr: { type: String, required: true },
    nameId: { type: String, required: false },
    priceTag: { type: String, required: true },
    priceClass: { type: String, required: false },
    priceAttr: { type: String, required: true },
    priceId: { type: String, required: false },
    imageClass: { type: String, required: false},
    imageAttr: { type: String, required: true},
    imageId: { type: String, required: false },
    detailTag: { type: String, required: true },
    detailClass: { type: String, required: false },
    detailAttr: { type: String, required: true },
    detailId: { type: String, required: false },
});

module.exports = mongoose.model('Detail', productDetailSchema);