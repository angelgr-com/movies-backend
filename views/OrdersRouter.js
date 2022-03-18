const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');

// {
//   "id_user": "7c0e9806-aeab-4740-aece-90f9ac2271ee",
//   "id_movie": "8ca6f9c2-c3ed-4000-b9ee-24028f67ba44"
// }
// http://localhost:5000/orders/
// one movie per user with rent and return date
router.post('/', OrdersController.newOrder);

// http://localhost:5000/orders/
router.get('/', OrdersController.getOrders);

// http://localhost:5000/orders/id/
router.get('/id/:id', OrdersController.getOrderByID);

module.exports = router;