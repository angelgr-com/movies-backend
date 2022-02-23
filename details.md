# Basic MVC file structure

## npm



```bash
npm init
npm i axios bcrypt cors express mysql2 nodemon sequelize
```

Create .gitignore file

```
/node_modules
```

Remove caret symbol (^) in package.json dependencies:

```
  "dependencies": {
    "axios": "0.26.0",
    "bcrypt": "5.0.1",
    "cors": "2.8.5",
    "express": "4.17.3",
    "mysql2": "2.3.3",
    "nodemon": "2.0.15",
    "sequelize": "6.16.2"
   }
```

Add in package.json (we will start server with 'npm run dev')

```
"dev": "nodemon index.js",
```

## index.js

Import cors, express and router: 

```js
const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router');
```

Use middlewares ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and express) and router:

```js
let corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());
```

## router.js

```js
const router = require('express').Router();
const UsersRouter = require('./views/UsersRouter');
const MoviesRouter = require('./views/MoviesRouter');
const OrdersRouter = require('./views/OrdersRouter');

router.use('/users', UsersRouter);
router.use('/movies', MoviesRouter);
router.use('/orders', OrdersRouter);

module.exports = router;
```

## Views

### UsersRouter

```js
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');

module.exports = router;
```

### MoviesRouter

```js
const express = require('express');
const router = express.Router();
const MoviesController = require('../controllers/MoviesController');

module.exports = router;
```

### OrdersRouter

```js
const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');

module.exports = router;
```

## Controller

### UsersController

```js
const UsersController = {};

module.exports = UsersController;
```

### MoviesController

```js
const MoviesController = {};

module.exports = MoviesController;
```

### OrdersController

```js
const OrdersController = {};

module.exports = OrdersController;
```

# Add users, movies and orders endpoints

## index.js

Start the server:

```js
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});
```

## Views

### UsersRouter

```js
// http://localhost:3000/users/
router.post('/', UsersController.newUser);

// http://localhost:3000/users/:user
router.get('/:user', UsersController.viewUser);

// http://localhost:3000/users/:user/delete
router.delete('/:user/delete', UsersController.deleteUser);

// http://localhost:3000/users/login
router.post('/login', UsersController.login);
```

### MoviesRouter

```js
router.get('/search/title/:title', MoviesController.searchByTitle);
router.get('/search/id/:id', MoviesController.searchByID);
router.get('/', MoviesController.getAllMovies);
router.get('/filter/genre', MoviesController.filterByGenre);
router.get('/filter/actors', MoviesController.filterByActors);
```
### OrdersRouter

```js
// http://localhost:3000/orders/
// one movie per user with rent and return date 
router.post('/', OrdersController.newOrder);

// http://localhost:3000/orders/
router.get('/', OrdersController.showOrders);

// http://localhost:3000/orders/id/
router.get('/id/:id', OrdersController.showOrderByID);
```

# Add OrdersController.newUser method

## Controllers

### UsersController

```js
const UsersController = {};
const { User } = require('../models/index');

UsersController.newUser = async (req, res) => {
    try {
        let name = req.body.name;
        let lastname = req.body.lastname;
        let username = req.body.username;
        let email = req.body.email;
        let birthdate = req.body.birthdate;

        User.create({
            name: name,
            lastname: lastname,
            username: username,
            email: email,
            birthdate: birthdate,
        })
        .then(user => {
            console.log("New user created: ", user);
            res.send(`${user.name}, welcome`);
        });
    } catch (error) {
        res.send(error);
    }
}

module.exports = UsersController;
```

## sequelize

Execute in terminal:

```js
sequelize init
```

If we have not done it before, we will need:

```
npm i sequelize-cli -g
npm init -y
npm install express sequelize mysql2
```

Add database configuration in config/config.json.

Add it to .gitignore as contains db password an make a copy as an example:

```
/config/config.json
```

Generate User model.

```
sequelize model:generate --name User --attributes name:string,lastname:string,username:string,email:string,birthdate:dateonly
```

It should return a message similar to:

```
New model was created at (...)\models\user.js .
New migration was created at (...)\migrations\(...)-create-user.js
```

Create and migrate:

```
sequelize db:create
sequelize db:migrate
```

Test OrdersController.newUser method with postman:

POST:

```
http://localhost:3000/users
```

Body:

```
{
    "name": "John",
    "lastname": "Doe",
    "username": "johndoe",
    "email": "john@doe.com",
    "birthdate": "1950-01-01"
}
```

Response:

```
John, welcome
```

# Add OrdersController.viewUser method

## Controllers

### UsersController

```js
UsersController.viewUser = (req, res) => {
    try {      
        User.findOne({
            where : { username : req.params.username }
        })
        .then(data => {
            res.send(data)
        });
    } catch (error) {
        res.send(error);
    }
};
```

# Commit N

## npm

Add to .gitignore

```

```

## router.js

```js

```

## Views

### UsersRouter

```js

```

### MoviesRouter

```js

```

### OrdersRouter

```js

```


## Controllers

### UsersController

```js

```

### MoviesController

```js

```

### OrdersController

```
```



# Commit N

## npm

Add to .gitignore

```

```

## router.js

```js

```

## Views

### UsersRouter

```js
```

### MoviesRouter

```js
```
### OrdersRouter

```js
```


## Controllers

### UsersController

```js
```

### MoviesController

```js
```
### OrdersController

```js
```
