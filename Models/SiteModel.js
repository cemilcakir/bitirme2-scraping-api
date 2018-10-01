const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    baseUrl: { type: String, required: true },
    searchRoute: { type: String, required: true }
});

module.exports = mongoose.model('Site', siteSchema);