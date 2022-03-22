const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const UsersController = require('../controllers/UsersController');

// GET ENDPOINTS
// http://localhost:5000/users/:username
router.get('/:username', auth, UsersController.getUser);

// POST ENDPOINTS
// {
//   "name": "John",
//   "username": "johndoe",
//   "email": "john@doe.com",
//   "password": "1234",
//   "gender": "m",
//   "birthdate": "1950-01-01",
//   "city": "Valencia"
// }
// http://localhost:5000/users/
router.post('/', UsersController.newUser);
// http://localhost:5000/users/login
router.post('/login', UsersController.login);
// http://localhost:5000/users/list
router.post('/list', isAdmin, UsersController.getAllUsers);
// http://localhost:5000/users/api
router.post('/api', isAdmin, UsersController.newUsersAPI);

// PUT ENDPOINTS
// http://localhost:5000/users/password
router.put('/password', auth, UsersController.updatePassword);
// http://localhost:5000/users/:username
router.put('/:username', auth, UsersController.updateProfile);

// DELETE ENDPOINTS
// http://localhost:5000/users/:username
router.delete('/:username', auth, UsersController.deleteUser);

module.exports = router;