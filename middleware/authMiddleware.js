exports.ensureAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error_msg', 'Пожалуйста, войдите в систему');
  res.redirect('/login');
};
