const Admin = require('../models/Admin');

const adminController = {
  // Create new admin
  async create(req, res) {
    try {
      const { username, password, email } = req.body;

      // Validation
      if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const result = await Admin.create(username, password, email);
      res.status(201).json({ message: 'Admin created successfully', id: result.insertId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all admins
  async getAll(req, res) {
    try {
      const admins = await Admin.getAll();
      res.json(admins);
    } catch (error) {
      console.error('ADMIN GETALL ERROR:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get admin by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.getById(id);
      
      if (!admin || admin.length === 0) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      
      res.json(admin[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update admin
  async update(req, res) {
    try {
      const { id } = req.params;
      const { username, password, email } = req.body;

      // Validation
      if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
      }

      const result = await Admin.update(id, username, password, email);
      res.json({ message: 'Admin updated successfully' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete admin
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await Admin.delete(id);
      res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = adminController; 