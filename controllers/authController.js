const User = require('../models/User');

exports.showLogin = (req, res) => {
  res.render('auth/login');
};

exports.login = async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findByLogin(login);
    if (!user) {
      req.flash('error_msg', 'Неверный логин или пароль');
      return res.redirect('/login');
    }
    const valid = await User.validatePassword(user, password);
    if (!valid) {
      req.flash('error_msg', 'Неверный логин или пароль');
      return res.redirect('/login');
    }
    req.session.user = { id:user.id, role:user.role, full_name:user.full_name };
    res.redirect('/dashboard');
  } catch(e){
    console.error(e);
    req.flash('error_msg','Ошибка сервера');
    res.redirect('/login');
  }
};

exports.logout = (req,res)=>{
  req.session.destroy(()=> res.redirect('/login'));
};

exports.dashboardRedirect = (req,res)=>{
  if(!req.session.user) return res.redirect('/login');
  const role=req.session.user.role;
  if(role==='student') return res.redirect('/student/dashboard');
  if(role==='teacher') return res.redirect('/teacher/dashboard');
  if(role==='methodist') return res.redirect('/methodist/dashboard');
  res.redirect('/login');
};
