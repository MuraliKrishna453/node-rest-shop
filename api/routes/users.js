const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            })
            user.save().then(doc => {
                res.status(201).json({
                    message: "User saved" + doc._id
                });
            }).catch(error => console.log(error))
        }
    })
})


router.post('/signin', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(doc => {
            if (doc.length == 0) {
                return res.status(401).json({ message: "Auth Failed" })
            } else {
                bcrypt.compare(req.body.password, doc[0].password, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const token = jwt.sign({
                                email: doc[0].email,
                                password: doc[0].password
                            },
                            process.env., {
                                expiresIn: "1h"
                            });
                        res.status(200).json({
                            message: "Auth Successfully",
                            token: token
                        });
                    }
                })
            }
        }).catch(error => console.log(error))
})







module.exports = router