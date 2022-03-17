const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');

// http://localhost:5000/orders/
// one movie per user with rent and return date 
router.post('/', OrdersController.newOrder);

// http://localhost:5000/orders/
router.get('/', OrdersController.showOrders);

// http://localhost:5000/orders/id/
router.get('/id/:id', OrdersController.showOrderByID);

// http://localhost:5000/orders/by/city
router.get('/by/city/:city', OrdersController.showOrdersByCity);

module.exports = router;