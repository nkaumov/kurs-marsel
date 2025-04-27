const db = require('../config/db');
class StudentTask{
  static async submit({task_id,student_id,submission_file}){
    const [rows] = await db.query('SELECT * FROM student_tasks WHERE task_id=? AND student_id=?',[task_id,student_id]);
    if(rows.length){
      await db.query('UPDATE student_tasks SET submission_file=?, status="waiting", submitted_at=NOW(), reviewed_at=NULL WHERE id=?',
        [submission_file, rows[0].id]);
      return rows[0].id;
    }else{
      const [r] = await db.query(
        'INSERT INTO student_tasks(task_id,student_id,submission_file,status,submitted_at) VALUES (?,?,?,?,NOW())',
        [task_id,student_id,submission_file,'waiting']);
      return r.insertId;
    }
  }
  static async byStudent(student_id){
    const [rows] = await db.query(
      `SELECT st.*, t.title, t.deadline
       FROM student_tasks st
       JOIN tasks t ON st.task_id=t.id
       WHERE st.student_id=?`,[student_id]);
    return rows;
  }
  static async submissionsForTask(task_id){
    const [rows] = await db.query(
      `SELECT st.*, u.full_name
       FROM student_tasks st
       JOIN users u ON u.id=st.student_id
       WHERE st.task_id=?`,[task_id]);
    return rows;
  }
  static async updateStatus(id,status){
    await db.query('UPDATE student_tasks SET status=?, reviewed_at=NOW() WHERE id=?',[status,id]);
  }
}
module.exports = StudentTask;
