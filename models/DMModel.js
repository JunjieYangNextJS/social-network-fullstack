// DM / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const DMSchema = new mongoose.Schema(
  {
    //   poster related
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A DM must belong to a user']
    },

    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A DM must be sent to a user']
    },

    willNotify: {
      type: Boolean,
      default: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    // stars: Number,

    content: {
      type: String,
      required: ['A DM must have its content']
    },

    anonymous: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      enum: ['DM', 'Review', 'Suggestion, SecretMessage'],
      default: 'DM'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// DMSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'replier',
//     select: 'username photo profileName'
//   });
//   next();
// });
DMSchema.index({ receiver: 1 });

const DM = mongoose.model('DM', DMSchema);

module.exports = DM;
