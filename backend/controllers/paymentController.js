const Payment = require('../models/Payment');

const paymentController = {
  // Create new payment
  async create(req, res) {
    try {
      const { userId, appointmentId, amount, date, status } = req.body;

      // Validation
      if (!userId || !appointmentId || !amount || !date) {
        return res.status(400).json({ error: 'User ID, Appointment ID, Amount, and Date are required' });
      }

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
      }

      // Validate date format
      const paymentDate = new Date(date);
      if (isNaN(paymentDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const result = await Payment.create(userId, appointmentId, amount, date, status || 'pending');
      res.status(201).json({ message: 'Payment created successfully', id: result.insertId });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'Invalid User ID or Appointment ID' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all payments
  async getAll(req, res) {
    try {
      const payments = await Payment.getAll();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get payment by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const payment = await Payment.getById(id);
      
      if (!payment || payment.length === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      res.json(payment[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update payment
  async update(req, res) {
    try {
      const { id } = req.params;
      const { userId, appointmentId, amount, date, status } = req.body;

      // Validation
      if (!userId || !appointmentId || !amount || !date) {
        return res.status(400).json({ error: 'User ID, Appointment ID, Amount, and Date are required' });
      }

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
      }

      // Validate date format
      const paymentDate = new Date(date);
      if (isNaN(paymentDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const result = await Payment.update(id, userId, appointmentId, amount, date, status || 'pending');
      res.json({ message: 'Payment updated successfully' });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'Invalid User ID or Appointment ID' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete payment
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await Payment.delete(id);
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get payments by user ID
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const payments = await Payment.getByUserId(userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get payments by appointment ID
  async getByAppointmentId(req, res) {
    try {
      const { appointmentId } = req.params;
      const payments = await Payment.getByAppointmentId(appointmentId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = paymentController; 