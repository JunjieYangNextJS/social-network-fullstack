const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    //   story teller related
    content: {
      type: String,
      required: ['A story must have its content']
    },

    title: {
      type: String,
      required: ['A story must have a title']
    },

    images: {
      type: [String]
    },

    about: {
      type: String,
      enum: ['General', 'L', 'G', 'B', 'T', 'Q', 'I', 'A', '2S', '+More'],
      default: 'General'
    },

    storyTeller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A story must belong to a user']
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    editedAt: Date,

    exposedTo: {
      type: String,
      enum: ['public', 'friendsOnly', 'friendsAndFollowersOnly', 'private'],
      default: 'public'
    },

    willNotify: {
      type: Boolean,
      default: true
    },

    openComments: {
      type: Boolean,
      default: true
    },

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

    subscribers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A post must belong to a user']
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

    commentCount: {
      type: Number,
      default: 0
    },

    lastCommentedAt: {
      type: Date,
      default: Date.now
    },

    pinned: String,

    banned: {
      type: String
    },

    draft: {
      type: Boolean,
      default: false
    },

    sticky: {
      type: Boolean,
      default: false
    },

    modFavored: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

storySchema.index({
  exposedTo: -1,
  likesCount: -1,
  banned: 1,
  draft: 1,
  about: -1
});

storySchema.index({
  exposedTo: -1,
  commentCount: -1,
  banned: 1,
  draft: 1,
  about: -1
});

storySchema.index({
  createdAt: -1,
  exposedTo: -1,
  lastCommentedAt: -1,
  banned: 1,
  draft: 1,
  about: -1
});

storySchema.index({
  createdAt: -1,

  lastCommentedAt: -1,
  banned: 1,
  draft: 1,
  storyTeller: 1
});

// child referencing

storySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'storyTeller',
    select: 'username profileName photo friendList followers role'
  });
  // .populate({
  //   path: 'postComment',
  //   select: 'content'
  // });
  next();
});

// // parent referencing, virtual populate

// storySchema.virtual('storyComments', {
//   ref: 'StoryComment',
//   foreignField: 'story',
//   localField: '_id'
// });

// storySchema.virtual('storyReplies', {
//   ref: 'storyReply',
//   foreignField: 'storyComment',
//   localField: '_id'
// });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
