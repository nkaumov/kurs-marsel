exports.allowRole = (role) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      return next();
    }
    req.flash('error_msg', 'Недостаточно прав');
    res.redirect('/dashboard');
  };
};
