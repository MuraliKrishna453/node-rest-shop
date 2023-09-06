const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

const OrderController = require('../controllers/orders');


router.get('/', OrderController.get_all_orders);

router.post('/', (req, res, next) => {
    // const order = {
    //     productId: req.body.productId,
    //     quantity: req.body.quantity
    // };
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        quantiy: req.body.quantiy

    });
    order.save().then(doc => {
        res.status(200).json({
            message: 'Handling POST requests to /orders',
            product: doc
        });
    }).catch(error => console.log(error))

})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {

                res.status(200).json({
                    id: id,
                    order: doc

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

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findOneAndRemove({ "_id": id })
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: 'Order Deleted'

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