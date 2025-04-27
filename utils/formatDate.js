const { format } = require('date-fns');

module.exports = function(date) {
  if (!date) return '';
  return format(new Date(date), 'dd.MM.yyyy');
};
