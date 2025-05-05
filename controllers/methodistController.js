const StudyGroup = require('../models/StudyGroup');
const Subject = require('../models/Subject');
const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');
const StudentGroup = require('../models/StudentGroup');

exports.dashboard = async (req,res)=>{
  // simple stats for quick view
  const [groups, subjects, students, teachers] = await Promise.all([
    StudyGroup.all(),
    Subject.all(),
    User.allByRole('student'),
    User.allByRole('teacher')
  ]);
  res.render('methodist/dashboard', {
    stats: {
      groups: groups.length,
      subjects: subjects.length,
      students: students.length,
      teachers: teachers.length
    }
  });
};

// GROUPS
exports.groups = async (req,res)=>{
  const groups = await StudyGroup.all();
  res.render('methodist/groups',{groups});
};
exports.createGroup = async (req,res)=>{
  const {direction,course}=req.body;
  await StudyGroup.create({direction,course});
  req.flash('success_msg','Группа создана');
  res.redirect('/methodist/groups');
};
exports.deleteGroup = async (req,res)=>{
  await StudyGroup.delete(req.params.id);
  req.flash('success_msg','Группа удалена');
  res.redirect('/methodist/groups');
};

// SUBJECTS
exports.subjects = async (req,res)=>{
  const subjects = await Subject.all();
  res.render('methodist/subjects',{subjects});
};
exports.createSubject = async (req,res)=>{
  await Subject.create({name:req.body.name});
  req.flash('success_msg','Предмет добавлен');
  res.redirect('/methodist/subjects');
};
exports.deleteSubject = async (req,res)=>{
  await Subject.delete(req.params.id);
  req.flash('success_msg','Предмет удалён');
  res.redirect('/methodist/subjects');
};

// STUDENTS
exports.students = async (req,res)=>{
  const [students, groups] = await Promise.all([
    User.allByRole('student'),
    StudyGroup.all()
  ]);
  res.render('methodist/students',{students, groups});
};
exports.createStudent = async (req,res)=>{
  const {login,password,full_name,phone_number,group_id}=req.body;
  const id = await User.create({login,password,role:'student',full_name,phone_number});
  await StudentGroup.addStudentToGroup(id, group_id);
  req.flash('success_msg','Студент добавлен');
  res.redirect('/methodist/students');
};
exports.deleteStudent = async (req,res)=>{
  await User.delete(req.params.id);
  req.flash('success_msg','Студент удалён');
  res.redirect('/methodist/students');
};

// TEACHERS
exports.teachers = async (req,res)=>{
  const teachers = await User.allByRole('teacher');
  res.render('methodist/teachers',{teachers});
};
exports.createTeacher = async (req,res)=>{
  const {login,password,full_name,phone_number}=req.body;
  await User.create({login,password,role:'teacher',full_name,phone_number});
  req.flash('success_msg','Преподаватель добавлен');
  res.redirect('/methodist/teachers');
};
exports.deleteTeacher = async (req,res)=>{
  await User.delete(req.params.id);
  req.flash('success_msg','Преподаватель удалён');
  res.redirect('/methodist/teachers');
};

// STUDY PLANS
exports.studyplans = async (req,res)=>{
  const [plans, groups, subjects, teachers] = await Promise.all([
    StudyPlan.all(),
    StudyGroup.all(),
    Subject.all(),
    User.allByRole('teacher')
  ]);
  res.render('methodist/studyplans',{plans,groups,subjects,teachers});
};
exports.createStudyPlan = async (req,res)=>{
  const {group_id,subject_id,teacher_id}=req.body;
  await StudyPlan.create({group_id,subject_id,teacher_id});
  req.flash('success_msg','Учебный план создан');
  res.redirect('/methodist/studyplans');
};
exports.deleteStudyPlan = async (req,res)=>{
  await StudyPlan.delete(req.params.id);
  req.flash('success_msg','Учебный план удалён');
  res.redirect('/methodist/studyplans');
};
// TASKS for a study plan
exports.studyplanTasks = async (req,res)=>{
  const planId = req.params.id;
  const plan = (await StudyPlan.all()).find(p => p.id == planId);
  if(!plan) {
    req.flash('error_msg','План не найден');
    return res.redirect('/methodist/studyplans');
  }
  const tasks = await require('../models/Task').byPlan(planId);
  res.render('methodist/studyplan-tasks',{plan,tasks});
};
exports.createTask = async (req,res)=>{
  const planId = req.params.id;
  const {title,description,deadline} = req.body;
  if(!title||!deadline){
    req.flash('error_msg','Заполните все поля');
    return res.redirect(`/methodist/studyplans/${planId}/tasks`);
  }
  await require('../models/Task').create({study_plan_id:planId,title,description,deadline});
  req.flash('success_msg','Задание добавлено');
  res.redirect(`/methodist/studyplans/${planId}/tasks`);
};

exports.updateStatus = async (req, res) => {
  const submissionId = req.params.id;
  const { status, returnTo } = req.body;   // + забираем URL возврата
  await StudentTask.updateStatus(submissionId, status);
  req.flash('success_msg', 'Статус обновлен');
  res.redirect('back');                   // ⬅ убираем
+  // Надёжно возвращаемся туда, откуда пришли
+  res.redirect(returnTo || req.get('referer') || '/teacher/dashboard');
};

