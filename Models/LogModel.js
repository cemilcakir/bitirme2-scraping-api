const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ip: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    searchQuery: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Log', logSchema);