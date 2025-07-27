const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin CRUD routes
router.post('/', adminController.create);
router.get('/', adminController.getAll);
router.get('/:id', adminController.getById);
router.put('/:id', adminController.update);
router.delete('/:id', adminController.delete);

module.exports = router; 