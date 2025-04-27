const StudyPlan = require('../models/StudyPlan');
const Task = require('../models/Task');
const StudentTask = require('../models/StudentTask');

exports.dashboard = async (req,res)=>{
  const teacherId = req.session.user.id;
  const plans = await StudyPlan.byTeacher(teacherId);
  res.render('teacher/dashboard',{plans});
};

exports.groupTasks = async (req,res)=>{
  const planId = req.params.planId;
  const tasks = await Task.byPlan(planId);
  res.render('teacher/group-tasks',{tasks,planId});
};

exports.studentTasks = async (req,res)=>{
  const taskId = req.params.taskId;
  const submissions = await StudentTask.submissionsForTask(taskId);
  res.render('teacher/student-tasks',{submissions});
};

exports.updateStatus = async (req,res)=>{
  const submissionId = req.params.id;
  const {status} = req.body;
  await StudentTask.updateStatus(submissionId,status);
  req.flash('success_msg','Статус обновлен');
  res.redirect('back');
};
