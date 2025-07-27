const db = require('../db/index');
const bcrypt = require('bcryptjs');

class Doctor {
  static async create(username, password, email, specialization) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.execute(
        'CALL sp_create_doctor(?, ?, ?, ?)',
        [username, hashedPassword, email, specialization]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute('CALL sp_get_doctors()');
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, username, email, specialization FROM doctor WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, username, password, email, specialization) {
    try {
      let hashedPassword = password;
      if (password && password.length < 60) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
      const [result] = await db.execute(
        'CALL sp_update_doctor(?, ?, ?, ?, ?)',
        [id, username, hashedPassword, email, specialization]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('CALL sp_delete_doctor(?)', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Doctor; 