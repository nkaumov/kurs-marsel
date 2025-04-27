const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async findByLogin(login) {
    const [rows] = await db.query('SELECT * FROM users WHERE login = ?', [login]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ login, password, role, full_name, phone_number }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (login, password, role, full_name, phone_number) VALUES (?,?,?,?,?)',
      [login, hash, role, full_name, phone_number]
    );
    return result.insertId;
  }

  static async allByRole(role) {
    const [rows] = await db.query('SELECT * FROM users WHERE role=?', [role]);
    return rows;
  }

  static async update(id, { full_name, phone_number }) {
    await db.query(
      'UPDATE users SET full_name=?, phone_number=? WHERE id=?',
      [full_name, phone_number, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE id=?', [id]);
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User;
