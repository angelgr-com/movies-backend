const UsersController = {};
const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');

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