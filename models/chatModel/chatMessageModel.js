// review / rating / createdAt / ref to tour / ref to user

const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    chatRoom: {
      type: mongoose.Schema.ObjectId,
      ref: 'ChatRoom'
    },

    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },

    content: String,

    createdAt: {
      type: Date,
      default: Date.now
    },

    editedAt: Date
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// postSchema.index({ viewCount: -1 });

// postSchema.index({ likes: -1 });

// // child referencing

// chatMessageSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'sender',
//     select: 'username photo profileName'
//   });

//   next();
// });

// postSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'poster',
//     select: 'username photo'
//   });
//   // .populate({
//   //   path: 'postComment',
//   //   select: 'content'
//   // });
//   next();
// });

// parent referencing, virtual populate

// postSchema.virtual('postComments', {
//   ref: 'PostComment',
//   foreignField: 'post',
//   localField: '_id'
// });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
