// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    //   poster related
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },

    receiver: [
      {
        receiver: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        read: {
          type: Boolean,
          default: false
        },
        checked: {
          type: Boolean,
          default: false
        },
        receiverIsMentioned: {
          type: Boolean,
          default: false
        }
      }
    ],

    content: String,

    postId: String,

    storyId: String,

    secretId: String,

    commentId: String,

    replyId: String,

    anonymous: {
      type: Boolean,
      default: false
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    route: {
      type: String,
      enum: [
        'posts',
        'postComments',
        'stories',
        'storyComments',
        'secrets',
        'secretCommentsFromTeller',
        'secretCommentsFromCommenter'
      ]
    },

    someoneLiked: {
      type: Boolean,
      default: false
    },

    isFriendRequest: {
      type: Boolean,
      default: false
    },

    isFollow: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

notificationSchema.index({
  receiver: -1,
  createdAt: -1
});

// parent referencing, virtual populate

// child referencing

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
