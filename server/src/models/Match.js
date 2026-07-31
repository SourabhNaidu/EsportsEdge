const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    bestOf: {
      type: Number,
      enum: [1, 3, 5],
      default: 3,
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed'],
      default: 'upcoming',
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    score: {
      teamA: {
        type: Number,
        default: 0,
      },
      teamB: {
        type: Number,
        default: 0,
      },
    },
    resultDetails: {
      scoreline: {
        type: String,
        enum: ['1-0', '2-0', '2-1', '3-0', '3-1', '3-2', ''],
        default: '',
      },
      firstMapWinner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null,
      },
      topFragger: {
        type: String,
        trim: true,
        default: '',
      },
    },
  },
  { timestamps: true },
);

matchSchema.pre('validate', function validateTeams() {
  if (this.teamA && this.teamB && this.teamA.toString() === this.teamB.toString()) {
    throw new Error('A match needs two different teams');
  }
});

module.exports = mongoose.model('Match', matchSchema);
