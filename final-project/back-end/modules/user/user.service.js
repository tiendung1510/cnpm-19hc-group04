const UserModel = require('./user.model');

const checkUserPermisson = async (_id, role) => {
  const userByRole = await UserModel.findOne({ _id, role });
  return userByRole ? true : false;
}

module.exports = {
  checkUserPermisson
}
