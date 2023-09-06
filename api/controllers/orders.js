const Order = require('../models/order');

exports.get_all_orders = (req, res, next) => {
    Order.find().populate('product', ['name', 'price']).exec().then(orders => {
        res.status(200).json({
            message: 'Handling GET requests to /orders',
            count: orders.length,
            orders: orders.map(doc => {
                return {
                    product: doc.product,
                    quantity: doc.quantity,
                    _id: doc._id
                }

            })
        });
    }).catch(error => {
        res.status(500).json({
            message: error,
        });
    });

}