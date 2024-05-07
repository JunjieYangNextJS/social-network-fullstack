// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema(
  {
    //   poster related
    commenter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A comment must belong to a user']
    },

    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'A comment must belong to a post']
    },

    poster: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A story must belong to a user']
    },

    // willNotify: {
    //   type: Boolean,
    //   default: true
    // },

    willNotifyCommenter: {
      type: Boolean,
      default: true
    },

    subscribers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A story must belong to a user']
      }
    ],

    // postTitle: String,

    // about: {
    //   type: String,
    //   enum: ['General', 'L', 'G', 'B', 'T', 'Q', 'I', 'A', '2S', 'Others'],
    //   default: 'General'
    // },

    content: {
      type: String,
      required: [true, 'A post must have its content']
    },

    route: { type: String, default: 'postComments' },

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
    // images: {
    //   type: [String]
    // },

    createdAt: {
      type: Date,
      default: Date.now
    },

    editedAt: {
      type: Date
    },

    lastRepliedAt: {
      type: Date
    },

    // Replier related

    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],

    likesCount: {
      type: Number,
      default: 0
    },

    replyCount: {
      type: Number,
      default: 0
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// parent referencing, virtual populate
postCommentSchema.virtual('postReplies', {
  ref: 'PostReply',
  foreignField: 'postComment',
  localField: '_id'
});

// child referencing

postCommentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'commenter',
    select: 'username photo profileName role createdAt'
  });
  next();
});

postCommentSchema.index({ commenter: 1, createdAt: -1 });

postCommentSchema.index({ createdAt: -1, post: 1 });

postCommentSchema.index({
  post: 1,
  likesCount: -1
});

postCommentSchema.index({
  post: 1,
  commentCount: -1
});

const PostComment = mongoose.model('PostComment', postCommentSchema);

module.exports = PostComment;
