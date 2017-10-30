const Staff = require("../../models/staff");

const staffLogin = (ctx) => {
  return Staff.staffLogin(ctx.request.body,ctx);
}

module.exports = {
  staffLogin,
}
