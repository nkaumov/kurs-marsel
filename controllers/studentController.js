const StudentGroup = require('../models/StudentGroup');
const StudyPlan = require('../models/StudyPlan');
const Task = require('../models/Task');
const StudentTask = require('../models/StudentTask');

exports.dashboard = async (req, res) => {
  const studentId = req.session.user.id;
  const group = await StudentGroup.groupOfStudent(studentId);
  if (!group) return res.render('student/dashboard', { tasks: [] });

  const plans = await StudyPlan.all();
  const groupPlans = plans.filter(p => p.group_id === group.id);

  const tasks = [];
  for (const plan of groupPlans) {
    const planTasks = await Task.byPlan(plan.id);
    tasks.push(...planTasks);
  }

  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  const upcoming = tasks.filter(t => new Date(t.deadline) <= endOfWeek);

  res.render('student/dashboard', { tasks: upcoming });
};

exports.allTasks = async (req, res) => {
  const studentId = req.session.user.id;
  const group = await StudentGroup.groupOfStudent(studentId);
  if (!group) return res.render('student/tasks', { subjectMap: {} });

  const plans = await StudyPlan.all();
  const groupPlans = plans.filter(p => p.group_id === group.id);

  const subjectMap = {};
  for(const plan of groupPlans){
    const tasks = await Task.byPlan(plan.id);
    if(!subjectMap[plan.subject_name]) subjectMap[plan.subject_name]=[];
    subjectMap[plan.subject_name].push(...tasks);
  }

  res.render('student/tasks', { subjectMap });
};

exports.taskDetail = async (req,res)=>{
  const task = await Task.findById(req.params.id);
  res.render('student/task-detail', { task });
};

exports.submitTask = async (req,res)=>{
  const taskId = req.params.id;
  const studentId = req.session.user.id;
  const filePath = `/uploads/${req.file.filename}`;
  await StudentTask.submit({task_id:taskId, student_id:studentId, submission_file:filePath});
  req.flash('success_msg','Задание отправлено');
  res.redirect('/student/dashboard');
};
