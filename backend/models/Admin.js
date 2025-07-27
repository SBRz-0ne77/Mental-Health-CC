const db = require('../db/index');
const bcrypt = require('bcryptjs');

class Admin {
  static async create(username, password, email) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.execute(
        'CALL sp_create_admin(?, ?, ?)',
        [username, hashedPassword, email]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute('CALL sp_get_admins()');
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, username, email FROM admin WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, username, password, email) {
    try {
      let hashedPassword = password;
      if (password && password.length < 60) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
      const [result] = await db.execute(
        'CALL sp_update_admin(?, ?, ?, ?)',
        [id, username, hashedPassword, email]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('CALL sp_delete_admin(?)', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Admin; 