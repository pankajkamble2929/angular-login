const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Registration function
exports.registerUser = async (req, res) => {
  const { name, email, password, user_type } = req.body;

  if (!name || !email || !password || !user_type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    db.query('SELECT * FROM angular_users WHERE email = ?', [email], async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate activation token
      const activationToken = crypto.randomBytes(32).toString('hex');

      // Insert user into DB
      const sql = 'INSERT INTO angular_users (name, email, password, user_type, activation_token) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [name, email, hashedPassword, user_type, activationToken], (err, result) => {
        if (err) throw err;

        // Send activation email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Activate your account',
          html: `<p>Hello ${name},</p>
                 <p>Please click the link below to activate your account:</p>
                 <a href="${activationLink}">${activationLink}</a>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error sending activation email' });
          } else {
            return res.status(200).json({ message: 'Registration successful! Please check your email to activate your account.' });
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Activate Users
exports.activateUser = (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: 'Invalid activation token' });
  }

  // Find user with this token
  const sql = 'SELECT * FROM angular_users WHERE activation_token = ?';
  db.query(sql, [token], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired activation token' });
    }

    // Activate user
    const updateSql = 'UPDATE angular_users SET is_active = 1, activation_token = NULL WHERE activation_token = ?';
    db.query(updateSql, [token], (err, result) => {
      if (err) throw err;
      return res.status(200).json({ message: 'Account activated successfully! You can now login.' });
    });
  });
};

//Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user
  const sql = 'SELECT * FROM angular_users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(400).json({ message: 'Account not activated. Please check your email.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token and basic user info
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type
      }
    });
  });
};
