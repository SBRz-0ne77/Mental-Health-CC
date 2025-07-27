const Appointment = require('../models/Appointment');

const appointmentController = {
  // Create new appointment
  async create(req, res) {
    try {
      const { userId, doctorId, date, status } = req.body;

      // Validation
      if (!userId || !doctorId || !date) {
        return res.status(400).json({ error: 'User ID, Doctor ID, and Date are required' });
      }

      // Validate date format
      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      // Check if date is in the future
      if (appointmentDate <= new Date()) {
        return res.status(400).json({ error: 'Appointment date must be in the future' });
      }

      const result = await Appointment.create(userId, doctorId, date, status || 'pending');
      res.status(201).json({ message: 'Appointment created successfully', id: result.insertId });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'Invalid User ID or Doctor ID' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all appointments
  async getAll(req, res) {
    try {
      const appointments = await Appointment.getAll();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get appointment by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.getById(id);
      
      if (!appointment || appointment.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      
      res.json(appointment[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update appointment
  async update(req, res) {
    try {
      const { id } = req.params;
      const { userId, doctorId, date, status } = req.body;

      // Validation
      if (!userId || !doctorId || !date) {
        return res.status(400).json({ error: 'User ID, Doctor ID, and Date are required' });
      }

      // Validate date format
      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const result = await Appointment.update(id, userId, doctorId, date, status || 'pending');
      res.json({ message: 'Appointment updated successfully' });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'Invalid User ID or Doctor ID' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete appointment
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await Appointment.delete(id);
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get appointments by user ID
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const appointments = await Appointment.getByUserId(userId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get appointments by doctor ID
  async getByDoctorId(req, res) {
    try {
      const { doctorId } = req.params;
      const appointments = await Appointment.getByDoctorId(doctorId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = appointmentController; 