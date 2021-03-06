const OrdersController = {};
const { Order } = require('../models/index');
const { v4: uuidv4 } = require('uuid');

OrdersController.newOrder = (req, res) => {
  const RENTAL_PERIOD = 3;
  let rent_date = new Date();
  let return_date = new Date();
  
  const jsDateToSQL = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Add a zero if month or day are below 10
    month < 10 ? (month = '0' + month) : month;
    day < 10 ? (day = '0' + day) : day;

    return `${year}-${month}-${day}`;
  };

  // Calculate return date as rent date plus rental period
  return_date.setDate(rent_date.getDate() + RENTAL_PERIOD);
  jsDateToSQL(rent_date);
  jsDateToSQL(return_date);

  // Save order in database
  Order
  .create({
    id: uuidv4(),
    rent_date: rent_date,
    return_date: return_date,
    id_user: req.body.id_user,
    id_movie: req.body.id_movie,
  })
  .then(order => {
      res.send(`User '${req.body.id_user}' has placed a new order.`);
  })
  .catch(error => {
      res.send(error);
  });
};

OrdersController.getOrders = (req, res) => {
  Order.findAll()
  .then((orders) => {
    if (orders != 0) {
      res.send(orders);
    }
    else {
      res.send(`There are no orders in the database.`);
    }
  })
  .catch((error) => {
    res.send(error);
  });
};

OrdersController.getOrderByID = (req, res) => {
  Order
  .findOne({
    where: { id: req.params.id },
  })
  .then((order) => {
    if (order != 0) {
      res.send(order);
    } else {
      res.send(`There are no orders with id ${req.params.id}.`);
    }
  })
  .catch((error) => {
    res.send(error);
  });
};

OrdersController.getOrdersByUserID = (req, res) => {
  Order
  .findOne({
    where: { id_user: req.params.id_user },
  })
  .then((order) => {
    if (order != 0) {
      res.send(order);
    } else {
      res.send(`There are no orders.`);
    }
  })
  .catch((error) => {
    res.send(error);
  });
};

// OrdersController.getOrdersByCity = async (req, res) => {
//     let query;
//     if (req.params.city) {
//         console.log('req.params.city = ', req.params.city);
//         query = `
//     SELECT 
//       users.city AS City, 
//       users.name AS Name, 
//       users.lastname AS Lastname, 
//       orders.rent_date AS 'Rent date' 
//     FROM users 
//     INNER JOIN orders ON users.id = orders.id_user 
//     WHERE city = '${req.params.city}' 
//     ORDER BY City ASC
//     `;
//     } else {
//         query = `
//     SELECT 
//       users.city AS City, 
//       users.name AS Name, 
//       users.lastname AS Lastname, 
//       orders.rent_date AS 'Rent date' 
//     FROM users 
//     INNER JOIN orders ON users.id = orders.id_user 
//     ORDER BY City ASC
//     `;
//     }

//     let result = await Order.sequelize.query(query, {
//         type: Order.sequelize.QueryTypes.SELECT,
//     });

//     if (result) {
//         res.send(result);
//     }
// };

module.exports = OrdersController;
