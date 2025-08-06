const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const mysql = require('mysql2/promise');
const cors = require('cors');

// Appointment CRUD routes
router.post('/', appointmentController.create);
router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getById);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);

// Additional routes for filtering
router.get('/user/:userId', appointmentController.getByUserId);
router.get('/doctor/:doctorId', appointmentController.getByDoctorId);

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // or your XAMPP MySQL password
      database: 'mental_health_cc'
    });
    const [rows] = await conn.query('SHOW TABLES;');
    console.log('Connected! Tables:', rows);
    await conn.end();
  } catch (err) {
    console.error('DB ERROR:', err);
  }
}

test();

module.exports = router; 