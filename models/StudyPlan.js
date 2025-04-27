const db = require('../config/db');
class StudyPlan{
  static async all(){
    const [rows] = await db.query(
      `SELECT sp.*, g.direction, g.course, s.name AS subject_name, u.full_name AS teacher_name
       FROM study_plans sp
       JOIN study_groups g ON sp.group_id = g.id
       JOIN subjects s ON sp.subject_id = s.id
       JOIN users u ON sp.teacher_id = u.id`
    );
    return rows;
  }
  static async create({group_id,subject_id,teacher_id}){
    const [r] = await db.query(
      'INSERT INTO study_plans(group_id,subject_id,teacher_id) VALUES (?,?,?)',
      [group_id,subject_id,teacher_id]
    );
    return r.insertId;
  }
  static async delete(id){
    await db.query('DELETE FROM study_plans WHERE id=?',[id]);
  }
  static async byTeacher(teacher_id){
    const [rows] = await db.query(
      `SELECT sp.*, g.direction, g.course, s.name AS subject_name
       FROM study_plans sp
       JOIN study_groups g ON sp.group_id=g.id
       JOIN subjects s ON sp.subject_id=s.id
       WHERE sp.teacher_id=?`,[teacher_id]);
    return rows;
  }
}
module.exports = StudyPlan;
