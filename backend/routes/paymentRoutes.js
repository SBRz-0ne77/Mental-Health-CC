const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment CRUD routes
router.post('/', paymentController.create);
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.delete);

// Additional routes for filtering
router.get('/user/:userId', paymentController.getByUserId);
router.get('/appointment/:appointmentId', paymentController.getByAppointmentId);

module.exports = router; 