const db = require('../db/index');

class Appointment {
  static async create(userId, doctorId, date, status = 'pending') {
    try {
      const [result] = await db.execute(
        'CALL sp_create_appointment(?, ?, ?, ?)',
        [userId, doctorId, date, status]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute('CALL sp_get_appointments()');
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT a.id, a.userId, a.doctorId, a.date, a.status,
                u.username as user_name, d.username as doctor_name, d.specialization
         FROM appointment a
         JOIN admin u ON a.userId = u.id
         JOIN doctor d ON a.doctorId = d.id
         WHERE a.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userId, doctorId, date, status) {
    try {
      const [result] = await db.execute(
        'CALL sp_update_appointment(?, ?, ?, ?, ?)',
        [id, userId, doctorId, date, status]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('CALL sp_delete_appointment(?)', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const [rows] = await db.execute(
        `SELECT a.id, a.userId, a.doctorId, a.date, a.status,
                d.username as doctor_name, d.specialization
         FROM appointment a
         JOIN doctor d ON a.doctorId = d.id
         WHERE a.userId = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByDoctorId(doctorId) {
    try {
      const [rows] = await db.execute(
        `SELECT a.id, a.userId, a.doctorId, a.date, a.status,
                u.username as user_name
         FROM appointment a
         JOIN admin u ON a.userId = u.id
         WHERE a.doctorId = ?`,
        [doctorId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Appointment; 