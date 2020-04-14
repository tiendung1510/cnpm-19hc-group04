const mongoose = require('mongoose');
const { Schema } = mongoose;

const importerAssignmentSchema = new Schema(
  {
    importer: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel'
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel'
    },
    importedProducts: [{ type: Schema.Types.ObjectId, ref: 'ImportedProductModel' }],
    importingRequests: [{ type: Schema.Types.ObjectId, ref: 'ImportingRequestModel' }],
    priceTotal: {
      type: Number,
      default: 0
    },
    finishedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const ImporterAssignmentModel = mongoose.model('ImporterAssignmentModel', importerAssignmentSchema, 'ImporterAssignments');
module.exports = ImporterAssignmentModel;