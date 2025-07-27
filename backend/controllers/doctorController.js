const Doctor = require('../models/Doctor');

const doctorController = {
  // Create new doctor
  async create(req, res) {
    try {
      const { username, password, email, specialization } = req.body;

      // Validation
      if (!username || !password || !email || !specialization) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const result = await Doctor.create(username, password, email, specialization);
      res.status(201).json({ message: 'Doctor created successfully', id: result.insertId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all doctors
  async getAll(req, res) {
    try {
      const doctors = await Doctor.getAll();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get doctor by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const doctor = await Doctor.getById(id);
      
      if (!doctor || doctor.length === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      
      res.json(doctor[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update doctor
  async update(req, res) {
    try {
      const { id } = req.params;
      const { username, password, email, specialization } = req.body;

      // Validation
      if (!username || !email || !specialization) {
        return res.status(400).json({ error: 'Username, email, and specialization are required' });
      }

      const result = await Doctor.update(id, username, password, email, specialization);
      res.json({ message: 'Doctor updated successfully' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete doctor
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await Doctor.delete(id);
      res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = doctorController; 