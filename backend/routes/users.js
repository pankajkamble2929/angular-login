const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

// All users (protected)
router.get('/', verifyToken, getAllUsers);

// Admin-only routes
router.put('/:id', verifyToken, isAdmin, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;
