// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const storyCommentSchema = new mongoose.Schema(
  {
    //   storyTeller related
    commenter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A comment must belong to a user']
    },

    story: {
      type: mongoose.Schema.ObjectId,
      ref: 'Story',
      required: [true, 'A comment must belong to a story']
    },

    storyTeller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A story must belong to a user']
    },

    willNotify: {
      type: Boolean,
      default: true
    },

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

    understated: {
      type: Boolean,
      default: false
    },

    content: {
      type: String,
      required: ['A story must have its content']
    },

    route: { type: String, default: 'storyComments' },

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
storyCommentSchema.virtual('storyReplies', {
  ref: 'StoryReply',
  foreignField: 'storyComment',
  localField: '_id'
});

// child referencing

storyCommentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'commenter',
    select: 'username photo profileName role createdAt'
  });
  next();
});

storyCommentSchema.index({ commenter: 1, createdAt: -1 });

storyCommentSchema.index({ createdAt: -1, story: 1 });

storyCommentSchema.index({
  story: 1,
  likesCount: -1
});
storyCommentSchema.index({
  story: 1,
  commentCount: -1
});

const StoryComment = mongoose.model('StoryComment', storyCommentSchema);

module.exports = StoryComment;
