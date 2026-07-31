const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    scoreline: {
      type: String,
      enum: ['1-0', '2-0', '2-1', '3-0', '3-1', '3-2'],
      required: true,
    },
    topFragger: {
      type: String,
      trim: true,
      default: '',
    },
    firstMapWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'scored'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

predictionSchema.index({ user: 1, match: 1 }, { unique: true });

module.exports = mongoose.model('Prediction', predictionSchema);

