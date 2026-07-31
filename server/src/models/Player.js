const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    realName: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['duelist', 'initiator', 'controller', 'sentinel', 'flex', 'igl'],
      default: 'flex',
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    rating: {
      type: Number,
      default: 1,
      min: 0,
      max: 2,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Player', playerSchema);

