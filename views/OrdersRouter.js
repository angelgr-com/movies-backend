const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');

// http://localhost:3000/orders/
// one movie per user with rent and return date 
// router.post('/', OrdersController.newOrder);

// http://localhost:3000/orders/
// router.get('/', OrdersController.showOrders);

// http://localhost:3000/orders/id/
// router.get('/id/:id', OrdersController.showOrderByID);

module.exports = router;