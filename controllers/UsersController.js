const UsersController = {};
const { User } = require('../models/index');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const authConfig = require('../config/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const parsername = require('../config/parsername');
const PARSER_RESULTS = 10;
const data = require('../config/ghUsers');
let ghUsers = data.ghUsers;

UsersController.viewAllUsers = (req, res) => {
  User.findAll()
  .then(data => {
    res.send(data)
  });
};

UsersController.viewUser = (req, res) => {
  try {      
    User.findOne({
      where : { username : req.params.username }
    })
    .then(data => {
      res.send(data)
    });
  } 
  catch (error) {
    res.send(error);
  }
};

// randomInt for newBirthdate function
const randomInt = (min, max) => {
  number = Math.floor(Math.random() * (max - min + 1) + min);
  number < 10 ? number = `0${number}` : number;
  return number;
}
const newBirthdate = () => `
  ${randomInt(1930,2006)}-
  ${randomInt(1,12)}-
  ${randomInt(1,28)}
`;

// Array for randomCity
const city = ['Valencia', 'Torrent', 'Gandia', 'Paterna', 'Sagunt', 'Mislata', 'Burjassot', 'Ontinyent', 'Aldaia', 'Manises'];

UsersController.newUser = (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  const birthdate = newBirthdate();
  randomCity = city[Math.floor(Math.random() * 9) + 0];

  // Check if user exists to avoid duplicates
  User.findOne({
    where : {
      [Op.or] : [
        {
          email : {
            [Op.like] : email
          }
        },
        {
          username : {
            [Op.like] : username
          }
        }
      ]
    }
  }).
  then(userExists => {
    if (userExists != null) {
      res.send("The username or email already exists in our database. Please, check your data.");
    } 
    else {
      try {
        User.create({
          id: uuidv4(),
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds)),
          gender: req.body.username,
          birthdate: req.body.birthdate || birthdate,
          city: req.body.city || randomCity,
        })
        .then(user => {
          res.status(201).send(`New user created. ${user.name}, welcome.`);
        });
      } catch (error) {
        res.status(400).send(`
          Incorrect syntax. Please, check your request. ${error}
        `);
      }
    }
  }).
  catch(error => {
    console.log(error)
  });
};

UsersController.newUsersAPI = async (req, res) => {
  const userAPI = await axios.get(`
    https://api.parser.name/?api_key=${parsername.api_key}&endpoint=generate&country_code=${parsername.country_code}&results=${PARSER_RESULTS}
  `);
  const array = [];
  
  for (let i=0;i<PARSER_RESULTS;i++) {
    let email = userAPI.data.data[i].email.address; 
    let username = userAPI.data.data[i].email.username;
    // Check if user exists to avoid duplicates
    User.findOne({
      where : {
        [Op.or] : [
          {
            email : {
              [Op.like] : email
            }
          },
          {
            username : {
              [Op.like] : username
            }
          }
        ]
      }
    }).
    then(userExists => {
      if (userExists != null) {
        res.status(400).send("The username or email already exists in our database. Please, check your data.");
      } 
      else {
        birthdate = `${randomInt(1930,2006)}`+'-'+
                    `${randomInt(1,12)}`+'-'+
                    `${randomInt(1,28)}`;
        randomCity = city[Math.floor(Math.random() * 9) + 0];
  
        User.create({
          id: uuidv4(),
          name: userAPI.data.data[i].name.firstname.name,
          username: userAPI.data.data[i].email.username,
          email: userAPI.data.data[i].email.address,
          password: bcrypt.hashSync(userAPI.data.data[i].password,
                                    Number.parseInt(authConfig.rounds)),
          gender: userAPI.data.data[i].name.firstname.gender,
          birthdate: birthdate,
          city: randomCity,
        })
        .then(user => {
          array.push(user);
          if (i === 9) {
            res.status(201).send(`
              ${array.length} new users have been added.
            `);
          }
        }).catch((error) => {
          res.status(400).send(`
            Incorrect syntax. Please, check your request. ${error}
          `);
        });
      }
    }).
    catch(error => {
      console.log(error)
    });
  }
};

UsersController.newGhUsers = async (req, res) => {
  const userAPI = await axios.get(`
    https://api.parser.name/?api_key=${parsername.api_key}&endpoint=generate&country_code=${parsername.country_code}&results=${21}
  `);
  const array = [];

  for (let i=0;i<21;i++) {
    let email = ghUsers[i].email;
    let username = ghUsers[i].username;
    // Check if user exists to avoid duplicates
    User.findOne({
      where : {
        [Op.or] : [
          {
            email : {
              [Op.like] : email
            }
          },
          {
            username : {
              [Op.like] : username
            }
          }
        ]
      }
    }).
    then(userExists => {
      if (userExists != null) {
        console.log(`The user ${ghUsers[i].username} was already registered.`)
        // res.status(400).send("The username or email already exists in our database. Please, check your data.");
      } 
      else {
        birthdate = `${randomInt(1930,2006)}`+'-'+
                    `${randomInt(1,12)}`+'-'+
                    `${randomInt(1,28)}`;
        randomCity = city[Math.floor(Math.random() * 9) + 0];
        
        User.create({
          id: uuidv4(),
          name: ghUsers[i].name,
          username: ghUsers[i].username,
          email: ghUsers[i].email,
          password: bcrypt.hashSync(
            '1234',
            Number.parseInt(authConfig.rounds)
          ),
          gender: ghUsers[i].gender,
          birthdate: birthdate,
          city: randomCity,
        })
        .then(user => {
          array.push(user);
          if (i === 20) {
            res.status(201).send(`
              ${array.length} new users have been added.
            `);
          }
        }).catch((error) => {
          res.status(400).send(`
            Incorrect syntax. Please, check your request. ${error}
          `);
        });
      }
    }).
    catch(error => {
      console.log(error)
    });
  }
};

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

UsersController.login = (req, res) => {
    User.findOne({
        where : {email : req.body.email}
    })
    .then(User =>{
        if (!User) {
            res.send("Incorrect user or password");
        } else {
            if (bcrypt.compareSync(req.body.password, User.password)) {
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

module.exports = UsersController;