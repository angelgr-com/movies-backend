const OrdersController = {};
const { Order } = require('../models/index');

OrdersController.newOrder = (req, res) => {

    const RENTAL_PERIOD = 2;
    let rent_date = new Date();
    let return_date = new Date();
    const jsDateToSQL = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day =  date.getDate();
    
        // Add a zero if month or day are below 10
        month < 10 ? (month = '0' + month) : month;
        day < 10 ? (day = '0' + day) : day;
        
        return(`${year}-${month}-${day}`);
    }
    // Calculate return date as rent date plus rental period
    return_date.setDate(rent_date.getDate() + RENTAL_PERIOD);
    jsDateToSQL(rent_date);
    jsDateToSQL(return_date);

    Order.create({
        rent_date: rent_date,
        return_date: return_date,
        id_user: req.body.id_user,
    })
    .then(movie => {
        res.send(`User '${req.body.id_user}' has placed a new order.`);
    })
    .catch((error) => {
        res.send(error);
    });
}

module.exports = OrdersController;