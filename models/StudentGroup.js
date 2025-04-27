const db = require('../config/db');
class StudentGroup{
  static async addStudentToGroup(student_id,group_id){
    await db.query('INSERT INTO student_groups(student_id,group_id) VALUES(?,?)',[student_id,group_id]);
  }
  static async removeStudentFromGroup(student_id,group_id){
    await db.query('DELETE FROM student_groups WHERE student_id=? AND group_id=?',[student_id,group_id]);
  }
  static async studentsInGroup(group_id){
    const [rows]= await db.query(
      'SELECT u.* FROM users u JOIN student_groups sg ON u.id=sg.student_id WHERE sg.group_id=?',[group_id]);
    return rows;
  }
  static async groupOfStudent(student_id){
    const [rows]= await db.query(
      'SELECT g.* FROM study_groups g JOIN student_groups sg ON g.id=sg.group_id WHERE sg.student_id=?',[student_id]);
    return rows[0];
  }
}
module.exports = StudentGroup;
