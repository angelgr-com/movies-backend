const UsersController = {};
const { User } = require('../models/index');
const authConfig = require('../config/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const parsername = require('../config/parsername');
const PARSER_RESULTS = 10;
import {ghUsers, randomInt, newBirthdate} from '../config/ghUsers';

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

// Arrow function to check if user exists
const userExists = (email, username) => {
  Usuario.findAll({
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
  }).then(userExists => {
    if(userExists) {
      return true;
    } else {
      return false
    }
  }).catch(error => {
      res.send(error)
  });
}

const city = ['Valencia', 'Torrent', 'Gandia', 'Paterna', 'Sagunt', 'Mislata', 'Burjassot', 'Ontinyent', 'Aldaia', 'Manises'];

UsersController.newUser = (req, res) => {
  const birthdate = newBirthdate();
  randomCity = city[Math.floor(Math.random() * 9) + 0];

  if (userExists(req.body.email, req.body.username)) {
    res.send("The username or email already exists in our database. Please, check your data.");
  } 
  else {
    try {
      User.create({
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
};

UsersController.newUsersAPI = async (req, res) => {
  const userAPI = await axios.get(`
    https://api.parser.name/?api_key=${parsername.api_key}&endpoint=generate&country_code=${parsername.country_code}&results=${PARSER_RESULTS}
  `);
  const array = [];

  for (let i=0;i<10;i++){
    if (userExists(
      userAPI.data.data[i].email.address,
      userAPI.data.data[i].email.username
    )) {
      res.send("The username or email already exists in our database. Please, check your data.");
    }
    else {
      birthdate = `${randomInt(1930,2006)}`+'-'+
                  `${randomInt(1,12)}`+'-'+
                  `${randomInt(1,28)}`;
      randomCity = city[Math.floor(Math.random() * 9) + 0];

      User.create({
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
      }).catch((error) => {
        res.status(400).send(`
          Incorrect syntax. Please, check your request. ${error}
        `);
      });
    }
    res.status(201).send(`${PARSER_RESULTS} new users created.`);
  }
};

UsersController.newGhUsers = async (req, res) => {
  const userAPI = await axios.get(`
    https://api.parser.name/?api_key=${parsername.api_key}&endpoint=generate&country_code=${parsername.country_code}&results=${21}
  `);
  const array = [];

  for (let i=0;i<ghUsers.length;i++) {
    if (userExists(ghUsers[i].email, ghUsers[i].username)) {
      res.status(400).send("The username or email already exists in our database. Please, check your data.");
    }
    else {
      birthdate = `${randomInt(1930,2006)}`+'-'+
                  `${randomInt(1,12)}`+'-'+
                  `${randomInt(1,28)}`;
      randomCity = city[Math.floor(Math.random() * 9) + 0];
      User.create({
        name: ghUsers[i].name,
        username: ghUsers[i].username,
        email: ghUsers[i].email,
        password: bcrypt.hashSync(
          userAPI.data.data[i].password,
          Number.parseInt(authConfig.rounds)
        ),
        gender: ghUsers[i].gender,
        birthdate: birthdate,
        city: randomCity,
      })
      .then(user => {
        array.push(user);
      }).catch((error) => {
        res.status(400).send(`
          Incorrect syntax. Please, check your request. ${error}
        `);
      });
    }
  }
  res.status(201).send(`${21} new GH users created.`);
};

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

module.exports = UsersController;