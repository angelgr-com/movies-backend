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

module.exports = UsersController;