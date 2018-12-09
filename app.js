const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParder = require('body-parser');
const mongoose = require('mongoose');
const SearchRoutes = require('./Routes/SearchRoutes');
const DetailRoutes = require('./Routes/DetailRoutes');
const SiteRoutes = require('./Routes/SiteRoutes');
const AuthRoutes = require('./Routes/AuthRoutes');
const LogRoutes = require('./Routes/LogRoutes');
const values = require('./Values');

mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://cemil:" + values.MONGO_ATLAS_PASSWORD + "@webscrapingdb-shard-00-00-vtccl.mongodb.net:27017,webscrapingdb-shard-00-01-vtccl.mongodb.net:27017,webscrapingdb-shard-00-02-vtccl.mongodb.net:27017/test?ssl=true&replicaSet=WebScrapingDB-shard-0&authSource=admin&retryWrites=true", { useNewUrlParser: true }, function (err, db) {
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
app.use('/api/details', DetailRoutes);
app.use('/api/sites', SiteRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/history', LogRoutes);

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