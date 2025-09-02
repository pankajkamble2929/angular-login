const express = require('express');
const router = express.Router();
const { registerUser, activateUser, loginUser } = require('../controllers/authController');

// Registration route
router.post('/register', registerUser);

// Activation route
router.get('/activate/:token', activateUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
