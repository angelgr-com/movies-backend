# Basic MVC file structure

### npm

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

### index.js

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

### router.js

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

### Views

#### UsersRouter

```js
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');

module.exports = router;
```

#### MoviesRouter

```js
const express = require('express');
const router = express.Router();
const MoviesController = require('../controllers/MoviesController');

module.exports = router;
```

#### OrdersRouter

```js
const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');

module.exports = router;
```

### Controller

#### UsersController

```js
const UsersController = {};

module.exports = UsersController;
```

#### MoviesController

```js
const MoviesController = {};

module.exports = MoviesController;
```

#### OrdersController

```js
const OrdersController = {};

module.exports = OrdersController;
```

### Add users, movies and orders endpoints

### index.js

Start the server:

```js
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});
```

### Views

#### UsersRouter

```js
// http://localhost:3000/users/
router.post('/', UsersController.newUser);

// http://localhost:3000/users/:user
router.get('/:user', UsersController.viewUser);

// http://localhost:3000/users/:user/delete
router.delete('/:username', UsersController.deleteUser);

// http://localhost:3000/users/login
router.post('/login', UsersController.login);
```

#### MoviesRouter

```js
router.get('/search/title/:title', MoviesController.searchByTitle);
router.get('/search/id/:id', MoviesController.searchByID);
router.get('/', MoviesController.getAllMovies);
router.get('/filter/genre', MoviesController.filterByGenre);
router.get('/filter/actors', MoviesController.filterByActors);
```
#### OrdersRouter

```js
// http://localhost:3000/orders/
// one movie per user with rent and return date 
router.post('/', OrdersController.newOrder);

// http://localhost:3000/orders/
router.get('/', OrdersController.showOrders);

// http://localhost:3000/orders/id/
router.get('/id/:id', OrdersController.showOrderByID);
```

# Users

## newUser

### Controllers

#### UsersController

```js
const UsersController = {};
const { User } = require('../models/index');

UsersController.newUser = async (req, res) => {
    try {
        User.create({
            name: req.body.name,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            birthdate: req.body.birthdate,
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

## newUserAPI

### Controllers

#### UsersController

```js
UsersController.newUserAPI = async (req, res) => {
    let userAPI = await axios.get(`https://api.parser.name/?api_key=${parsername.api_key}&endpoint=generate&country_code=${parsername.country_code}&results=${PARSER_RESULTS}`);
    const city = ['Valencia', 'Torrent', 'Gandia', 'Paterna', 'Sagunt', 'Mislata', 'Burjassot', 'Ontinyent', 'Aldaia', 'Manises'];
    const randomInt = (min, max) => {
        number = Math.floor(Math.random() * (max - min + 1) + min);
        number < 10 ? number = `0${number}` : number;
        return number;
    }
    let array = [];

    for (let i=0;i<10;i++){
        birthdate = `${randomInt(1930,2006)}`+'-'+
                    `${randomInt(1,12)}`+'-'+
                    `${randomInt(1,28)}`;
        city_random = city[Math.floor(Math.random() * 9) + 0];
        User.create({
            birthdate: birthdate,
            city: city_random,
            name: userAPI.data.data[i].name.firstname.name,
            lastname: userAPI.data.data[i].name.lastname.name,
            gender: userAPI.data.data[i].name.firstname.gender,
            email: userAPI.data.data[i].email.address,
            password: bcrypt.hashSync(userAPI.data.data[i].password, Number.parseInt(authConfig.rounds)),
            username: userAPI.data.data[i].email.username,
        })
        .then(user => {
            array.push(user);
        }).catch((error) => {
            // res.send(error);
            console.log(error);
        });
    }
    res.send(`${PARSER_RESULTS} new users created.`);
};
```

## viewUser

### Controllers

#### UsersController

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

## deleteUser

### Controllers

#### UsersController

```js
UsersController.deleteUser = (req, res) => {
    try {
        User.destroy({
            where : { username : req.params.username }
        })
        .then(removedUser => {
            res.send(`User ${req.params.username} has been removed.`);
        });
    } catch (error) {
        res.send(error);
    }
};
```



## Add password field in User model

#### UsersController

```js
UsersController.newUser = (req, res) => {
    try {
        User.create({
            name: req.body.name,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            birthdate: req.body.birthdate,
        })
        .then(user => {
            console.log("New user created: ", user);
	@@ -38,7 +33,7 @@ UsersController.viewUser = (req, res) => {
    }
};
```

## Encrypt password, JWT and login method

#### npm

```
npm i jsonwebtoken
```

#### auth.js

```js
module.exports = {
    secret: "",
    expires: "",
    rounds: 10
}
```

#### .gitignore

```
/config/auth.js
```

#### UsersController

```js
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');

UsersController.login = (req, res) => {
    User.findOne({
        where : {email : req.body.email}
    })
    .then(User =>{
        if (!User) {
            res.send("Incorrect user or password");
        } else {
            if (bcrypt.compareSync(req.body.password, User.password)) {
                console.log(req.body.password === User.password);

                let token = jwt.sign({ user: User }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });
                res.json({
                    user: User,
                    token: token
                })
            } else {
                res.status(401).json({ msg: "Incorrect user or password." });
            }
        }
    })
    .catch(error => {
        res.send(error);
    })
};
```

# Movies

## getTopRatedMovies

### config

config/TMDB.js

```js
module.exports = {
    api_key: "",
    language: "en-US"
}
```

.gitignore

```
/config/TMDB.js
```



### Views

#### MoviesRouter

```js
router.get('/tmdb/getTopRatedMovies', MoviesController.getTopRatedMovies);
```

### Controllers

#### MoviesController

```js
const TMDB = require('../config/TMDB');
const { default: axios } = require('axios');
const { Movie } = require('../models/index');
let page = 1;

MoviesController.getTopRatedMovies = async (req, res) => {
	// https://developers.themoviedb.org/3/movies/get-top-rated-movies
    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB.api_key}&language=en-US&page=${page}`);
    page++;
    let array = [];
    for (let i=0;i<20;i++){
        let tmdbID = results.data.results[i].id;
        // https://developers.themoviedb.org/3/movies/get-movie-external-ids
        let externalIDs = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}/external_ids?api_key=${TMDB.api_key}&`);
        Movie.create({
            tmdb_id: tmdbID,
            imdb_id: externalIDs.data.imdb_id,
            facebook_id: externalIDs.data.facebook_id,
            instagram_id: externalIDs.data.instagram_id,
            twitter_id: externalIDs.data.twitter_id,
            popularity: results.data.results[i].popularity,
            poster_path: results.data.results[i].poster_path,
            release_date: results.data.results[i].release_date,
            title: results.data.results[i].title,
            video: results.data.results[i].video,
            vote_average: results.data.results[i].vote_average,
            vote_count: results.data.results[i].vote_count,
            id_genre: null,
            id_actor: null,
        })
        .then(movie => {
            array.push(movie)
        })
        .catch((error) => {
            res.send(error);
        });
    }
    res.send(`Top rated movies added.`);
}
```

## addMovieByID

### Views

#### MoviesRouter

```js
router.get('/tmdb/addMovieByID/:id', MoviesController.addMovieByID);
```

### Controllers

#### MoviesController

```js
MoviesController.addMovieByID = async (req, res) => {
    let tmdbID = req.params.id;
    // https://developers.themoviedb.org/3/movies/get-movie-details
    let results = await axios.get(`
    https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${TMDB.api_key}&language=${TMDB.language}`);
    // https://developers.themoviedb.org/3/movies/get-movie-external-ids
    let externalIDs = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}/external_ids?api_key=${TMDB.api_key}&`);
    Movie.create({
        tmdb_id: tmdbID,
        imdb_id: externalIDs.data.imdb_id,
        facebook_id: externalIDs.data.facebook_id,
        instagram_id: externalIDs.data.instagram_id,
        twitter_id: externalIDs.data.twitter_id,
        popularity: results.data.popularity,
        poster_path: results.data.poster_path,
        release_date: results.data.release_date,
        title: results.data.title,
        video: results.data.video,
        vote_average: results.data.vote_average,
        vote_count: results.data.vote_count,
        id_genre: null,
        id_actor: null,
    })
    .then(movie => {
        res.send(`"${results.data.title}" movie added to the database.`);
    })
    .catch((error) => {
        res.send(error);
    });
}
```

## searchByTitle, searchByID, getAllMovies endpoints

### Views

#### MoviesRouter

```js
router.get('/search/title/:title', MoviesController.searchByTitle);
router.get('/search/id/:id', MoviesController.searchByID);
router.get('/', MoviesController.getAllMovies);
```


### Controllers

#### MoviesController

```js
MoviesController.searchByTitle = async (req, res) => {
    try {
        // https://developers.themoviedb.org/3/search/search-movies
        let results = await axios.get(`
        https://api.themoviedb.org/3/search/movie?api_key=${TMDB.api_key}&query=${req.params.title}&language=${TMDB.language}&page=1&include_adult=false`);

        res.send(results.data);
    } catch (error) {
        console.log(error);
    }
}

MoviesController.searchByID = async (req, res) => {
    let id = req.params.id;
    try {
        // https://developers.themoviedb.org/3/movies/get-movie-details
        let results = await axios.get(`
        https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB.api_key}&language=${TMDB.language}`);
        res.send(results.data);
    } catch (error) {
        console.log(error);
    }
}

MoviesController.getAllMovies = (req, res) => {
    Movie.findAll()
    .then(movies => {
        if(movies != 0){
            res.send(movies);
        }else {
            res.send(`There are no movies in the database.`);
        }
    }).catch(error => {
        res.send(error);
    });
}
```

# Orders

## newOrder

### Views

#### OrdersRouter

```js
router.post('/', OrdersController.newOrder);
```

### Controllers

#### OrdersController

```
const { Order } = require('../models/index');

OrdersController.newOrder = (req, res) => {

    const jsDateToSQL = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day =  date.getDate();
        
        // Add a zero if month or day are below 10
        month < 10 ? (month = '0' + month) : month;
        day < 10 ? (day = '0' + day) : day;
        
        return(`${year}-${month}-${day}`);
    }

    const RENTAL_PERIOD = 2;
    let rent_date = new Date();
    let return_date = new Date();
    // Calculate return date as rent date plus rental period
    return_date.setDate(rent_date.getDate() + RENTAL_PERIOD);
    jsDateToSQL(rent_date);
    jsDateToSQL(return_date);

    Order.create({
        rent_date: rent_date,
        return_date: return_date,
        id_user: req.body.id_user,
        is_paid: req.body.is_paid,
    })
    .then(movie => {
        res.send(`User '${req.body.id_user}' has placed a new order.`);
    })
    .catch((error) => {
        res.send(error);
    });
}
```

## showOrders and showOrdersByID

### Views

#### OrdersRouter

```js
router.get('/', OrdersController.showOrders);
router.get('/id/:id', OrdersController.showOrderByID);
```


### Controller

#### OrdersController

```js
OrdersController.showOrders = (req, res) => {
    Order.findAll()
    .then(orders => {
        if(orders != 0){
            res.send(orders);
        }else {
            res.send(`There are no orders in the database.`);
        }
    }).catch(error => {
        res.send(error);
    });
}

OrdersController.showOrderByID = (req, res) => {
    Order.findOne({
        where : { id : req.params.id }
    })
    .then(order => {
        if(order != 0){
            res.send(order);
        }else {
            res.send(`There are no orders with id ${req.params.id}.`);
        }
    }).catch(error => {
        res.send(error);
    });
}
```

## showOrdersByCity

### Views

#### OrdersRouter

```js
// http://localhost:3000/orders/by/city
router.get('/by/city/:city', OrdersController.showOrdersByCity);
```


### Controller

#### OrdersController

```js
OrdersController.showOrdersByCity = async (req, res) => {
    let query;
    if (req.params.city) {
        query = `
    SELECT 
      users.city AS City, 
      users.name AS Name, 
      users.lastname AS Lastname, 
      orders.rent_date AS 'Rent date' 
    FROM users 
    INNER JOIN orders ON users.id = orders.id_user 
    WHERE city = '${req.params.city}' 
    ORDER BY City ASC
    `;
    } else {
        query = `
    SELECT 
      users.city AS City, 
      users.name AS Name, 
      users.lastname AS Lastname, 
      orders.rent_date AS 'Rent date' 
    FROM users 
    INNER JOIN orders ON users.id = orders.id_user 
    ORDER BY City ASC
    `;
    }

    let result = await Order.sequelize.query(query, {
        type: Order.sequelize.QueryTypes.SELECT,
    });

    if (result) {
        res.send(result);
    }
};
```

# Models

## newUser

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
sequelize model:generate --name User --attributes username:string,name:string,lastname:string,gender:string,birthdate:dateonly,email:string,password:string,city:string
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

## getTopRatedMovies

Generate Movie model.

```js
sequelize model:generate --name Movie --attributes tmdb_id:string,facebook_id:string,instagram_id:string,twitter_id:string,popularity:decimal,poster_path:string,release_date:dateonly,title:string,video:string,vote_average:decimal,vote_count:decimal,id_genre:integer,id_actor:integer
```

It should return a message similar to:

```
New model was created at (...)\models\movie.js .
New migration was created at (...)\migrations\(...)-create-movie.js
```

Migrate:

```
sequelize db:migrate
```

Test OrdersController.newUser method with postman:

GET:

```
http://localhost:3000/tmdb/getTopRatedMovies
```

### newOrder

Generate Order model.

```js
sequelize model:generate --name Order --attributes rent_date:dateonly,return_date:dateonly,id_user:integer,is_paid:boolean
```

Generate Copy model.

```
sequelize model:generate --name Copy --attributes id_order:integer,id_movie:integer
```

Migrate:

```
sequelize db:migrate
```

Define associations:

- order.js:

  - In model:

    ```js
        static associate(models) {
          // define association here
          this.belongsTo(models.User, {
            foreignKey: 'id_user'
          });
        }
    ```

  - In migration:

    ```js
          id_user: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'User',
              key: 'id'
            }
          },
    ```

- copy.js:

  - In model:

    ```js
    static associate(models) {
          // define association here
          this.belongsTo(models.Order, {
            foreignKey: 'id_order'
          });
          this.belongsTo(models.Movie, {
            foreignKey: 'id_movie'
          });
        }
    ```

  - In migration:

    ```js
          id_order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Orders',
              key: 'id'
            }
          },
          id_movie: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'Movies',
              key: 'id'
            }
          },
    ```

### 



# Commit N

### npm

Add to .gitignore

```

```

### router.js

```js

```

### Views

#### UsersRouter

```js
```

#### MoviesRouter

```js
```
#### OrdersRouter

```js
```


### Controllers

#### UsersController

```js
```

#### MoviesController

```js
```
#### OrdersController

```js
```
