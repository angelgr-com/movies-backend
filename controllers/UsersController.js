const UsersController = {};
const { User } = require('../models/index');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const PARSERNAME_API_KEY = process.env.PARSERNAME_API_KEY;
const PARSERNAME_RESULTS = 10;
const PARSERNAME_COUNTRY = 'ES';

UsersController.newUser = (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let isDataChecked = false;
  let dataErrors = false;

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
      res.status(400).send('Username or email already exists. They must be unique.');
    }
    else {
      if (name.length < 3 || username.length < 3) {
        console.log('error length');
        res.status(400).send(`
        Invalid data. Too short. Please, review and try again.
        `);
        dataErrors = true;
      }
      if (password.length < 4) {
        console.log('error length');
        res.status(400).send(`
        Invalid data. The minimum password length must be 4.
        `);
        dataErrors = true;
      }
      else if (!email.includes('@') || !email.includes('.com') ) {
        console.log('error includes');
        res.status(400).send(`
        Invalid email. Please, review and try again.
        `);
        dataErrors = true;
      }
      else if (!name.match(/^[a-zA-Z_ ]*$/)) {
        console.log('error numbers');
        res.status(400).send(`
        Please use alphabet characters only for name.
        `);
        dataErrors = true;
      }
      isDataChecked = true;
    }
    if (isDataChecked && !dataErrors) {
      try {
        console.log('create user');
        User.create({
          id: uuidv4(),
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, Number.parseInt(process.env.AUTH_ROUNDS)),
          gender: req.body.username,
          birthdate: req.body.birthdate || birthdate,
          city: req.body.city || randomCity,
        })
        .then(user => {
          res.status(201).send(`New user created. ${user.name}, welcome.`);
        });
      } catch (error) {
        res.status(400).send(`
          Invalid data. Please, review and try again. ${error}
        `);
      }
    }
  }).
  catch(error => {
    console.log(error);
  });
};

UsersController.login = (req, res) => {
  User.findOne({
      where : {email : req.body.email}
  })
  .then(User =>{
      if (!User) {
          res.status(401).send("Invalid user or password");
      }
      else {
        if (bcrypt.compareSync(req.body.password, User.password)) {
          let token = jwt.sign({ user: User }, process.env.AUTH_SECRET, {
            expiresIn: process.env.AUTH_EXPIRES
          });
          res.status(200).json({
              user: User.username,
              token: token
          });
        } else {
          res.status(401).json({ msg: "Invalid user or password" });
        }
      }
  })
  .catch(error => {
      res.send(error);
  })
};

UsersController.getUser = (req, res) => {
  try {      
    User.findOne({
      where : { username : req.params.username }
    })
    .then(user => {
      // Obtain the token ID of the user requesting details from a user
      let requestingUserID = 0;
      let token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
        if(err) {
          res.status(500).json({ msg: "A problem occurred while decoding the token: ", err });
        } else {
          req.user = decoded;
          requestingUserID = req.user.user.id;
        }
      });

      if (!User) {
        res.status(400).send("Invalid user");
      }
      // Only send own user details
      else if (requestingUserID === user.id) {
        const object = {
          name: user.name,
          username: user.username,
          email: user.email,
          gender: user.gender,
          birthdate: user.birthdate,
          city: user.city,
        };
        res.status(200).send(object);
      } else {
        res.status(401).send(`Unauthorized. You can't obtain details from another user`);
      }
    });
  } 
  catch (error) {
    res.send(error);
  }
};

UsersController.updatePassword = (req,res) => {
  let username = req.body.username;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  User
  .findOne({
      where : { username : username}
  })
  .then(userFound => {
    if(userFound){
      // if passwords match
      if (bcrypt.compareSync(oldPassword, userFound.password)) {
        // encrypt new password
        newPassword = bcrypt.hashSync(newPassword, Number.parseInt(process.env.AUTH_ROUNDS)); 

        //save new password
        let data = {
            password: newPassword
        }
        User.update(data, {
            where: {username : username}
        })
        .then(userUpdated => {
            res.status(201).send(`The password have been updated`);
        })
        .catch((error) => {
            res.status(400).json({ msg: `An error occurred while updating the password: ${error}`});
        });
      // if provided and stored passwords don't match
      } else {
          res.status(400).json({ msg: "Invalid user or password" });
      }
    }
  })
  .catch((error => {
      res.send(error);
  }));

};

UsersController.updateProfile = async (req, res) => {
  let data = req.body;
  let username = req.params.username;
  
  try {
    User
    .update(data, {
      where: {username : username}
    })
    .then(userUpdated => {
      res.status(201).send(`The profile have been updated`);
    });
  } catch (error) {
      res.status(400).send(error);
  }
};

UsersController.deleteUser = (req, res) => {
  try {
      User.destroy({
        where : { username : req.params.username }
      })
      .then(removedUser => {
        if (!removedUser) {
          res.status(400).send('Invalid user.');
        } else {
          res.status(201).send(`User ${req.params.username} has been removed.`);
        }
      });
  } catch (error) {
      res.status(400).send(error);
  }
};

UsersController.getAllUsers = (req, res) => {
  User.findAll()
  .then(data => {
    if(data){
      res.status(200).send(
        data.map(user => {
          const object = {};
          object.name = user.name;
          object.username = user.username;
          return object;
        })
      )
      }
  });
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

// Array for randomCity function
const city = ['Valencia', 'Torrent', 'Gandia', 
              'Paterna', 'Sagunt', 'Mislata', 
              'Burjassot', 'Ontinyent', 'Aldaia', 
              'Manises'];
UsersController.newUsersAPI = async (req, res) => {
  const userAPI = await axios.get(`
    https://api.parser.name/?api_key=${PARSERNAME_API_KEY}&endpoint=generate&country_code=${PARSERNAME_COUNTRY}&results=${PARSERNAME_RESULTS}
  `);
  const array = [];
  
  for (let i=0;i<PARSERNAME_RESULTS;i++) {
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
                                    Number.parseInt(process.env.AUTH_ROUNDS)),
          gender: userAPI.data.data[i].name.firstname.gender,
          birthdate: birthdate,
          city: randomCity,
        })
        .then(user => {
          array.push(user);
          if (i === 9) {
            res.status(201).send(`
              ${PARSERNAME_RESULTS} new users have been added.
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

module.exports = UsersController;