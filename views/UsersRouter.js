const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');

// http://localhost:3000/users/
router.post('/', UsersController.newUser);

// http://localhost:3000/users/:username
router.get('/:username', UsersController.viewUser);

// http://localhost:3000/users/:user/delete
router.delete('/:username', UsersController.deleteUser);

// http://localhost:3000/users/login
// router.post('/login', UsersController.login);

module.exports = router;
