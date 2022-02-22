# NPM

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

# index.js

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

# router.js

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

# Views

## UsersRouter

```js
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');

module.exports = router;
```

## MoviesRouter

```js
const express = require('express');
const router = express.Router();
const MoviesController = require('../controllers/MoviesController');

module.exports = router;
```

## OrdersRouter

```js
const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');

module.exports = router;
```

# Controller

UsersController

```js
const UsersController = {};

module.exports = UsersController;
```

MoviesController

```js
const MoviesController = {};

module.exports = MoviesController;
```

OrdersController

```js
const OrdersController = {};

module.exports = OrdersController;
```

