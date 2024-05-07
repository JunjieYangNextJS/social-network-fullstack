// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const postReplySchema = new mongoose.Schema(
  {
    //   poster related
    post: String,

    postComment: {
      type: mongoose.Schema.ObjectId,
      ref: 'PostComment',
      required: [true, 'A reply must belong to a comment']
    },

    poster: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A reply must belong to a poster']
    },

    commenter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A reply must be sent to a commenter']
    },

    // willNotify: {
    //   type: Boolean,
    //   default: true
    // },

    // willNotifyCommenter: {
    //   type: Boolean,
    //   default: true
    // },

    content: {
      type: String,
      required: ['A reply must have its content']
    },

    replier: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A reply must belong to a user']
    },

    route: { type: String, default: 'postReplies' },

    createdAt: {
      type: Date,
      default: Date.now
    },

    editedAt: Date,

    // String of reporter IDs
    reports: [
      {
        reporterId: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        reportedFor: {
          type: String,
          enum: [
            'Hatred',
            'Spam',
            'Misinformation',
            'Harassment',
            'Violence',
            'Impersonation',
            'Doxing',
            'Plagiarism',
            'Other violations'
          ]
        }
      }
    ],

    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

postReplySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'replier',
    select: 'username photo profileName role'
  });
  next();
});

postReplySchema.index({ postComment: -1, createdAt: -1 });
postReplySchema.index({ replier: 1, createdAt: -1 });

const PostReply = mongoose.model('PostReply', postReplySchema);

module.exports = PostReply;
