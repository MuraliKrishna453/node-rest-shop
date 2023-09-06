const express = require('express');

const app = express();

const morgan = require('morgan');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'it works'
//     });
// });


mongoose.connect('mongodb://admin:root@cluster0-shard-00-00-rm0fe.mongodb.net:27017,cluster0-shard-00-01-rm0fe.mongodb.net:27017,cluster0-shard-00-02-rm0fe.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type,Accept, Authorization');
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods',
            'PUT,PATCH,POST,GET,DELETE'
        );
        return res.status(200).json({});
    }
    next();
});

//products
app.use('/products', productRoutes);
//orders
app.use('/orders', orderRoutes);
//users
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;