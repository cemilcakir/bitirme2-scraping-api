const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    url: { type: String, required: true },
    searchRoute: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);