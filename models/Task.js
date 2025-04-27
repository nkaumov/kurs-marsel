const db = require('../config/db');
class Task{
  static async create({study_plan_id,title,description,deadline}){
    const [r] = await db.query(
      'INSERT INTO tasks(study_plan_id,title,description,deadline) VALUES (?,?,?,?)',
      [study_plan_id,title,description,deadline]);
    return r.insertId;
  }
  static async byPlan(study_plan_id){
    const [rows]= await db.query('SELECT * FROM tasks WHERE study_plan_id=?',[study_plan_id]);
    return rows;
  }
  static async findById(id){
    const [rows]= await db.query('SELECT * FROM tasks WHERE id=?',[id]);
    return rows[0];
  }
}
module.exports = Task;
