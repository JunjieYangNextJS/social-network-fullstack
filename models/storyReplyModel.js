// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const storyReplySchema = new mongoose.Schema(
  {
    //   storyer related
    story: String,

    storyTitle: String,

    storyTeller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A reply must belong to a story-teller']
    },

    commenter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A reply must belong to a commenter']
    },

    willNotify: {
      type: Boolean,
      default: true
    },

    willNotifyCommenter: {
      type: Boolean,
      default: true
    },

    storyComment: {
      type: mongoose.Schema.ObjectId,
      ref: 'StoryComment',
      required: [true, 'A reply must belong to a comment']
    },

    content: {
      type: String,
      required: ['A reply must have its content']
    },

    replier: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A reply must belong to a user']
    },

    route: { type: String, default: 'storyReplies' },

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

storyReplySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'replier',
    select: 'username photo profileName role'
  });
  next();
});

storyReplySchema.index({ storyComment: -1, createdAt: -1 });
storyReplySchema.index({ replier: 1, createdAt: -1 });

const StoryReply = mongoose.model('StoryReply', storyReplySchema);

module.exports = StoryReply;
