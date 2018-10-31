const mongoose = require('mongoose');

const productDetailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    siteName: { type: String, required: true },
    nameTag: { type: String, required: true },
    nameClass: { type: String, required: true },
    nameAttr: { type: String, required: true },
    nameId: { type: String, required: false },
    priceTag: { type: String, required: true },
    priceClass: { type: String, required: true },
    priceAttr: { type: String, required: true },
    priceId: { type: String, required: false },
    imageClass: { type: String, required: true},
    imageAttr: { type: String, required: true},
    imageId: { type: String, required: false },
    detailTag: { type: String, required: true },
    detailClass: { type: String, required: true },
    detailAttr: { type: String, required: true },
    detailId: { type: String, required: false },
});

module.exports = mongoose.model('Detail', productDetailSchema);