const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const { verifyToken, isAdmin } = require('./middleware/auth');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

app.get('/api/admin-only', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'You are an admin!', user: req.user });
});

app.use('/api/users', userRoutes);
