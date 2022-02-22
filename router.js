const router = require('express').Router();
const UsersRouter = require('./views/UsersRouter');
const MoviesRouter = require('./views/MoviesRouter');
const OrdersRouter = require('./views/OrdersRouter');

router.use('/users', UsersRouter);
router.use('/movies', MoviesRouter);
router.use('/orders', OrdersRouter);

module.exports = router;