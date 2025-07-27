const db = require('../db/index');

class Payment {
  static async create(userId, appointmentId, amount, date, status = 'pending') {
    try {
      const [result] = await db.execute(
        'CALL sp_create_payment(?, ?, ?, ?, ?)',
        [userId, appointmentId, amount, date, status]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute('CALL sp_get_payments()');
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT p.id, p.userId, p.appointmentId, p.amount, p.date, p.status,
                u.username as user_name, a.date as appointment_date,
                d.username as doctor_name
         FROM payment p
         JOIN admin u ON p.userId = u.id
         JOIN appointment a ON p.appointmentId = a.id
         JOIN doctor d ON a.doctorId = d.id
         WHERE p.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userId, appointmentId, amount, date, status) {
    try {
      const [result] = await db.execute(
        'CALL sp_update_payment(?, ?, ?, ?, ?, ?)',
        [id, userId, appointmentId, amount, date, status]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('CALL sp_delete_payment(?)', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const [rows] = await db.execute(
        `SELECT p.id, p.userId, p.appointmentId, p.amount, p.date, p.status,
                a.date as appointment_date, d.username as doctor_name
         FROM payment p
         JOIN appointment a ON p.appointmentId = a.id
         JOIN doctor d ON a.doctorId = d.id
         WHERE p.userId = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByAppointmentId(appointmentId) {
    try {
      const [rows] = await db.execute(
        `SELECT p.id, p.userId, p.appointmentId, p.amount, p.date, p.status,
                u.username as user_name
         FROM payment p
         JOIN admin u ON p.userId = u.id
         WHERE p.appointmentId = ?`,
        [appointmentId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Payment; 