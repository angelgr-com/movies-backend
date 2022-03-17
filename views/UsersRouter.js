const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const UsersController = require('../controllers/UsersController');

// http://localhost:3000/users/
router.get('/', isAdmin, UsersController.viewAllUsers);

// http://localhost:3000/users/:username
router.get('/:username', auth, UsersController.viewUser);

// http://localhost:3000/users/
router.post('/', UsersController.newUser);

// http://localhost:3000/users/API
router.post('/', isAdmin, UsersController.newUsersAPI);

// http://localhost:3000/users/GH/
router.post('/', isAdmin, UsersController.newGhUsers);

// http://localhost:3000/users/:user/delete
router.delete('/:username', auth, UsersController.deleteUser);

// http://localhost:3000/users/login
router.post('/login', UsersController.login);

module.exports = router;