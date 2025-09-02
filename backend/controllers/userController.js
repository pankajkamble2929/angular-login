const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = (req, res) => {
  const sql = 'SELECT id, name, email, user_type, is_active, created_at FROM angular_users';
  db.query(sql, (err, results) => {
    if (err) throw err;

    // Normal users: filter out sensitive info
    if (req.user.user_type === 'normal') {
      const normalView = results.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        is_active: user.is_active
      }));
      return res.json(normalView);
    }

    // Admin: return all info
    res.json(results);
  });
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, user_type, password, is_active } = req.body;

  let updateFields = [];
  let values = [];

  if (name) { updateFields.push('name = ?'); values.push(name); }
  if (email) { updateFields.push('email = ?'); values.push(email); }
  if (user_type) { updateFields.push('user_type = ?'); values.push(user_type); }
  if (typeof is_active !== 'undefined') { updateFields.push('is_active = ?'); values.push(is_active); }
  if (password) { 
    const hashedPassword = await bcrypt.hash(password, 10); 
    updateFields.push('password = ?'); 
    values.push(hashedPassword); 
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  const sql = `UPDATE angular_users SET ${updateFields.join(', ')} WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) throw err;
    res.json({ message: 'User updated successfully' });
  });
};

// Delete user (Admin only)
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM angular_users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User deleted successfully' });
  });
};
