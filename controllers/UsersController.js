const UsersController = {};
const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const parsername = require('../config/parsername');
const PARSER_RESULTS = 10;

UsersController.newUser = (req, res) => {
    try {
        User.create({
            name: req.body.name,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds)),
            birthdate: req.body.birthdate,
        })
        .then(user => {
            res.send(`New user created. ${user.name}, welcome.`);
        });
    } catch (error) {
        res.send(error);
    }
};

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