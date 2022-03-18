const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const UsersController = require('../controllers/UsersController');

// http://localhost:5000/users/
router.get('/', isAdmin, UsersController.viewAllUsers);

// http://localhost:5000/users/:username
router.get('/:username', auth, UsersController.viewUser);

// http://localhost:5000/users/
// {
//   "name": "John",
//   "username": "johndoe",
//   "email": "john@doe.com",
//   "password": "1234",
//   "gender": "m",
//   "birthdate": "1950-01-01",
//   "city": "Valencia"
// }
router.post('/', UsersController.newUser);

// http://localhost:5000/users/API
router.post('/api', UsersController.newUsersAPI);

// http://localhost:5000/users/GH/
router.post('/', isAdmin, UsersController.newGhUsers);

// http://localhost:5000/users/:user/delete
router.delete('/:username', auth, UsersController.deleteUser);

// http://localhost:5000/users/login
router.post('/login', UsersController.login);

module.exports = router;