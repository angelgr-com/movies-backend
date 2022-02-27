# movies-backend

A server-side web API (*application programming interface*) for a video store created with Node.js, Express.js and Sequelize ORM.

## Table of contents

- [movies-backend](#movies-backend)
  - [Table of contents](#table-of-contents)
  - [General info](#general-info)
  - [Technologies](#technologies)
  - [API endpoints](#api-endpoints)
    - [Users](#users)
    - [Movies](#movies)
    - [Orders](#orders)
  - [Setup](#setup)

## General info

- 🎯 The **objective** of this project is to build an **API REST backend** using **CRUD** operations to store information in a **SQL database**. Based on an **MVC structure**, API calls follow this process: 
  - *index.js -> router.js -> views -> controllers*

- 🧩 It also, in turn, makes calls to two APIs:

  - **The Movie Database (TMDB)** (https://www.themoviedb.org/) -> to obtain movie data.
    	![tmdb](.\assets\tmdb.gif)

  - **Name parser** (https://parser.name/) -> to generate fictitious user names.

    ​	![name.parser](.\assets\nameparser.gif)

- 🎬 It recreates the **functionality** used by a **video store** to lend copies of movies to its customers.

  ![db-workbench](.\assets\db_workbench.jpg)

## Technologies

- Javascript ES6, Node.js, Express.js
  			![nodejs](.\assets\nodejs.gif)
    		![expressjs](.\assets\expressjs.gif)

- JSON Web Tokens, Sequelize ORM, SQL

  ​		![sequelize](.\assets\sequelizejs.gif)
  ​		![jwt](.\assets\jwt.gif)

- Postman to test the API endpoints

  ​		![postman](.\assets\postman.gif)

## API endpoints

### Users

- newUser
  - http://localhost:3000/users/
  - router.post('/', UsersController.newUser);

- newUserAPI
  - http://localhost:3000/users/
  - router.get('/', UsersController.newUserAPI);

- viewUser
  - http://localhost:3000/users/:username
  - router.get('/:username', UsersController.viewUser);

- deleteUser
  - http://localhost:3000/users/:user/delete
  - router.delete('/:username', UsersController.deleteUser);

- login
  - http://localhost:3000/users/login
  - router.post('/login', UsersController.login);

### Movies

- getTopRatedMovies
  - http://localhost:3000/movies/getTopRatedMovies
  - router.get('/getTopRatedMovies', MoviesController.getTopRatedMovies);

- addMovieByID
  - http://localhost:3000/movies/addMovieByID/:id
  - router.get('/addMovieByID/:id', MoviesController.addMovieByID);
- searchByTitle
  - http://localhost:3000/movies/search/title/:title
  - router.get('/search/title/:title', MoviesController.searchByTitle);

- searchByID
  - http://localhost:3000/movies/search/id/:id
  - router.get('/search/id/:id', MoviesController.searchByID);

- getAllMovies
  - http://localhost:3000/movies/
  - router.get('/', MoviesController.getAllMovies);

### Orders

- newOrder
  - http://localhost:3000/orders/
  - router.post('/', OrdersController.newOrder);

- showOrders
  - http://localhost:3000/orders/
  - router.get('/', OrdersController.showOrders);

- showOrderByID
  - http://localhost:3000/orders/id/:id
  - router.get('/id/:id', OrdersController.showOrderByID);

- showOrdersByCity
  - http://localhost:3000/orders/by/city
  - router.get('/by/city/:city', OrdersController.showOrdersByCity);

## Setup

- Clone or download this repository.

- In config folder, remove .example extensions (extension will become .js), open these renamed files and insert API keys.

- Install dependencies:

  ```
  npm i
  ```

- To generate models use **sequelize-cli** following these instructions:

  - Install sequelize-cli

    ```
    npm i sequelize-cli -g
    ```

  - Generate User model

    ```
    sequelize model:generate --name User --attributes username:string,name:string,lastname:string,gender:string,birthdate:dateonly,email:string,password:string,city:string
    ```

  - Generate Movie model

    ```
    sequelize model:generate --name Movie --attributes tmdb_id:string,facebook_id:string,instagram_id:string,twitter_id:string,popularity:decimal,poster_path:string,release_date:dateonly,title:string,video:string,vote_average:decimal,vote_count:decimal,id_genre:integer,id_actor:integer
    ```

  - Generate Order model

    ```
    sequelize model:generate --name Order --attributes rent_date:dateonly,return_date:dateonly,id_user:integer,is_paid:boolean
    ```

  - Generate Copy model

    ```
    sequelize model:generate --name Copy --attributes id_order:integer,id_movie:integer
    ```

  - Create database:

    ```
    sequelize db:create
    ```

  - Define associations

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
