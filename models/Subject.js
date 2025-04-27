const db = require('../config/db');
class Subject{
  static async all(){
    const [rows]= await db.query('SELECT * FROM subjects');
    return rows;
  }
  static async create({name}){
    const [r]= await db.query('INSERT INTO subjects(name) VALUES(?)',[name]);
    return r.insertId;
  }
  static async update(id,{name}){
    await db.query('UPDATE subjects SET name=? WHERE id=?',[name,id]);
  }
  static async delete(id){
    await db.query('DELETE FROM subjects WHERE id=?',[id]);
  }
}
module.exports = Subject;
