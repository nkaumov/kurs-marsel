const db = require('../config/db');
class StudyGroup {
  static async all() {
    const [rows] = await db.query('SELECT * FROM study_groups');
    return rows;
  }
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM study_groups WHERE id=?', [id]);
    return rows[0];
  }
  static async create({ direction, course }) {
    const [res] = await db.query('INSERT INTO study_groups(direction,course) VALUES(?,?)',[direction, course]);
    return res.insertId;
  }
  static async update(id,{direction,course}) {
    await db.query('UPDATE study_groups SET direction=?, course=? WHERE id=?',[direction,course,id]);
  }
  static async delete(id){
    await db.query('DELETE FROM study_groups WHERE id=?',[id]);
  }
}
module.exports = StudyGroup;
