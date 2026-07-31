const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['duelist', 'initiator', 'controller', 'sentinel'],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Agent', agentSchema);

