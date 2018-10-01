const User = require('../Models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtKey = require('../Values');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(email && password){
        User.find({email: email})
        .exec()
        .then(user => {
           if(user.length < 1) {
               res.status(401).json({
                   response: "Auth failed."
               });
           }
           else {
               bcrypt.compare(password, user[0].password, (err,result) => {
                   if(err){
                        res.status(401).json({
                            response: "Auth failed."
                        });
                   }
                   if(result) {
                       const token = jwt.sign({
                           email: user[0].email,
                           userId: user[0]._id
                        },
                        jwtKey.jwtKey,
                        {
                            expiresIn: "1h"
                        });
                        return res.status(200).json({
                            response: true,
                            token: token
                        })
                   }
                   else {
                        res.status(401).json({
                            response: "Auth failed."
                        });
                   }
               });
           }
        })
        .catch(err => {
            res.status(500).json({
                response: err
            });
        })
    }
    else{
        res.status(428).json({
            response: "Please send email and password data."
        });
    }
}

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    if(email && password && password2 && password == password2 && req.user.email == "cemilcakir@outlook.com.tr"){
        const user = User.find({email: email})
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    response: "User exists."
                })
            }
            else{
                bcrypt.hash(password, 10, (error, hash) => {
                    if(error){
                        return res.status(500).json({
                            response: error
                        })
                    }
                    else{
                        const newUser = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: email,
                            password: hash
                        });
                        newUser.save()
                        .then(result => {
                            res.status(201).json({
                                response: 'User created.'
                            });
                        })
                        .catch(errorInserting => {
                            res.json(500).json({
                                response: errorInserting
                            });
                        })
                    }
                });
            }
        })
        .catch(err => {
            res.status(200).json({
                response: err
            });
        });
    }
    else{
        return res.status(428).json({
            response: "Please send 'email', 'password', 'password2' body data and be sure passwords are matching."
        })
    }
}