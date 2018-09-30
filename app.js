const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParder = require('body-parser');
const mongoose = require('mongoose');
const SearchRoutes = require('./Routes/SearchRoutes');
const SiteRoutes = require('./Routes/SiteRoutes');

mongoose.connect("mongodb://root:root@localhost:27017/admin", { useNewUrlParser: true }, function (err, db) {
    if(err) throw err;
});


app.use(morgan('dev'));
app.use(bodyParder.urlencoded({extended:false}));
app.use(bodyParder.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/api/search', SearchRoutes);
app.use('/api/site', SiteRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


module.exports = app;