const mongoose = require('mongoose');
const USER_ROLE = require('./user.constant').USER_ROLE;
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    role: {
      type: String,
      default: USER_ROLE.CASHIER.type
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    dateOfBirth: {
      type: String,
      default: null
    },
    avatar: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);
const UserModel = mongoose.model(
  'UserModel',
  userSchema,
  'Users'
)
module.exports = UserModel;