const mongoose = require('mongoose');
const { Schema } = mongoose;

const workAssigmentSchema = new Schema(
  {
    workShift: {
      type: Schema.Types.ObjectId,
      href: 'WorkShiftModel'
    },
    assigner: {
      type: Schema.Types.ObjectId,
      href: 'UserModel'
    },
    manager: {
      type: Schema.Types.ObjectId,
      href: 'UserModel'
    },
    description: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const WorkAssignmentModel = mongoose.model('WorkAssignmentModel', workAssigmentSchema, 'WorkAssignments');
module.exports = WorkAssignmentModel;