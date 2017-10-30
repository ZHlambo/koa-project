const Staff = require("../../models/staff");

const staffLogin = (req, cb) => {
  return Staff.staffLogin(req.body,cb);
}

module.exports = {
  staffLogin,
}
