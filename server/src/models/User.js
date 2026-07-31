const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    predictionStats: {
      totalPoints: {
        type: Number,
        default: 0,
      },
      accuracy: {
        type: Number,
        default: 0,
      },
      streak: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    role: this.role,
    predictionStats: this.predictionStats,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
