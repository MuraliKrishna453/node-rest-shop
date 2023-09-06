const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');


const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});
const uploads = multer({ storage: storage });
const Product = require('../models/product');


router.get('/', (req, res, next) => {

    Product.find()
        .select('name price image _id')
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        image: "http://localhost:3000/" + doc.image,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    }
                })

            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: error

            });
        });
})

router.post('/', checkAuth, uploads.single('productFile'), (req, res, next) => {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.file.path
    });
    product.save().then(doc => {
        console.log(doc);
        res.status(200).json({
            message: 'Handling POST requests to /products',
            product: {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + doc._id
                }
            }
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: error

        });
    });

})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {

                res.status(200).json({
                    id: id,
                    product: doc

                });
            } else {

                res.status(404).json({
                    id: id,
                    message: 'Not Found'

                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: error

            });
        });
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOPs = {};
    for (const ops of req.body) {
        updateOPs[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOPs })
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {

                res.status(200).json({
                    id: id,
                    product: doc

                });
            } else {

                res.status(404).json({
                    id: id,
                    message: 'Not Found'

                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: error

            });
        });
})


router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findOneAndRemove({ "_id": id })
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: 'Product Deleted'

            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: error

            });
        });
})

module.exports = router;