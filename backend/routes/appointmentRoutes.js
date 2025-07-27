const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Appointment CRUD routes
router.post('/', appointmentController.create);
router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getById);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);

// Additional routes for filtering
router.get('/user/:userId', appointmentController.getByUserId);
router.get('/doctor/:doctorId', appointmentController.getByDoctorId);

module.exports = router; 