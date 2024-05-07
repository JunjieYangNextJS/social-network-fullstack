// review / rating / createdAt / ref to tour / ref to user

const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    users: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: [true, 'Users are not valid']
        },
        totalUnread: { type: Number, default: 0 },
        left: {
          type: Boolean,
          default: false
        },
        pinned: {
          type: Boolean,
          default: false
        },
        muted: {
          type: Boolean,
          default: false
        }
      }
    ],
    lastMessage: {
      type: String
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    totalMessages: { type: Number, default: 0 }
    // chatName: String,
    // private: true
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// postSchema.index({ viewCount: -1 });

// postSchema.index({ likes: -1 });

// // child referencing

chatRoomSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'users.user',
    select: 'username photo profileName whoCanMessageMe'
  });
  // .populate({
  //   path: 'postComment',
  //   select: 'content'
  // });
  next();
});

// parent referencing, virtual populate

chatRoomSchema.virtual('chatMessages', {
  ref: 'ChatMessage',
  foreignField: 'chatRoom',
  localField: '_id'
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
